var faunadb = require('faunadb')
var q = faunadb.query
var key = process.env.FAUNA_ADMIN_KEY
var client = new faunadb.Client({ secret: key })

exports.handler = function (ev, ctx, cb) {
    console.log('in create order', JSON.parse(ev.body))
    var { product } = JSON.parse(ev.body)
    console.log('product', product)
    var { slug } = product
    console.log('slug', slug)
    var order = {
        status: 'new',
        product
    }

    client.query(q.Create(q.Collection('orders'), order))
        .then(function (res) {
            console.log('create order', res)
            cb(null, {
                statusCode: 200,
                body: JSON.stringify(res)
            })
        })
        .catch(function (err) {
            console.log('create order errrrrrror', err)
            return cb(null, {
                statusCode: 500,
                body: JSON.stringify(err)
            })
        })
}
