const stripe = require('stripe')('sk_test_51GrU9fGmvbUUvDLHxIdVkGP7SsJv9Re4AY6gJ4E9rR55pEIozVyX0BF2H8CO2mpYuZg3eDr4ftjjmTD9GNKsJoMk00wn6cXykX', {apiVersion: ''});

exports.handler = function (ev, ctx, cb) {
    // var body = JSON.parse(ev.body)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099, // TODO -- get price
        currency: 'usd',
        // Verify your integration in this guide by including this parameter
        metadata: { integration_check: 'accept_a_payment' }
    })

    cb(null, {
        statusCode: 200,
        body: JSON.stringify({ client_secret: paymentIntent.client_secret })
    })
}


