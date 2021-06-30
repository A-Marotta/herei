const {Pool} = require('pg') //PG has a promise api
const db = new Pool({
    database: 'herei'
})

const Attraction = {
    findAll: (city) => {
        const sql = 'select * from attraction where city = $1;'
        return db.query(sql, [city])
    },
    findOne(id) {
        const sql = 'select * from attraction where id = $1;'
        return db.query(sql, [id])
    },

}

module.exports = Attraction