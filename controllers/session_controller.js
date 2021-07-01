const express = require('express')
const router = express.Router()
const Session = require('../models/session.js')

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
            .create(req.params.session_id, 8)
            .then(dbRes => {
                res.status(201).json({ 
                    session: dbRes.rows[0] 
                })
            })
    } catch(err) {
        return res.status(422).json({ message: "failed"})
    }
})

module.exports = router