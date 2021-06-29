const bcrypt = require("bcrypt")
const e = require("express")
const { Pool } = require('pg') // 
const db = new Pool({
    database: 'herei'
})

function synchronousHashing(password) {
    // Generate Salt
    const salt = bcrypt.genSaltSync(10);

    // Hash Password
    const hash = bcrypt.hashSync('123456', salt);

    return hash
}

const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

const dummyUser = [
    {
        email: "karen@gmail.com",
        name: "Karen",
        password: synchronousHashing('123456')
    }, 
    {
        email: "cameron@gmail.com",
        name: "Cameron",
        password: synchronousHashing('123456')
    }, 
    {
        email: "adrian@gmail.com",
        name: "Adrian",
        password: synchronousHashing('123456')
    }, 
    {
        email: "john@gmail.com",
        name: "John",
        password: synchronousHashing('123456')
    }, 
    {
        email: "jane@gmail.com",
        name: "jane",
        password: synchronousHashing('123456')
    }, 
    {
        email: "user1@gmail.com",
        name: "user1",
        password: synchronousHashing('123456')
    }, 
    {
        email: "user2@gmail.com",
        name: "user2",
        password: synchronousHashing('123456')
    }, 
    {
        email: "user3@gmail.com",
        name: "user3",
        password: synchronousHashing('123456')
    }, 
]

const dummyAttraction = [
    {
        title: "I'm Free Walking Tours Melbourne",
        description: "Sightseeing tour agency in the City of Melbourne, Victoria",
        lat: -37.80220437586521,
        long: 144.9687826104149,
        city: "Melbourne",
        state: "Victoria",
        country: "Australia",
        maxCount: 30,
        date: '2021-07-10 10:00:00',
        price: 37.50,
        create_at: datetime,
        user_id: 1
    },
    {
        title: "Walk Melbourne Tours",
        description: "At Walk Melbourne Tours, we love to share Melbourne's stories through food. Coffee, dumplings, sweets and bars are our favorite things.",
        lat: -37.80220538474754,
        long: 145.00096911859362,
        city: "Melbourne",
        state: "Victoria",
        country: "Australia",
        maxCount: 25,
        date: '2021-07-10 11:00:00',
        price: 25,
        create_at: datetime,
        user_id: 1
    },
    {
        title: "Crown Spa Melbourne",
        description: "Spa in Southbank, Victoria",
        lat: -37.83246010626527,
        long: 144.93334995186427,
        city: "Melbourne",
        state: "Victoria",
        country: "Australia",
        maxCount: 30,
        date: '2021-07-10 10:00:00',
        price: 120,
        create_at: datetime,
        user_id: 1
    },
    {
        title: "City Sightseeing Melbourne",
        description: "Sightseeing tour agency in the City of Melbourne, Victoria",
        lat: -37.81202429790582,
        long: 144.97713695455317,
        city: "Melbourne",
        state: "Victoria",
        country: "Australia",
        maxCount: 30,
        date: '2021-07-10 15:00:00',
        price: 30,
        create_at: datetime,
        user_id: 2
    },
    {
        title: "Laurel Beauty and Spa",
        description: "Massage spa in Docklands, Victoria",
        lat: -37.82025694504295,
        long: 144.96553646004298,
        city: "Melbourne",
        state: "Victoria",
        country: "Australia",
        maxCount: 30,
        date: '2021-07-10 12:00:00',
        price: 60,
        create_at: datetime,
        user_id: 3
    },
    {
        title: "Haunted Melbourne Ghost Tour",
        description: "Tourist attraction in the City of Melbourne, Victoria",
        lat: -37.81705225725522,
        long: 144.95636947184306,
        city: "Melbourne",
        state: "Victoria",
        country: "Australia",
        maxCount: 10,
        date: '2021-07-10 18:00:00',
        price: 40,
        create_at: datetime,
        user_id: 2
    },
    {
        title: "Melbourne Bar Crawl",
        description: "Tourist attraction in the City of Melbourne, Victoria",
        lat: -37.81374674365602,
        long: 144.96441609888774,
        city: "Melbourne",
        state: "Victoria",
        country: "Australia",
        maxCount: 30,
        date: '2021-07-10 18:30:00',
        price: 35,
        create_at: datetime,
        user_id: 2
    },
    {
        title: "SEA LIFE Melbourne Aquarium",
        description: "Sea Life Melbourne Aquarium is a Southern Ocean and Antarctic aquarium in central Melbourne, Australia.",
        lat: -37.81566751690223,
        long: 144.9650331347265,
        city: "Melbourne",
        state: "Victoria",
        country: "Australia",
        maxCount: 30,
        date: '2021-07-10 08:30:00',
        price: 50,
        create_at: datetime,
        user_id: 5
    }
]

const dummyBookings = [
    {
        attraction_id: 1,
        users_id: 6,
    },
    {
        attraction_id: 1,
        users_id: 7,
    },
    {
        attraction_id: 1,
        users_id: 8,
    },
    {
        attraction_id: 5,
        users_id: 6,
    },
    {
        attraction_id: 6,
        users_id: 7,
    },
    {
        attraction_id: 7,
        users_id: 8,
    }
]

const sqlUser = `
    INSERT INTO users (email, name, password_digest)
    VALUES ($1, $2, $3)
`

const sqlAttraction = `
    INSERT INTO attraction (title, description, lat, long, city, state, country, maxCount, date, price, create_at, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
`

const sqlBookings = `
    INSERT INTO bookings (attraction_id, users_id)
    VALUES ($1, $2)
`

function runSQLQuery() {
    dummyUser.forEach(user => {
        db.query(sqlUser, [user.email, user.name, user.password])
    })

    dummyAttraction.forEach(attraction => {
        db.query(sqlAttraction, [
            attraction.title, 
            attraction.description,
            attraction.lat,
            attraction.long,
            attraction.city,
            attraction.state,
            attraction.country,
            attraction.maxCount,
            attraction.date,
            attraction.price,
            attraction.create_at,
            attraction.user_id
        ])
    })
}

function runSQLBooking() {
    dummyBookings.forEach(booking => {
        db.query(sqlBookings, [booking.attraction_id, booking.users_id])
    })
}

runSQLQuery()
//runSQLBooking()