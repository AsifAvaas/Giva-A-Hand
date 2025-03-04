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

        // Check if the admin exists
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

        // Update the notice in the database
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

router.delete("/notice/:notice_id", async (req, res) => {
    try {
        const { notice_id } = req.params;

        // Check if the notice exists
        const checkNoticeSql = "SELECT * FROM notices WHERE notice_id = ?";
        const notice = await new Promise((resolve, reject) => {
            db.query(checkNoticeSql, [notice_id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!notice || notice.length === 0) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }

        // Delete the notice
        const deleteNoticeSql = "DELETE FROM notices WHERE notice_id = ?";
        const deleteResult = await new Promise((resolve, reject) => {
            db.query(deleteNoticeSql, [notice_id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (deleteResult.affectedRows > 0) {
            return res.status(200).json({ success: true, message: "Notice deleted successfully" });
        } else {
            return res.status(500).json({ success: false, message: "Failed to delete notice" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});


router.post("/notice/join", async (req, res) => {
    const { user_id, notice_id } = req.body;
    try {
        const userCheckSql = "SELECT * FROM users WHERE user_id = ?";
        const userCheckValues = [user_id];

        const [user] = await new Promise((resolve, reject) => {
            db.query(userCheckSql, userCheckValues, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid user_id" });
        }

        const noticeCheckSql = "SELECT * FROM notices WHERE notice_id = ?";
        const noticeCheckValues = [notice_id];

        const [notice] = await new Promise((resolve, reject) => {
            db.query(noticeCheckSql, noticeCheckValues, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });

        if (!notice) {
            return res.status(400).json({ error: "Invalid notice_id" });
        }

        const sql = "INSERT INTO notice_users (notice_id, user_id) VALUES (?, ?)";
        const values = [notice_id, user_id];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(201).json({ success: true, message: "User joined notice successfully" });
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
})

export default router;
