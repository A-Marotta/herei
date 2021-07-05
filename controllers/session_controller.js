const express = require('express')
const router = express.Router()
const Session = require('../models/session.js')
const { errorHandler } = require("../middlewares/error_handler.js")

router.get('/api/sessions/future', (req, res) => {
    if(!req.user) {
        errorHandler({statusCode: 404, message: "must be logged in to view upcoming sessions."}, req, res)
    } else {
        const id = req.session.passport.user
        try {
            Session
                .findUserSessions(id)
                .then(dbRes => {
                    res.status(200).json(dbRes.rows)
                })
        } catch(err) {
            errorHandler({message: err}, req, res)
        }
    }
})

router.get('/api/sessions/:id', (req, res) => {
    const id = req.params.id
    Session
        .findAll(id)
        .then(dbRes => {
            res.status(200).json(dbRes.rows)
        })
})

router.post('/api/sessions/:session_id', (req, res) => {
    try {
        Session
            .create(req.params.session_id, req.query.user_id)
            .then(dbRes => {
                res.status(201).json({ 
                    session: dbRes.rows[0] 
                })
            })
    } catch(err) {
        errorHandler({statusCode: 422, message: "failed"}, req, res)
    }
})

// router.delete('/api/sessions/:session_id', (req, res) => {
//     try {
//         Session
//             .create(req.params.session_id, req.query.user_id)
//             .then(dbRes => {
//                 res.status(201).json({ 
//                     session: dbRes.rows[0] 
//                 })
//             })
//     } catch(err) {
//         return res.status(422).json({ message: "failed"})
//     }
// })



module.exports = router


// router.get('/api/sessions/future', (req, res) => {
//     if(!req.user) {
//         return res.status(404).json({ message: "must be logged in to view upcoming sessions."})
//     } else {
//         const id = req.session.passport.user
//         try {
//             Session
//                 .findUserSessions(id)
//                 .then(dbRes => {
//                     res.status(200).json(dbRes.rows)
//                 })
//         } catch(err) {
//             return res.status(500).json(err)
//         }
//     }
// })

// router.get('/api/sessions/:id', (req, res) => {
//     const id = req.params.id
//     Session
//         .findAll(id)
//         .then(dbRes => {
//             res.status(200).json(dbRes.rows)
//         })
// })

// router.post('/api/sessions/:session_id', (req, res) => {
//     try {
//         Session
//             .create(req.params.session_id, req.query.user_id)
//             .then(dbRes => {
//                 res.status(201).json({ 
//                     session: dbRes.rows[0] 
//                 })
//             })
//     } catch(err) {
//         return res.status(422).json({ message: "failed"})
//     }
// })