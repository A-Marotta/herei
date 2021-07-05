const express = require('express')
const router = express.Router()
const sendMail = require("../email_notification/send");
const Booking = require('../models/booking.js')
const Session = require('../models/session.js')
// const { errorHandler } = require('../middlewares/error_handler.js')

router.get('/api/bookings', (req, res) => {
        let users_id = req.body.id
        if (!users_id) {
            res.status(422).json({message: "Need a user ID to view this info"})
        }
        Booking
            .findAll(users_id)
            .then(dbRes => {
                res.status(200).json(dbRes.rows)
        })
})

router.post('/api/bookings', (req, res) => {
    if (!req.body.users_id || !req.body.attraction_id) {
        res.status(422).json({message: "Need a user ID to view this info"})
    }
    Booking
        .create(req.body.attraction_id, req.body.users_id)
        .then(dbRes => {
            res.status(201).json(dbRes.rows[0])
        })
})

router.get('/api/bookings/:id', (req, res) => {
    if (!req.params.id) {
        res.status(422).json({message: "Need a user ID to view this info"})
    }
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

router.get('/success', (req, res) => {
    // after payment received, we creates session record in database
    return Session
        .create(req.query.session_id, req.user.id)
        .then(dbRes => {
            console.log(`dbRes.rows[0]: ${dbRes.rows[0]}`)
            return dbRes.rows[0]
        })
        .then(() => Session.findSessionById(req.query.session_id))
        .then(dbRes => {
            //after session created, we send email to customer
                userSession = dbRes.rows[0];
                return sendMail(req.user.email, "Thank you for you booking",
                    `
                        <div>Thank you for you booking <span style="font-weight: bold;">${userSession.title}</span></div><br>
                        <div>This session is: ${userSession.description}</div><br>
                        <div>Your booking time is <span style="font-weight: bold;">${userSession.datetime.toString()}</span></div><br>
                        <img src="${userSession.img}" alt="${userSession.title}"><br>    
                    `);
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                return res.status(200).render('success.ejs')
            });
});

module.exports = router