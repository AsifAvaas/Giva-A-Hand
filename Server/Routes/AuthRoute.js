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




router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const [users] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = users[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        // Check if the user exists in helper tables
        const helperTables = {
            volunteers: "volunteers",
            doctors: "doctors",
            blood_donors: "blood_donors",
        };

        let helperId = null;
        let helperType = null;

        for (const [type, table] of Object.entries(helperTables)) {
            const [helpers] = await db.promise().query(`SELECT * FROM ${table} WHERE user_id = ?`, [user.user_id]);
            if (helpers.length > 0) {
                helperId = helpers[0][`${type.slice(0, -1)}_id`]; // e.g., volunteer_id, doctor_id, blood_donor_id
                helperType = type;
                break; // Stop checking once a match is found
            }
        }

        res.status(201).json({
            success: true,
            message: "Login successful",
            userId: user.user_id,
            token,
            role: user.role,
            helperId,
            helperType,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
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

        res.status(201).json({ success: true, message: "Login successful", adminId: user.admin_id, token, role: 'admin' });
    });
});


export default router;
