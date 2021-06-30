const express = require('express')
const router = express.Router()
const Booking = require('../models/booking.js')

router.get('/api/bookings', (req, res) => {
    let users_id = req.body.id
    Booking
        .findAll(users_id)
        .then(dbRes => {
            res.status(200).json(dbRes.rows)
    })
})
router.post('/api/bookings', (req, res) => {
    Booking
        .create(req.body.attraction_id, req.body.users_id)
        .then(dbRes => {
            res.status(201).json(dbRes.rows[0])
    })
})
router.get('/api/bookings/:id', (req, res) => {
    Booking
        .findOne(req.params.id)
        .then(dbRes => {
            res.status(200).json(dbRes.rows[0])
    })
})
// router.patch('/api/bookings/:id', (req, res) => {
//     Booking
//         .edit(*****TBD*****)
//         .then(dbRes => {
//             res.status(200).json(dbRes.rows[0])
//     })
// })
router.delete('/api/bookings/:id', (req, res) => {
    Booking
        .delete(req.params.id)
        .then(dbRes => {
            res.status(200).json({message: "deleted successfully"})
    })
})

module.exports = router