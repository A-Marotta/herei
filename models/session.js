const {Pool} = require('pg') //PG has a promise api
const db = new Pool({
    database: 'herei'
})

const Session = {
    // Finding all booking in a session
    findAll: (user_id) => {
        const sql = 'SELECT * FROM user_session WHERE session_id = $1;'
        return db.query(sql, [user_id])
    },
    // Creating a booked session
    create: (session_id, user_id) => {
        const sql = `
            INSERT INTO user_session (session_id, user_id)
            VALUES ($1, $2) RETURNING *
            `
            return db.query(sql, [session_id, user_id])
    },
//     findOne: (id) => {
//     const sql = `
//         SELECT * FROM user_session WHERE id = $1;
//         `
//     return db.query(sql, [id])
//     },
//     delete: (id) => {
//     const sql = `
//         DELETE FROM user_session WHERE id = $1;
//         `
//     return db.query(sql, [id])
//     }
}

module.exports = Session