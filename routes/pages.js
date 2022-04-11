const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("login.html");
});

router.get("/signup", (req, res) => {
    res.render("signup.html");
});

router.get("/login", (req, res) => {
    res.render("login.html");
});

router.get("/home", authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render("home.html");
    } else {
        res.redirect("/login");
    }
});

router.get("/ingame", authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render("ingame.html");
    } else {
        res.redirect("/login");
    }
});

module.exports = router;
