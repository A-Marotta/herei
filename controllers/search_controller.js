const express = require('express')
const router = express.Router()
const Attraction = require('../models/attraction.js')
const { logError, errorHandler } = require('../middlewares/error_handler.js')

router.get('/attractions', (req, res) => {
    try {
        res.render('searchAttractions.ejs')
    } catch (error) {
        logError(error)
        req.flash("There has been an issue taking you to this page. Please try again.")
        res.redirect("/")
    }
})

router.get('/api/attractions/search/:city', (req, res) => {
    // console.log(`id: ${req.session.passport.user}`)

    // if(!req.session.passport.user)
    try {
        const city = req.params.city
        Attraction
            .findAll(city)
            .then(dbRes => {
                res.status(200).json(dbRes.rows)
            })
    } catch (error) {
        errorHandler({message: error}, req, res)
    }
})
router.get('/api/attractions/:id', (req, res) => {
    try {
        Attraction
        .findOne(req.params.id)
        .then(dbRes => {
            console.log(dbRes)
            res.status(200).json(dbRes.rows[0])
        })
    } catch (error) {
        errorHandler({message: error}, req, res)
    }
})
router.get('/api/timeslots/:id', (req, res) => {
    try {
        Attraction
            .findSessions(req.params.id)
            .then(dbRes => {
                res.status(200).json(dbRes.rows)
            })
    } catch (error) {
        errorHandler({message: error}, req, res)
    }
})

module.exports = router