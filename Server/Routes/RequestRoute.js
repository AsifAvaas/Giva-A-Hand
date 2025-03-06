import express from "express";
import db from "../db.js";

const router = express.Router();

router.post('/request', async (req, res) => {
    try {
        const { seeker_id, helper_id, helper_type, message } = req.body;
        const helperTables = {
            volunteers: { table: "volunteers", id_column: "volunteer_id" },
            doctors: { table: "doctors", id_column: "doctor_id" },
            blood_donors: { table: "blood_donors", id_column: "blood_donor_id" },
        };
        if (!helperTables[helper_type]) {
            return res.status(400).json({ success: false, message: "Invalid helper type" });
        }
        const helperTable = helperTables[helper_type].table;
        const idColumn = helperTables[helper_type].id_column;

        const [helperExists] = await db.promise().query(
            `SELECT ${idColumn} FROM ${helperTable} WHERE ${idColumn} = ?`,
            [helper_id]
        );

        if (helperExists.length === 0) {
            return res.status(404).json({ success: false, message: "Helper not found" });
        }
        const sql = `INSERT INTO requests (seeker_id, helper_id, helper_type, message) 
        VALUES (?, ?, ?, ?)`;
        await db.promise().query(sql, [seeker_id, helper_id, helper_type, message]);

        return res.status(201).json({ success: true, message: "Request created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
})

router.post("/request/user", async (req, res) => {
    try {
        const { seeker_id } = req.body;

        const [requests] = await db.promise().query(
            `SELECT * FROM requests WHERE seeker_id = ?`,
            [seeker_id]
        );

        const helperTables = {
            volunteers: { table: "volunteers", id_column: "volunteer_id" },
            doctors: { table: "doctors", id_column: "doctor_id" },
            blood_donors: { table: "blood_donors", id_column: "blood_donor_id" },
        };

        // Fetch helper and user details
        const userRequests = await Promise.all(
            requests.map(async (request) => {
                let helperData = null;

                if (helperTables[request.helper_type]) {
                    const { table, id_column } = helperTables[request.helper_type];

                    // Fetch helper details using the correct ID column
                    const [helper] = await db
                        .promise()
                        .query(`SELECT * FROM ${table} WHERE ${id_column} = ?`, [
                            request.helper_id,
                        ]);

                    if (helper.length > 0) {
                        helperData = helper[0];

                        if (helperData.user_id) {
                            const [user] = await db
                                .promise()
                                .query(
                                    `SELECT name, phone, email, profile_pic FROM users WHERE user_id = ?`,
                                    [helperData.user_id]
                                );
                            helperData.user = user.length > 0 ? user[0] : null;
                        }
                    }
                }

                return {
                    message: request.message,
                    status: request.status,
                    helper_data: helperData ? helperData.user : null,
                };
            })
        );

        return res.status(201).json({
            success: true,
            data: userRequests,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});


router.post("/request/helper", async (req, res) => {
    try {
        const { helper_id } = req.body;

        if (!helper_id || isNaN(helper_id)) {
            return res.status(400).json({ error: { helper_id: "Helper ID is required and must be an integer." } });
        }

        // Get all requests for the given helper_id
        const [helperRequests] = await db.promise().query(
            `SELECT request_id, seeker_id, status, message FROM requests WHERE helper_id = ?`,
            [helper_id]
        );

        // Fetch user details for each request
        const updatedRequests = await Promise.all(
            helperRequests.map(async (request) => {
                const [users] = await db.promise().query(
                    `SELECT name, email, phone, profile_pic FROM users WHERE user_id = ?`,
                    [request.seeker_id]
                );

                return {
                    request_id: request.request_id,
                    status: request.status,
                    message: request.message,
                    user_details: users.length > 0 ? users[0] : null,
                };
            })
        );

        return res.status(201).json({
            success: true,
            data: updatedRequests,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});

router.put("/request/approve", async (req, res) => {
    try {
        let { approver_id, request_id, status } = req.body;


        const statusBoolean = status === true || status === "true";
        const statusValue = statusBoolean ? 0 : 1; // Convert to integer for MySQL

        // Validate request body
        if (!approver_id || !request_id || status === undefined) {
            return res.status(400).json({ error: "All fields (approver_id, request_id, status) are required" });
        }

        // Find the request
        const [requests] = await db.promise().query("SELECT * FROM requests WHERE request_id = ?", [request_id]);

        if (requests.length === 0) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        const helpRequest = requests[0];

        // Check if the approver_id matches the helper_id
        if (helpRequest.helper_id !== Number(approver_id)) {
            return res.status(403).json({ success: false, message: "You are not authorized to approve or disapprove this request", helper_id: helpRequest.helper_id, approver_id });
        }

        // Debugging logs
        console.log("Updating request_id:", request_id);
        console.log("New status:", statusValue);

        // Update the request status
        const [updateResult] = await db.promise().query(
            "UPDATE requests SET status = ?, updated_at = NOW() WHERE request_id = ?",
            [statusValue, request_id]
        );

        if (updateResult.affectedRows > 0) {
            return res.status(201).json({
                success: true,
                message: "Request status updated successfully",
                data: { request_id, status: statusValue }
            });
        }

        return res.status(500).json({ success: false, message: "Failed to update the request status" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});



export default router;

