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

const Session = {
    // Finding all booking in a session
    findAll: (user_id) => {
        const sql = 'SELECT * FROM user_session WHERE session_id = $1;'
        return db.query(sql, [user_id])
    },
    // Finding all sessions for a single user
    findUserSessions: (user_id) => {
        const sql = `
            SELECT * FROM user_session
            JOIN users ON (user_id = users.id)
            JOIN session ON (session_id = session.id)
            JOIN attraction ON (attraction_id = attraction.id)
            WHERE (
            user_id = $1
            AND 
            datetime >= NOW()
            );
        `
        return db.query(sql, [user_id])
    },
    findSessionById: (session_id) => {
        const sql = `
            SELECT * FROM session 
            LEFT JOIN attraction ON session.attraction_id = attraction.id WHERE (
            session.id = $1);
        `
        return db.query(sql, [session_id])
    },
    // Creating a booked session
    create: (session_id, user_id) => {
        const sql = `
            INSERT INTO user_session (session_id, user_id)
            VALUES ($1, $2) RETURNING *
            `
            return db.query(sql, [session_id, user_id])
    }
}

module.exports = Session