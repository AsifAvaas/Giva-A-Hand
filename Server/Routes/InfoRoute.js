import express from "express";
import db from "../db.js";

const router = express.Router();

router.get('/allUsers', async (req, res) => {
    try {


        const sql1 = "SELECT users.user_id, name, email, phone,address, approved, (SELECT skills FROM volunteers WHERE volunteers.user_id = users.user_id) AS skills,(SELECT availability FROM volunteers WHERE volunteers.user_id = users.user_id) AS availability FROM users WHERE user_id IN (SELECT user_id FROM volunteers)"
        const [volunteers] = await db.promise().query(sql1)

        const sql2 = "select users.user_id, name,email,phone,address,approved, specialization,freeTime, chamber_Location  from users inner join doctors on users.user_id=doctors.user_id"

        const [doctors] = await db.promise().query(sql2)

        const sql3 = "select users.user_id, name,email,phone,address,approved, blood_group ,last_donation from users inner join blood_donors on users.user_id=blood_donors.user_id"
        const [bloodDonors] = await db.promise().query(sql3)

        return res.status(201).json({ success: true, volunteers, doctors, bloodDonors })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error });
    }


})

router.get('/users/approved', async (req, res) => {
    try {


        const sql1 = "SELECT users.user_id, name, email, phone,address, (SELECT skills FROM volunteers WHERE volunteers.user_id = users.user_id) AS skills,(SELECT availability FROM volunteers WHERE volunteers.user_id = users.user_id) AS availability FROM users WHERE user_id IN (SELECT user_id FROM volunteers) and users.approved=true"
        const [volunteers] = await db.promise().query(sql1)

        const sql2 = "select users.user_id, name,email,phone,address, specialization,freeTime, chamber_Location  from users inner join doctors on users.user_id=doctors.user_id where approved=true"

        const [doctors] = await db.promise().query(sql2)

        const sql3 = "select users.user_id, name,email,phone,address, blood_group ,last_donation from users inner join blood_donors on users.user_id=blood_donors.user_id where approved=true"
        const [bloodDonors] = await db.promise().query(sql3)

        return res.status(201).json({ success: true, volunteers, doctors, bloodDonors })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error });
    }


})





export default router;

