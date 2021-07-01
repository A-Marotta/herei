const express = require('express')
const app = express()
const router = express.Router()

const session = require('express-session');
const flash = require('express-flash');
const passport = require("passport");
const initializePassport = require("./passportConfig");
initializePassport(passport);
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

const stripe = require('stripe')('sk_test_51J8IVLK85xB9CLmPTfI9mCV3EsqExTWFiDXnYy2zbk4u79eiPbwZNNO72xL4IHZBAx0Cni4mRgLSsquZVoPy0yJj00hiBoM93X');

router.post('/create-checkout-session', cors(), async (req, res) => {
    // const attraction = req.params.attraction_id
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: 'Stubborn Attachments',
              images: ['https://i.imgur.com/EHyR2nP.png'],
            },
            unit_amount: 42000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });
    res.redirect(303, session.url)
  });

// Controller
const logger = require('./middlewares/logger.js');
app.use(logger);
const searchController = require('./controllers/search_controller.js');
const bookingController = require('./controllers/booking_controller.js');
const userController = require('./controllers/user_controller.js');
const sessionController = require('./controllers/session_controller.js');

//Routes
app.get('/', (req, res) => {
    res.render('index.ejs')
});

app.use('/', searchController)
app.use('/', bookingController)
app.use('/', userController)
app.use('/', sessionController)
// app.use(errorHandler)

// Approve card
// 4242424242424242

// Decline card
// 4000000000009235