const express = require("express");
const router = express.Router();
const Stripe_Key = 'sk_test_51J8IVLK85xB9CLmPTfI9mCV3EsqExTWFiDXnYy2zbk4u79eiPbwZNNO72xL4IHZBAx0Cni4mRgLSsquZVoPy0yJj00hiBoM93X';
const stripe = require("stripe")(Stripe_Key);
const StripeModel = require('../models/stripe.js')

const YOUR_DOMAIN = 'http://localhost:8080'

router.post('/api/create-checkout-session/:id', async (req, res) => {
    let attractionData = await StripeModel.findOne(req.params.id)
    attractionData = attractionData.rows[0]

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
            price_data: {
                currency: 'aud',
                product_data: {
                name: attractionData.title,
                images: ['https://i.imgur.com/EHyR2nP.png'],
                },
                unit_amount: `${attractionData.price}00`,
            },
            quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${YOUR_DOMAIN}/cancel.html`,
        });
    
    res.redirect(303, session.url)
})

module.exports = router;

// Approve card
// 4242424242424242

// Decline card - insufficent funds
// 4000000000009995