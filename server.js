const express = require('express')
const app = express()
const router = express.Router()

const session = require('express-session');
const flash = require('express-flash');
const passport = require("passport");
const initializePassport = require("./passportConfig");
const sendMail = require("./email_notification/send");
const Session = require('./models/session.js')
initializePassport(passport);
const axios = require('axios');
const port = process.env.PORT || 8080

const YOUR_DOMAIN = 'http://localhost:8080';

var cors = require('cors') // due to api requests blocked by CORS policy
app.use(cors()) // Use this after the variable declaration

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
const {logError, returnError} = require('./middlewares/error_handler.js')
const searchController = require('./controllers/search_controller.js');
const bookingController = require('./controllers/booking_controller.js');
const userController = require('./controllers/user_controller.js');
const sessionController = require('./controllers/session_controller.js');
const stripeController = require("./controllers/stripe_controller.js");


//Routes
app.get('/', (req, res) => {
    res.render('index.ejs')
});

app.get('/success', (req, res) => {
    // after payment received, we creates session record in database
    return Session
        .create(req.query.session_id, req.user.id)
        .then(dbRes => {
            console.log(`dbRes.rows[0]: ${dbRes.rows[0]}`)
            return dbRes.rows[0]
        })
        .then(() => Session.findSessionById(req.query.session_id))
        .then(dbRes => {
            //after session created, we send email to customer
                userSession = dbRes.rows[0];
                 return sendMail(req.user.email, "Thank you for you booking",
                    `
                        <div>Thank you for you booking <span style="font-weight: bold;">${userSession.title}</span></div><br>
                        <div>This session is: ${userSession.description}</div><br>
                        <div>Your booking time is <span style="font-weight: bold;">${userSession.datetime.toString()}</span></div><br>
                        <img src="${userSession.img}" alt="${userSession.title}"><br>    
                     `);
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                return res.status(200).render('success.ejs')
            });
});

app.use('/', searchController)
app.use('/', bookingController)
app.use('/', userController)
app.use('/', sessionController)
app.use("/", stripeController);
//app.use(errorHandler) //***dt-taught error handler kept incase of issues with below*/
// app.use(logError)
// app.use(returnError)