// const products = require('./data/products.json');
// require('dotenv').config()

// [https://stripe.com/docs/api/products/list](List all products)
exports.handler = function (ev, ctx, cb) {
    var stripe = require('stripe')(process.env.STRIPE_SECRET);
    var _products, _prices

    stripe.products.list({ limit: 3 }, function (err, products) {
        if (err) return cb(null, {
            statusCode: 400,
            body: JSON.stringify(err)
        })

        _products = products
        allDone()
    });

    stripe.prices.list({}, function (err, prices) {
        if (err) return cb(null, {
            statusCode: 400,
            body: JSON.stringify(err)
        })

        _prices = prices
        allDone()
    })

    function allDone () {
        if (!_products || !_prices) return

        cb(null, {
            statusCode: 200,
            body: JSON.stringify({
                products: _products,
                prices: _prices
            })
        })
    }
}


// exports.handler = async () => {
//   // return {
//   //   statusCode: 200,
//   //   body: JSON.stringify(products),
//   // };
// }

