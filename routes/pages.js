const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/home", authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render("home");
    } else {
        res.redirect("/login");
    }
});

router.get("/ingame", authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render("ingame");
    } else {
        res.redirect("/login");
    }
});

module.exports = router;
