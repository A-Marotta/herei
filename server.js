const express = require('express')
const app = express()

const session = require('express-session');
const flash = require('express-flash');
const passport = require("passport");
const initializePassport = require("./passportConfig");
initializePassport(passport);
const port = process.env.PORT || 8080

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
const searchController = require('./controllers/search_controller.js');
const bookingController = require('./controllers/booking_controller.js');
const userController = require('./controllers/user_controller.js');

//Routes
app.get('/', (req, res) => {
    res.render('index.ejs')
});

app.use('/', searchController)
app.use('/', bookingController)
app.use('/', userController)
// app.use(errorHandler)