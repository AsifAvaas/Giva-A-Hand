import express from "express";
import db from "../db.js";



const router = express.Router();

router.post("/notice", async (req, res) => {
    const { admin_id, notice_title, notice_message, notice_pic } = req.body
    try {
        const adminCheckSql = "SELECT * FROM admins WHERE admin_id = ?";
        const adminCheckValues = [admin_id];

        const [admin] = await new Promise((resolve, reject) => {
            db.query(adminCheckSql, adminCheckValues, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });

        if (!admin) {
            return res.status(400).json({ error: "Invalid admin_id" });
        }
        const sql = "INSERT INTO notices (notice_title, notice_message, notice_pic) VALUES (?, ?, ?)";
        const values = [notice_title, notice_message, notice_pic];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(201).json({ success: true, message: "Notice posted successfully" });
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
})


router.put("/notice/:notice_id", async (req, res) => {
    try {
        const { notice_id } = req.params;
        const { admin_id, notice_title, notice_message, notice_pic } = req.body;

        const adminCheckSql = "SELECT * FROM admins WHERE admin_id = ?";
        const admin = await new Promise((resolve, reject) => {
            db.query(adminCheckSql, [admin_id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!admin || admin.length === 0) {
            return res.status(400).json({ error: "Invalid admin_id" });
        }


        const updateNoticeSql = `
            UPDATE notices 
            SET notice_title = ?, notice_message = ?, notice_pic = ?
            WHERE notice_id = ?
        `;

        const updateResult = await new Promise((resolve, reject) => {
            db.query(updateNoticeSql, [notice_title, notice_message, notice_pic, notice_id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (updateResult.affectedRows > 0) {
            return res.status(200).json({
                success: true,
                message: "Notice updated successfully",
                data: { notice_id, notice_title, notice_message, notice_pic }
            });
        } else {
            return res.status(404).json({ success: false, message: "Notice not found or no changes made" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.get("/notice", async (req, res) => {

    try {
        const sql = "SELECT * FROM notices";

        db.query(sql, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(201).json({ success: true, data: result });
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
})

router.get("/notice/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const sql = `
            SELECT 
                n.notice_id, 
                n.notice_title, 
                n.notice_message, 
                n.notice_pic,
                u.user_id, 
                u.name, 
                u.email, 
                u.phone, 
                u.role
            FROM notices n
            LEFT JOIN notice_users nu ON n.notice_id = nu.notice_id
            LEFT JOIN users u ON nu.user_id = u.user_id
            WHERE n.notice_id = ?`;

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: "Notice not found or no users joined" });
            }

            const notice = {
                notice_id: result[0].notice_id,
                notice_title: result[0].notice_title,
                notice_message: result[0].notice_message,
                notice_pic: result[0].notice_pic,
                users: result.map(user => ({
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                })).filter(user => user.user_id !== null) // Remove null users if no one joined
            };

            res.status(200).json({ success: true, data: notice });
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});


router.post('/noticeGet', (req, res) => {
    const { notice_id, user_id } = req.body;
    const sql = "insert into notice_users (notice_id, user_id) values (?, ?)";
    db.query(sql, [notice_id, user_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ success: true, message: "Notice fetched successfully" });
    });
})




export default router;
