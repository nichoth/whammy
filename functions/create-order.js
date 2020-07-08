var faunadb = require('faunadb')
var xtend = require('xtend')

var q = faunadb.query
var key = process.env.FAUNA_ADMIN_KEY
var client = new faunadb.Client({ secret: key })

exports.handler = function (ev, ctx, cb) {
    console.log('in create order', JSON.parse(ev.body))
    var { product } = JSON.parse(ev.body)
    console.log('product', product)
    var { slug } = product
    console.log('slug', slug)

    getPrice().then(function (price) {
        console.log('price here', price)
        decStock().then(function (res) {
            console.log('dec res', res)
            createOrder(price)
                .then(res => {
                    console.log('in here create', res)
                    cb(null, {
                        statusCode: 200,
                        body: JSON.stringify({ message: 'ok' })
                    })
                })
                .catch(function (err) {
                    console.log('err in here', err)
                    return cb(null, {
                        statusCode: 500,
                        body: JSON.stringify(err)
                    })
                })
        })
    })

    function getPrice () {
        return client.query(
            q.Get(
                q.Match(q.Index('slug'), slug)
            )
        )
            .then(res => res.data.price)
            .catch(err => console.log('price err', err))
    }

    // TODO
    // * stock - 1
    function createOrder (price) {
        var order = {
            status: 'new',
            product: xtend(product, { price })
        }
        
        return client.query(q.Create(q.Collection('orders'), order))
            .then(function (res) {
                console.log('aaaa create order aaaa', res)
                return res
            })
            .catch(function (err) {
                console.log('create order errrrrrror', err)
            })
    }

    function decStock () {
        return client.query(
            q.Update(
                q.Select('ref', q.Get( q.Match(q.Index('slug'), slug) ) ),
                {
                    data: {
                        quantity: q.Subtract(
                            q.Select(
                                ['data', 'quantity'],
                                q.Get( q.Match(q.Index('slug'), slug) )
                            ),
                            1
                        )
                    }
                }
            )
        ).catch(function (err) {
            console.log('dec stock err', err)
        })
    }

}
