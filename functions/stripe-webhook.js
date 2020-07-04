const stripe = require('stripe')(process.env.STRIPE_SECRET);
var stripeWebhook = process.env.STRIPE_WEBHOOK
console.log('Stripe Webhook', stripeWebhook)

exports.handler = function (ev, ctx, cb) {
    // var body = JSON.parse(ev.body)
    console.log('body', ev.body)
    console.log('headers', ev.headers)
    var sig = ev.headers['stripe-signature'];
    console.log('sig', sig)

    var stripeEv
    try {
        stripeEv = stripe.webhooks.constructEvent(ev.body, sig, stripeWebhook)
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
        console.log('*****success****')
        // todo
        // * mark the order as paid
        // * send an email to the store owner
    }

    if (stripeEv.type === 'payment_intent.payment_failed') {
        var intent = stripeEv.data.object;
        var message = (intent.last_payment_error &&
            intent.last_payment_error.message)
        console.log('failed', message)
        // todo
        // * send email to store owner
    }

    cb(null, {
        statusCode: 200,
        body: JSON.stringify(stripeEv)
    })
}
