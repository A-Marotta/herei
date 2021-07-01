const express = require('express')
const router = express.Router()
const Attraction = require('../models/attraction.js')

router.get('/attractions', (req, res) => {
    res.render('searchAttractions.ejs')
})

router.get('/api/attractions/search/:city', (req, res) => {
    const city = req.params.city
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
            console.log(dbRes)
            res.status(200).json(dbRes.rows[0])
        })
})
router.get('/api/timeslots/:id', (req, res) => {
    Attraction
        .findSessions(req.params.id)
        .then(dbRes => {
            res.status(200).json(dbRes.rows)
        })
})



module.exports = router