const express = require('express')
const app = express()
const port = process.env.PORT || 8080

const logger = require('./middlewares/logger.js')
const pool = require('./models/db.js') // this will be removed at a later stage when creating the API endpoints
const searchController = require('./controllers/search_controller.js')
const bookingController = require('./controllers/booking_controller.js')
const path = require('path');

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(logger)
app.use(express.json());

app.use(express.json())

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/attraction_search', (req, res) => {
    res.render('attraction_search.ejs')
})

app.get('/user/login', (req, res) => {
    res.render('login.ejs')
})

// app.post('/user/login', (req, res) => {
//     res.send('to do')
// })

app.get('/user/new', (req, res) => {
    res.render('new_user.ejs')
})

app.use('/', bookingController)
app.use('/', searchController)


app.get('/attractions', (req, res) => {
    res.render('searchAttractions')
})



app.listen(port, () => console.log(`listening on port: ${port}`))

// app.use(errorHandler)