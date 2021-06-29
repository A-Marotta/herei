const express = require('express')
const app = express()
const port = process.env.PORT || 8080

const logger = require('./middlewares/logger.js')
const pool = require('./models/db.js') // this will be removed at a later stage when creating the API endpoints

const path = require('path');

console.log(pool)

app.use(logger)

app.get('/', (req, res) => {
    res.send('hello')
})

app.get('/maptest', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/maptest.html'))
})

app.listen(port, () => console.log(`listening on port: ${port}`))