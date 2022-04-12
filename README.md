# SENG 513 Group Project

### Authors: Dylan Wheeler, Ahmed Zahran, and Aron Mao

Code located on github at: https://github.com/Dylan-Wheeler/SENG513GroupProject.git

## About

This project was created for the CPSC 513 class at the University of Calgary during the Winter 2022 semester taught by Lorans Alabood.
The application allows users to play the game Connect 4 and will track different statistics about their account including the number games played and their win/loss ratio. User data is persistent and will be stored in a local database created using MySQL.

## How to Run the Application

### A. Initializing the MySQL database

1. Download and install MySQL (Download can be found at https://www.mysql.com/downloads/)

-   Take note of the local instance password used. This will be required in a later step

2. Create a new MySQL database named `connect4` (Found by clicking the top-left 'create a new schema in the connected server' button when the local instance is selected)
3. Open the file `.env` and input your local instance password into the line `DATABASE_PASSWORD` after the = sign

-   This line should appear as follows: `DATABASE_PASSWORD = your-db-password`

### B. Installing dependencies

1. Ensure node.js and the Node Packet Manager (npm) are installed on your local device
2. In the command prompt of your choice navigate to the root folder of this application
3. Run the command `npm install` to install all required dependencies

### C. Running the application

1. Ensure node.js and the Node Packet Manager (npm) are installed on your local device
2. In the command prompt of your choice navigate to the root folder of this application
3. Run the command `npm start` to run the application server on your localhost at port 8080
4. In the web browser of your choice, navigate to `localhost:8080` to be brought to the login page of the application
