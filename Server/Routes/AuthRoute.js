import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const jwt_secret = process.env.JWT_SECRET_KEY;

const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ? ,?)";
        const values = [name, email, hashedPassword, role];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }
            if (role === 'receivers') {
                return res.status(201).json({ success: true, message: "User registered successfully" });

            }
            const user_id = result.insertId;
            const sql2 = `INSERT INTO ${role} (user_id) VALUES (?)`;
            db.query(sql2, [user_id], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Database error" });
                }
                res.status(201).json({ success: true, message: "User registered successfully" });
            });

        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});


router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length === 0) {
            return res.status(500).json({ message: "User not found" });
        }

        const user = result[0];


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).json({ message: "Invalid credentials" });
        }


        const token = jwt.sign({ email: user.email }, jwt_secret, { expiresIn: "1h" });

        res.status(201).json({ success: true, message: "Login successful", userId: user.user_id, token, role: user.role });
    });
});



router.post("/admin/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)";
        const values = [name, email, hashedPassword];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }


            return res.status(201).json({ success: true, message: "Admin registered successfully" });


        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});


router.post("/admin/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM admins WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database error" });
        }

        if (result.length === 0) {
            return res.status(500).json({ success: false, message: "Admin not found" });
        }

        const user = result[0];


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).json({ success: false, message: "Invalid credentials" });
        }


        const token = jwt.sign({ email: user.email }, jwt_secret, { expiresIn: "1h" });

        res.status(201).json({ success: true, message: "Login successful", adminId: user.admin_id, token });
    });
});


export default router;
