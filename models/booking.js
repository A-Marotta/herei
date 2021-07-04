const {Pool} = require('pg') //PG has a promise api
// const db = new Pool({
//     database: 'herei'
// })

let db;
if (process.env.PRODUCTION) {
    db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
} else {
    db = new Pool({
    database: 'herei'
  })
}

const Booking = {
    findAll: (users_id) => {
        const sql = 'SELECT * FROM bookings WHERE users_id = $1;'
        return db.query(sql, [users_id])
    },
    create: (attraction_id, users_id) => {
        const sql = `
            INSERT INTO bookings (attraction_id, users_id)
            VALUES ($1, $2) RETURNING *
            `
            return db.query(sql, [attraction_id, users_id])
    },
    findOne: (id) => {
    const sql = `
        SELECT * FROM bookings WHERE id = $1;
        `
    return db.query(sql, [id])
    },
    // edit: (id) => {
    //     const sql = `
    //         UPDATE bookings SET 
    //         `
    // },
    delete: (id) => {
    const sql = `
        DELETE FROM bookings WHERE id = $1;
        `
    return db.query(sql, [id])
    }
}

module.exports = Booking