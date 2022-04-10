const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/signup", (req, res) => {
    res.render("signup", function (err, html) {
        res.send(html);
    });
});

router.get("/login", (req, res) => {
    res.render("login", function (err, html) {
        res.send(html);
    });
});

router.get("/mainMenu", authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render("mainMenu");
    } else {
        res.redirect("/login");
    }
});

module.exports = router;
