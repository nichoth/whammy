// var faunadb = require('faunadb')
// var q = faunadb.query
// var key = process.env.FAUNA_ADMIN_KEY
// var client = new faunadb.Client({ secret: key })
// const stripe = require('stripe')(process.env.STRIPE_SECRET);
// var xtend = require('xtend')

var xtend = require('xtend')
const config = require("./config.json")[process.env.NODE_ENV]
var SquareConnect = require('square-connect')
var defaultClient = SquareConnect.ApiClient.instance
defaultClient.basePath = config.path
// Configure OAuth2 access token for authorization: oauth2
var oauth2 = defaultClient.authentications['oauth2']
oauth2.accessToken = config.squareAccessToken;
const catalogApi = new SquareConnect.CatalogApi()



exports.handler = function (ev, ctx, cb) {
    var { id } = JSON.parse(ev.body)
    var opts = { 'includeRelatedObjects': true }

    catalogApi.retrieveCatalogObject(id, opts).then(function (res) {
        console.log('API called successfully. Returned data: ' + res);
        var item = res.object
        var image = res.related_objects.find(obj => obj.type === 'IMAGE')
        cb(null, {
            statusCode: 200,
            body: JSON.stringify(xtend(item, {
                imageUrl: image.image_data.url
            }))
        })
    }, function (err) {
        console.log('errrrrrrr', err)
        cb(null, {
            statusCode: 500,
            body: JSON.stringify(err)
        })
    })


    // var { slug } = JSON.parse(ev.body)

    // client.query(
    //     q.Get( q.Match(q.Index('slug'), slug) )
    // )
    //     .then(function (res) {
    //         console.log('single product res', res)
    //         // getPaymentIntent(res.data)
    //         cb(null, {
    //             statusCode: 200,
    //             body: JSON.stringify(res.data)
    //         })
    //     })
    //     .catch(function (err) {
    //         console.log('errrrrrr', err)
    //         return cb(null, {
    //             statusCode: 500,
    //             body: JSON.stringify(err)
    //         })
    //     })

    // async function getPaymentIntent (product) {
    //     const intent = await stripe.paymentIntents.create({
    //         amount: (product.price * 100),
    //         currency: 'usd',
    //         // Verify your integration in this guide by including this parameter
    //         metadata: {
    //             integration_check: 'accept_a_payment',
    //             slug: slug
    //         },
    //     })
    //         .catch(function (err) {
    //             console.log('errrrrrr', err)
    //             return cb(null, {
    //                 statusCode: 500,
    //                 body: JSON.stringify(err)
    //             })
    //         })

    //     var _body = xtend(product, { client_secret: intent.client_secret })
    //     return cb(null, {
    //         statusCode: 200,
    //         body: JSON.stringify(_body)
    //     })
    // }
}
