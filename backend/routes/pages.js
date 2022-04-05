import { Router } from "express";
import { isLoggedIn } from "../controllers/auth";

const router = Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/mainMenu", isLoggedIn, (req, res) => {
    if (req.user) {
        res.render("mainMenu");
    } else {
        res.redirect("/login");
    }
});

export default router;
