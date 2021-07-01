require('dotenv').config()

const { Pool } = require('pg')

let pool;
if (process.env.PRODUCTION) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    })
} else {
    pool = new Pool({
        database: 'herei'
    })
}

module.exports = pool