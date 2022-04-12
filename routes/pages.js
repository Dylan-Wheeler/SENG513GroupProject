const express = require("express");
const authController = require("../controllers/auth");
const userInfoController = require("../controllers/userInfo")

const router = express.Router();

router.get("/", (req, res) => {
    res.render("login");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/home", authController.isLoggedIn, async (req, res) => {

    if (req.user) {
        // Obtain user info from database
        userInfo = await userInfoController.getUserInfo(req.user.id);
        
        // Passing the user info into ejs page
        res.render("home", userInfo);
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
