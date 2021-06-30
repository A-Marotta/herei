const express = require('express')
const router = express.Router()
const Attraction = require('../models/attraction.js')

router.get('/api/attractions', (req, res) => {
    // let city = req.body.city >> TESTING
    let city = req.params.city
    Attraction
        .findAll(city)
        .then(dbRes => {
            res.status(200).json(dbRes.rows)
        })
})
router.get('/api/attractions/:id', (req, res) => {
    Attraction
        .findOne(req.params.id)
        .then(dbRes => {
            res.status(200).json(dbRes.rows[0])
        })
})



module.exports = router