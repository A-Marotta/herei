const express = require('express')
const app = express()
const port = process.env.PORT || 8080

const logger = require('./middlewares/logger.js')
const pool = require('./models/db.js') // this will be removed at a later stage when creating the API endpoints
const searchController = require('./controllers/search_controller.js')
const bookingController = require('./controllers/booking_controller.js')
const path = require('path');

app.set('view engine', 'ejs')

app.set('views', path.join(__dirname, 'client/views'))


app.use(logger)

app.use(express.json())

app.get('/', (req, res) => {
    res.render('index.ejs')
})
app.use('/', bookingController)
app.use('/', searchController)



app.get('/maptest', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/maptest.html'))
})



app.listen(port, () => console.log(`listening on port: ${port}`))

// app.use(errorHandler)