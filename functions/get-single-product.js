var faunadb = require('faunadb')
var q = faunadb.query
var key = process.env.FAUNA_ADMIN_KEY
var client = new faunadb.Client({ secret: key })
const stripe = require('stripe')(process.env.STRIPE_SECRET);
var xtend = require('xtend')

exports.handler = function (ev, ctx, cb) {
    var { slug } = JSON.parse(ev.body)

    client.query(
        q.Get(
            q.Match(q.Index('slug'), slug)
        )
    )
        .then(function (res) {
            console.log('single product res', res)
            getPaymentIntent(res.data)
        })
        .catch(function (err) {
            console.log('errrrrrr', err)
            return cb(null, {
                statusCode: 500,
                body: JSON.stringify(err)
            })
        })

    async function getPaymentIntent (product) {
        const intent = await stripe.paymentIntents.create({
            amount: (product.price * 100),
            currency: 'usd',
            // Verify your integration in this guide by including this parameter
            metadata: {integration_check: 'accept_a_payment'},
        })
            .catch(function (err) {
                console.log('errrrrrr', err)
                return cb(null, {
                    statusCode: 500,
                    body: JSON.stringify(err)
                })
            })

        var _body = xtend(product, { client_secret: intent.client_secret })
        return cb(null, {
            statusCode: 200,
            body: JSON.stringify(_body)
        })
    }

}

