import express from "express";
import db from "../db.js";

const router = express.Router();


router.post('/profile', (req, res) => {
    const { user_Id } = req.body

    const sql = "select * from users where user_id=(?)"
    db.query(sql, [user_Id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "user not found" })
        }
        return res.status(201).json({ success: true, user: result })
    })

})


router.put('/profile', (req, res) => {
    const { user_Id, name, phone, address, profile_pic } = req.body

    const sql = 'update users set name= ?, phone = ?, address= ?, profile_pic= ? where user_id= ?'
    const values = [name, phone, address, profile_pic, user_Id]
    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Update failed" })
        }
        return res.status(201).json({ success: true, message: "User Updated" })
    })
})


router.post('/volunteer/profile', (req, res) => {
    const { user_Id } = req.body

    const sql = "select * from volunteers where user_id=(?)"
    db.query(sql, [user_Id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "user not found" })
        }
        return res.status(201).json({ success: true, volunteer: result })
    })

})

router.put('/volunteer/profile', (req, res) => {
    const { user_Id, skills, availability } = req.body

    const sql = 'update volunteers set skills= ?, availability = ? where user_id= ?'
    const values = [skills, availability, user_Id]
    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Update failed", err })
        }
        if (result.affectedRows === 0) {
            return res.status(500).json({ success: false, message: "Volunteer not found" });
        }
        return res.status(201).json({ success: true, message: "User Updated" })
    })
})

router.post('/bloodDonor/profile', (req, res) => {
    const { user_Id } = req.body

    const sql = "select * from blood_donors where user_id=(?)"
    db.query(sql, [user_Id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "user not found" })
        }
        return res.status(201).json({ success: true, bloodDonor: result })
    })

})

router.put('/bloodDonor/profile', (req, res) => {
    const { user_Id, blood_group, last_donation } = req.body

    const sql = 'update blood_donors set blood_group= ?, last_donation = ? where user_id= ?'
    const values = [blood_group, last_donation, user_Id]
    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Update failed", err })
        }
        if (result.affectedRows === 0) {
            return res.status(500).json({ success: false, message: "Donor not found" });
        }
        return res.status(201).json({ success: true, message: "User Updated" })
    })
})

router.post('/doctor/profile', (req, res) => {
    const { user_Id } = req.body

    const sql = "select * from doctors where user_id=(?)"
    db.query(sql, [user_Id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "user not found" })
        }
        return res.status(201).json({ success: true, bloodDonor: result })
    })

})

router.put('/doctor/profile', (req, res) => {
    const { user_Id, specialization, freeTime, chamber_Location } = req.body

    const sql = 'update doctors set specialization= ?, freeTime = ?, chamber_Location= ? where user_id= ?'
    const values = [specialization, freeTime, chamber_Location, user_Id]
    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Update failed", err })
        }
        if (result.affectedRows === 0) {
            return res.status(500).json({ success: false, message: "Doctor not found" });
        }
        return res.status(201).json({ success: true, message: "User Updated" })
    })
})


router.post('/admin/profile', (req, res) => {
    const { admin_id } = req.body

    const sql = "select * from admins where admin_id = ?"
    db.query(sql, [admin_id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Admin not found" })
        }
        return res.status(201).json({ success: true, user: result })
    })

})

router.put('/admin/profile', (req, res) => {
    const { admin_id, name, phone } = req.body

    const sql = 'update admins set name= ?, phone = ? where admin_id= ?'
    const values = [name, phone, admin_id]
    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Update failed", err })
        }
        if (result.affectedRows === 0) {
            return res.status(500).json({ success: false, message: "Admin not found" });
        }
        return res.status(201).json({ success: true, message: "Admin Updated" })
    })
})

router.put('/admin/approve/:data', (req, res) => {
    const { data } = req.params;
    const { admin_id, user_Id } = req.body
    const sql1 = "select admin_id from admins where admin_id= ?"
    db.query(sql1, [admin_id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Server Error", err })
        }
        if (result.length === 0) {
            return res.status(500).json({ success: false, message: "Admin access denied" })
        }
        const sql2 = `update users set approved=${data} where user_id= ?`
        db.query(sql2, [user_Id], (error, response) => {
            if (error) {
                return res.status(500).json({ success: false, message: "Server Error", err })
            }
            if (response.affectedRows === 0) {
                return res.status(500).json({ success: false, message: "Not updated" });
            }
            return res.status(201).json({ success: true, message: "Updated approve status" });
        })
    })

})


export default router;
