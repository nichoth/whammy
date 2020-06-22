// var stripe = require('stripe')(process.env.STRIPE_SECRET);
var faunadb = require('faunadb')
var q = faunadb.query
var key = process.env.FAUNA_ADMIN_KEY
var client = new faunadb.Client({ secret: key })

// const products = require('./data/products.json');
// require('dotenv').config()


// [https://stripe.com/docs/api/products/list](List all products)


// exports.handler = function (ev, ctx, cb) {
//     var _products, _prices

//     stripe.products.list({ limit: 3 }, function (err, products) {
//         if (err) return cb(null, {
//             statusCode: 500,
//             body: JSON.stringify(err)
//         })

//         _products = products
//         allDone()
//     });

// //   {
// //     "sku": "DEMO001",
// //     "name": "This Pretty Plant",
// //     "description": "Look at this pretty plant. Photo by Galina N on Unsplash.",
// //     "image": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&h=600&q=80",
// //     "amount": 1000,
// //     "currency": "USD"
// //   },

//     stripe.prices.list({}, function (err, prices) {
//         if (err) return cb(null, {
//             statusCode: 500,
//             body: JSON.stringify(err)
//         })

//         _prices = prices
//         allDone()
//     })

//     function allDone () {
//         if (!_products || !_prices) return

//         var withPrices = _products.data.map(function (product) {
//             var price = _prices.data.find(function (price) {
//                 return price.product === product.id
//             })
//             product.amount = price.unit_amount
//             return product
//         })

//         cb(null, {
//             statusCode: 200,
//             body: JSON.stringify({
//                 products: withPrices
//             })
//         })
//     }
// }


// -------------------------------------

exports.handler = function (ev, ctx, cb) {
    client.query(
        q.Paginate( q.Match(q.Index("all_products")) )
    )
        .then(function (res) {
            // res.json()
            console.log('res here', res)
            cb(null, {
                statusCode: 200,
                body: JSON.stringify({
                    products: res.data
                })
            })
        })
        .catch(function (err) {
            console.log('errrr here', err)
            cb(null, {
                statusCode: 500,
                body: JSON.stringify({
                    message: err.message
                })
            })
        })

}