const express = require("express");
const router = express.Router();
const Stripe_Key = 'sk_test_51J8IVLK85xB9CLmPTfI9mCV3EsqExTWFiDXnYy2zbk4u79eiPbwZNNO72xL4IHZBAx0Cni4mRgLSsquZVoPy0yJj00hiBoM93X';
const stripe = require("stripe")(Stripe_Key);
const StripeModel = require('../models/stripe.js')

const YOUR_DOMAIN = 'http://localhost:8080'

router.post('/api/create-checkout-session/:id', async (req, res) => {   
    let sessionData = await StripeModel.findOneSession(req.body['session-datetime'])
    sessionData = sessionData.rows[0]

    let attractionData = await StripeModel.findOneAttraction(req.params.id)
    attractionData = attractionData.rows[0]

    if(!req.user) {
        res.redirect('/users/login')
    }
    
    if(!sessionData) {
        return res.status(404).json({ message: "No session data" })
    } else {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                price_data: {
                    currency: 'aud',
                    product_data: {
                    name: attractionData.title,
                    images: [attractionData.img],
                    },
                    unit_amount: `${attractionData.price}00`,
                },
                quantity: req.body['num-of-persons'],
                },
            ],
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/success?session_id=${sessionData.id}&attraction_id=${req.params.id}`,
            cancel_url: `${YOUR_DOMAIN}/attractions`,
            });
        
        res.redirect(303, session.url)
    }
})

module.exports = router;

// Approve card
// 4242424242424242

// Decline card - insufficent funds
// 4000000000009995