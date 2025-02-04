import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "precious",
    database: "giveahand" 
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});


app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const values = [name, email, hashedPassword];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        
        const token = jwt.sign({ email }, "your_secret_key", { expiresIn: '1h' });

        res.status(201).json({ message: "User registered successfully", token });
    });
});




app.listen(8000, () => {
    console.log("Server running on port 8000");
});
