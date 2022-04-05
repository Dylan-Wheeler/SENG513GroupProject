import { createConnection } from "mysql";
import { sign, verify } from "jsonwebtoken";
import { hash, compare } from "bcryptjs";
import { promisify } from "util";

const db = createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

export function register(req, res) {
    console.log(req.body);

    const { name, email, password, confirmPassword } = req.body;
    if (
        name.length == 0 ||
        email.length == 0 ||
        password.length == 0 ||
        confirmPassword.length == 0
    ) {
        return res.render("register", {
            message: "All fields must be inputed",
        });
    }

    db.query(
        "SELECT email FROM users WHERE email = ?",
        [email],
        async (error, results) => {
            if (error) {
                console.log(error);
            }
            if (results.length > 0) {
                return res.render("register", {
                    message: "Email is already registered",
                });
            } else if (password != confirmPassword) {
                return res.render("register", {
                    message: "Passwords do not match",
                });
            }

            let hashedPassword = await hash(password, 10);
            console.log(hashedPassword);

            db.query(
                "INSERT INTO users SET ?",
                { name: name, email: email, password: hashedPassword },
                (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(results);
                        return res.render("register", {
                            message: "User Registered",
                        });
                    }
                }
            );
        }
    );
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render("login", {
                message: "All fields must be inputed",
            });
        }
        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (error, results) => {
                console.log(results);
                // wrong email or password
                if (
                    results.length == 0 ||
                    !(await compare(password, results[0].password))
                ) {
                    res.status(401).render("login", {
                        message: "Email or Password is incorrect",
                    });
                    // correct credentials
                } else {
                    db.query(
                        "UPDATE users SET status = ? WHERE email = ?",
                        ["online", email],
                        (error, results) => {
                            if (error) {
                                console.log(error);
                            }
                        }
                    );

                    const id = results[0].id;

                    const token = sign({ id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN,
                    });

                    const cookieOptions = {
                        expires: new Date(
                            Date.now() +
                                process.env.JWT_COOKIE_EXPIRES *
                                    24 *
                                    60 *
                                    60 *
                                    1000
                        ),
                        httpOnly: true,
                    };

                    res.cookie("jwt", token, cookieOptions);
                    res.status(200).redirect("/mainMenu");
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
}

export async function isLoggedIn(req, res, next) {
    console.log(req.cookies);

    if (req.cookies.jwt) {
        try {
            // verify token
            const decoded = await promisify(verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            console.log(decoded);

            // check if user still exists
            db.query(
                "SELECT * FROM users WHERE id = ?",
                [decoded.id],
                (error, results) => {
                    console.log(results);

                    if (results.length == 0) {
                        return next();
                    }

                    req.user = results[0];
                    return next();
                }
            );
        } catch (error) {
            console.log(error);
        }
    } else {
        next();
    }
}

export async function logout(req, res, next) {
    if (req.cookies.jwt) {
        try {
            // verify token
            const decoded = await promisify(verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            console.log(decoded);

            // update user status in db
            db.query(
                "UPDATE users SET status = ? WHERE id = ?",
                ["offline", decoded.id],
                (error, results) => {
                    console.log(results[0]);
                }
            );

            res.cookie("jwt", "logout", {
                expires: new Date(Date.now() + 2),
                httpOnly: true,
            });

            res.status(200).redirect("/");
        } catch (error) {
            console.log(error);
        }
    }
}
