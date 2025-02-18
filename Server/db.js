import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: password,
    database: database,
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {

        console.log("Connected to MySQL database");
    }
});

export default db;
