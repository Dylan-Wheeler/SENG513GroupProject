const express = require("express");
const mysql = require('mysql');
const dotenv = require('dotenv')
const path = require('path');
const cookiePasrer = require('cookie-parser');


const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const gameLogic = require("./gameLogic");
const io = new Server(server);

dotenv.config({path: './.env'});

const db =  mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

// Parse URL encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended:false}));
// Parse Json bodeis (as sent from HTML forms)
app.use(express.json());

app.use(cookiePasrer());

app.set('view engine', 'hbs');

db.connect( (error) => {
    if (error){
        console.log(error)
    }else{
        var sql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY , name VARCHAR(255) NOT NULL, email VARCHAR(255), password VARCHAR(255) NOT NULL, status VARCHAR(10) DEFAULT 'offline' NOT NULL, games_played INT DEFAULT 0 NOT NULL, games_won INT DEFAULT 0 NOT NULL, games_lost INT DEFAULT 0 NOT NULL, games_drawn INT DEFAULT 0 NOT NULL, win_percentage INT DEFAULT 0 NOT NULL, loss_percentage INT DEFAULT 0 NOT NULL)";  
        db.query(sql, function (error, result) {  
        if (error) throw error;  
        }); 
        console.log("MySql connected....")
    }
})

// Define Routes
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));

app.listen(8080,() =>{
    console.log("Server has started on port 8080")
})


// Test

// let game = gameLogic.createBoard(7,6)
// console.log(gameLogic.insertPiece(game, '2', 1))
// console.log(game)
// console.log(gameLogic.insertPiece(game, '1', 2))
// console.log(game)
// console.log(gameLogic.insertPiece(game, '1', 3))
// console.log(game)
// console.log(gameLogic.insertPiece(game, '2', 4))
// console.log(game)
// console.log(gameLogic.insertPiece(game, '1', 5))
// console.log(game)
// console.log(gameLogic.insertPiece(game, '1', 2))
// console.log(game)

// console.log(gameLogic.checkWin(game))

// Game Server 
io.on('connection', (socket) => {
    console.log('a user connected');
});
  
server.listen(3000, () => {
console.log('listening on *:3000');
});
