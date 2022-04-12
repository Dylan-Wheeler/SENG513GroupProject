const e = require("express");
const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

// Find the given user in the DB and get information about them
exports.getUserInfo = (userID) => {
    var sql = "SELECT * FROM users where id = ?";
    return new Promise((resolve, reject) => {
        db.query(sql, userID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                let user = {};
                user.name = results[0].name;
                user.wins = results[0].games_won;
                user.losses = results[0].games_lost;
                user.draws = results[0].games_drawn;
                user.gamesPlayed = user.wins + user.losses + user.draws;
                if (isNaN(user.wins / user.gamesPlayed)) {
                    user.winRate = 0;
                } else {
                    user.winRate = (user.wins / user.gamesPlayed) * 100;
                }

                resolve(user);
            }
        });
    });
};
