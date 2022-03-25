const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const db =  mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register =(req,res) => {
    console.log(req.body);

    const { name, email, password, confirmPassword} = req.body;
    if (name.length == 0 || email.length == 0 || password.length == 0 || confirmPassword.length == 0 ){
        return res.render('register',{
            message: 'All fields must be inputed'
        });
    }

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error,results) => {
        if (error){
            console.log(error);
        }
        if (results.length > 0){
            return res.render('register',{
                message: 'Email is already registered'
            })
        } else if(password != confirmPassword){
            return res.render('register',{
                message: 'Passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password,10);
        console.log(hashedPassword);
        
        db.query('INSERT INTO users SET ?', {name: name, email:email, password: hashedPassword}, (error,results) => {
            if(error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register',{
                    message: 'User Registered'
                });
            }
        });
    });
}

exports.login =(req,res) => {
    console.log(req.body);

    const { email, password} = req.body;

    if (email.length == 0 || password.length == 0 ){
        return res.render('login',{
            message: 'All fields must be inputed'
        });
    }
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error,results) => {
        if (error){
            console.log(error);
        }
        if (results.length == 0 ){
            return res.render('login',{
                message: 'Email Is Not Registered'
            })
        } else {
            const hashedPassword = results[0].password;
            if (await bcrypt.compare(password,hashedPassword)){
                console.log('Login Successful');
                return res.render('mainMenu');
            }else{
                return res.render('login',{
                    message: 'Incorrect Password'
                });
            }

        }


        // Need to add a column for status to keep track of it 
        
        // db.query('INSERT INTO users SET ?', {name: name, email:email, password: hashedPassword}, (error,results) => {
        //     if(error) {
        //         console.log(error);
        //     } else {
        //         console.log(results);
        //         return res.render('register',{
        //             message: 'User Registered'
        //         });
        //     }
        // });
    });
}