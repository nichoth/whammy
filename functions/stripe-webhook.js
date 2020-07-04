const stripe = require('stripe')(process.env.STRIPE_SECRET);
var WH_SECRET = process.env.STRIPE_WEBHOOK
console.log('wh_secret', WH_SECRET)

exports.handler = function (ev, ctx, cb) {
    // var body = JSON.parse(ev.body)
    console.log('body', ev.body)
    console.log('headers', ev.headers)
    var sig = ev.headers['stripe-signature'];
    console.log('sig', sig)

    var stripeEv
    try {
        stripeEv = stripe.webhooks.constructEvent(ev.body, sig, WH_SECRET)
        console.log('stripeEv', stripeEv)
        console.log('.data', stripeEv.data)
    } catch (err) {
        // invalid signature
        console.log('errrrr sig', err)
        return cb(null, {
            statusCode: 401,
            body: JSON.stringify({
                message: 'Invalid signature'
            })
        })
    }

    if (stripeEv.type === 'payment_intent.succeeded') {
        console.log('success')
    }

    if (stripeEv.type === 'payment_intent.payment_failed') {
        var intent = stripeEv.data.object;
        var message = (intent.last_payment_error &&
            intent.last_payment_error.message)
        console.log('failed', message)
    }

    cb(null, {
        statusCode: 200,
        body: JSON.stringify(stripeEv)
    })
}
