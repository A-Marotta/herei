const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require("passport");
const initializePassport = require("./passportConfig");
initializePassport(passport);
const pool = require("./models/db.js");
const port = process.env.PORT || 8080
const path = require('path');
const { userInfo } = require('os');

app.listen(port, () => console.log(`listening on port: ${port}`))

//middleware

app.set('view engines', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(
    session({
        // Key we want to keep secret which will encrypt all of our information
        secret: "secret",
        // Should we resave our session variables if nothing has changes which we dont
        resave: false,
        // Save empty value if there is no vaue which we do not want to do
        saveUninitialized: false
    })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());
app.use(express.static('public'));

app.use(express.json());




// Controller
const logger = require('./middlewares/logger.js');
app.use(logger);
// const pool = require('./models/db.js') // this will be removed at a later stage when creating the API endpoints
const searchController = require('./controllers/search_controller.js');
const bookingController = require('./controllers/booking_controller.js');


//Routs

app.get('/', (req, res) => {
    res.render('index.ejs')
});

app.get('/attractions', (req, res) => {
    res.render('searchAttractions')
})
app.get('/attraction_search', (req, res) => {
    res.render('attraction_search.ejs')
});

app.get('/users/register', (req, res) => {
    res.render('register.ejs')
});

app.get('/users/login', (req, res) => {
    res.render('login.ejs')
});

app.get('/users/playground', (req, res) => {
    res.render('playground.ejs', { user: req.user.name })
});

app.get('/users/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You have logged out')
    res.redirect('/users/login')
});

app.post(
    "/users/login",
    passport.authenticate("local", {
        successRedirect: "/users/playground",
        failureRedirect: "/users/login",
        failureFlash: true

    })
);

app.post('/users/register', async(req, res) => {
    let { name, email, password, password2 } = req.body;
    console.log({
        name,
        email,
        password,
        password2
    })
    let errors = [];
    //check all forms are entered
    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }
    //check password length
    if (password.length < 6) {
        errors.push({ message: "Password must be a least 6 characters long" });
    }
    //check password is matched
    if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
    }

    // if the error array has item inside, we will return to the login page and get an error 
    if (errors.length > 0) {
        res.render("register.ejs", { errors });
    } else {
        // form validation has passed
        //bycrpt
        let hashedPassword = await bcrypt.hash(password, 10); //10 is the convention default amount;
        console.log(hashedPassword);

        // query database to see the users is already exists or not
        pool.query(
            `SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
                if (err) {
                    throw err
                }
                console.log(results.rows); // return a list containing the objects of the use in database
                if (results.rows.length > 0) {
                    errors.push({ message: "Email already register" });
                    res.render('register.ejs', { errors })

                } else { // we can register the user;

                    pool.query(
                        `INSERT INTO users (name, email, password_digest)
                            VALUES ($1, $2, $3)
                            RETURNING id, password_digest`, [name, email, hashedPassword],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }
                            console.log(results.rows);
                            req.flash("success_msg", "You are now registered. Please verified your account by Email");
                            res.redirect("/users/login");
                        }
                    )
                }
            }
        )

    }
});


// app.use(errorHandler)