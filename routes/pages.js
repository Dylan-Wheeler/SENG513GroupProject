const express = require("express");
const authController = require("../controllers/auth");
const userInfoController = require("../controllers/userInfo")

const router = express.Router();

module.exports = function(getIOInstance) {

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

        console.log("New");
        console.log(req.user);
    
        if (req.user) {
            // Obtain user info from database
            userInfo = await userInfoController.getUserInfo(req.user.id);
            // Obtain online users
            onlineUsers = await userInfoController.getOnlineUsers();
            // Obtain offline users
            offlineUsers = await userInfoController.getOfflineUsers();
            // Obtain offline users
            awayUsers = await userInfoController.getAwayUsers();
    
            userInfoController.setStatus(req.user.id, "online");
            getIOInstance().sockets.emit("update users");

            // Passing the users info into ejs page
            res.render("home", { data: { name: userInfo, onlineUsers: onlineUsers, offlineUsers: offlineUsers, awayUsers: awayUsers }});
        } else {
            res.redirect("/login");
        }
    });
    
    router.get("/ingame", authController.isLoggedIn, async (req, res) => {
        if (req.user) {
           
            // Obtain user info from database
            userInfo = await userInfoController.getUserInfo(req.user.id);
            userInfo.id = req.user.id;

            userInfoController.setStatus(req.user.id, "in-game");

            getIOInstance().sockets.emit("update users");
            
            res.render("ingame",userInfo);
        } else {
            res.redirect("/login");
        }
    });

    return router;

};


// module.exports = router;
