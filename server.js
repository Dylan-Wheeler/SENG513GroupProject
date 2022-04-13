const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const gameLogic = require("./gameLogic");
const io = new Server(server);

dotenv.config({ path: "./.env" });

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

// Register view engine 
app.set("view engine", "ejs");

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

// Parse URL encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse Json bodeis (as sent from HTML forms)
app.use(express.json());

app.use(cookieParser());

// app.engine("html", require("hbs").__express);

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        var sql =
            "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY , name VARCHAR(255) NOT NULL, email VARCHAR(255), password VARCHAR(255) NOT NULL, status VARCHAR(10) DEFAULT 'offline' NOT NULL, games_won INT DEFAULT 0 NOT NULL, games_lost INT DEFAULT 0 NOT NULL, games_drawn INT DEFAULT 0 NOT NULL)";
        db.query(sql, function (error, result) {
            if (error) throw error;
        });
        console.log("MySql connected....");
    }
});

var getIOInstance = function() {
    return io;
}


// Define Routes
app.use("/", require("./routes/pages")(getIOInstance));
app.use("/auth", require("./routes/auth"));

// app.listen(8080, () => {
//     console.log("Server has started on port 8080");
// });

//Test

// let game = gameLogic.createBoard(7,6);
// console.log(gameLogic.insertPiece(game, '2', 1))
// console.log(game)
// console.log(gameLogic.insertPiece(game, '2', 2))
// console.log(game)
// console.log(gameLogic.insertPiece(game, '1', 3))
// console.log(game)
// console.log(gameLogic.insertPiece(game, '2', 4))
// console.log(game)
// console.log(gameLogic.insertPiece(game, '1', 5))
// console.log(game)
// console.log(gameLogic.insertPiece(game, '1', 2))
// console.log(game)
// gameLogic.insertPiece(game, '2', 6)
// gameLogic.insertPiece(game, '2', 5)
// gameLogic.insertPiece(game, '1', 4)
// gameLogic.insertPiece(game, '2', 4)
// gameLogic.insertPiece(game, '2', 3)
// gameLogic.insertPiece(game, '1', 5)
// gameLogic.insertPiece(game, '2', 5)

// console.log("Result: " + gameLogic.checkWin(game))
// console.log(game)

// Game Server

rooms = new Map();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateRoomCode(length) {
    var possibleChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var room = '';
 
    for(var i = 0; i < length; i++) {
        room += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }

    return room;
}

function checkIfAlreadyInRoom(id) {
    for (let [code, room] of rooms.entries()) {
        if (room.player1 && room.player1.userID === id ) {
            return {code: code, player: "player1"};
        } 

        if (room.player2 && room.player2.userID === id ) {
            return {code: code, player: "player2"};
        } 
    }
    return null;
}

function findAvailableRoom() {
    // Return room code or null if there isn't an available room
    for (let [code, room] of rooms.entries()) {
        if (!(room.player1 && room.player2)) { // Both spots are not occupied. At least one spot
            return code; // Available room exists. Return room code
        }
    }

    // No available rooms
    return null;

}

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("request online users", () => {
        // Getting online users 
        var sql = "SELECT name, status FROM users WHERE status = 'online' OR status = 'in-game'";
        db.query(sql, (error,results) => {  
            if (error) throw error;
            socket.emit("online users response", {results});
        });

    });

    // A user will be logging out of system so update all users
    socket.on("user logout", async() => {
        
        await sleep(2000);
        var sql = "SELECT name, status FROM users WHERE status = 'online' OR status = 'in-game'";
        db.query(sql, (error,results) => {  
            if (error) throw error;
            io.emit("online users response", {results});
        });
    });

    // Handling messages from game
    socket.on("join", (userData) => {

        // Check if user is already in room. If so, reconnect to that room
        var temp = checkIfAlreadyInRoom(userData.userID);
        console.log(temp);
        if (temp) { // There is a room that the user is already in
            console.log("User is already in room");
            if (temp.player === "player1") {
                rooms.get(temp.code).player1Socket = socket.id
            } else if (temp.player === "player2") {
                rooms.get(temp.code).player2Socket = socket.id
            }   
            io.to(socket.id).emit("room assignment", temp.code);
            console.log(rooms);
        } else {

            roomCode = findAvailableRoom();
            console.log(roomCode);
            if (roomCode) { // Available room found, join that room
                // Find the room corresponding to the room code
                let room = rooms.get(roomCode);
                if (!room.player1) { // Player 1 slot free
                    room.player1 = userData;
                    room.player1Socket = socket.id;
                } else { // Player 2 slot free
                    room.player2 = userData;
                    room.player2Socket = socket.id;
                }
    
                if (room.player1Socket) { // Player1 socket exists
                    io.to(room.player1Socket).emit("room assignment", roomCode);
                }
                if (room.player2Socket) { // Player2 socket exists
                    io.to(room.player2Socket).emit("room assignment", roomCode);
                }
    
            } else { // No available room, create new room
    
                let room = {
                    board : gameLogic.createBoard(7,6) ,
                    player1 : userData,
                    player2 : null,
                    player1Socket : socket.id,
                    player2Socket : null,
                    player1Turn : true,
                }
                
                let newCode;
                while (true) {
                    newCode = generateRoomCode(6);
                    // Check if the code is already being used
                    if (!rooms.has(newCode)) break;
                }
    
                // Create Room
                rooms.set(newCode, room);
    
                // Send room code to client
                io.to(room.player1Socket).emit("room assignment", newCode);
    
    
            }
    
            console.log(rooms);
        }
    });

    socket.on("get game state", (roomCode) => {

        result = {};

        room = rooms.get(roomCode);

        result.board = room.board;
        result.player1Turn = room.player1Turn;

        io.to(socket.id).emit("response game state", result);

    });

    socket.on("get players", (roomCode) => {

        result = {};

        room = rooms.get(roomCode);

        result.player1 = room.player1;
        result.player2 = room.player2;

        io.to(socket.id).emit("response players", result)

    });
    
});

server.listen(8080, () => {
    console.log("listening on *:8080");
});
