const express = require("express");
const mysql = require('mysql');
const dotenv = require('dotenv')
const path = require('path');



const app = express();
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

app.set('view engine', 'hbs');

db.connect( (error) => {
    if (error){
        console.log(error)
    }else{
        console.log("MySql connected....")
    }
})

// Define Routes
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));

app.listen(8080,() =>{
    console.log("Server has started on port 8080")
})
