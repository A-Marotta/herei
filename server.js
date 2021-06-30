const express = require('express')
const app = express()
const port = process.env.PORT || 8080

const logger = require('./middlewares/logger.js')
const path = require('path');
const pool = require('./models/db.js') // this will be removed at a later stage when creating the API endpoints

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'client/views'))

app.use(logger)
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

app.use(express.json())

app.get('/', (req, res) => {
    res.render('index.ejs')
})
app.use('/', bookingController)
app.use('/', searchController)



app.get('/attractions', (req, res) => {
    res.render('searchAttractions')
})



app.listen(port, () => console.log(`listening on port: ${port}`))

// app.use(errorHandler)