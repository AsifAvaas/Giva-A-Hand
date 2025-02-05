import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./db.js"; 

const router = express.Router();


router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        const values = [name, email, hashedPassword];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }

            const token = jwt.sign({ email }, "your_secret_key", { expiresIn: "1h" });

            res.status(201).json({ message: "User registered successfully", token });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return res.status(401).json({ error: "User not found" });
        }

        const user = result[0];

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        
        const token = jwt.sign({ email: user.email }, "your_secret_key", { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    });
});

export default router;
