const {Pool} = require('pg') //PG has a promise api
const db = new Pool({
    database: 'herei'
})

const Stripe = {
    findOne: (id) => {
        const sql = 'SELECT * FROM attraction WHERE id = $1;'
        return db.query(sql, [id])
    }
}

module.exports = Stripe