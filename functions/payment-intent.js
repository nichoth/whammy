const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.handler = function (ev, ctx, cb) {
    // var body = JSON.parse(ev.body)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099, // TODO -- get price, product ID
        currency: 'usd',
        // Verify your integration in this guide by including this parameter
        metadata: { integration_check: 'accept_a_payment' }
    })

    cb(null, {
        statusCode: 200,
        body: JSON.stringify({ client_secret: paymentIntent.client_secret })
    })
}


