var faunadb = require('faunadb')
var xtend = require('xtend')

var q = faunadb.query
var key = process.env.FAUNA_ADMIN_KEY
var client = new faunadb.Client({ secret: key })

exports.handler = function (ev, ctx, cb) {
    // console.log('in create order', JSON.parse(ev.body))
    // var { product } = JSON.parse(ev.body)
    // console.log('product', product)
    // var { slug } = product
    var body = JSON.parse(ev.body)
    // console.log('slug', slug)

    if (!body.methodID) {
        return cb(null, {
            statusCode: 400,
            body: JSON.stringify({
                message: 'should have the payment method ID'
            })
        })
    }

    if (!body.products) {
        return cb(null, {
            statusCode: 400,
            body: JSON.stringify({
                message: 'should have products list in the body'
            })
        })
    }

    var slugs = body.products.map(({ slug }) => slug)


    async function pay (price) {
        var intent = await stripe.paymentIntents.create({
            payment_method: body.methodID,
            amount: 1099,
            currency: 'usd',
            confirmation_method: 'manual',
            confirm: true
        });
        return intent
    }

    // TODO
    // need to make the payment with the method ID
    // need to redesign b/c potentially more than one product can be in the order
    // dev stock and create order should be in one DB query (atomic)

    getPrice(slug).then(function (price) {
        console.log('price here', price)
        decStock(slug).then(function (res) {
            console.log('dec res', res)
            createOrder(price)
                .then(_res => {
                    var intent = pay(price)
                    console.log('intent', intent, price)
                    console.log('in here create order res', _res)
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

    // TODO -- get a list of prices for a list of slugs
    function getPrice (_slug) {
        return client.query(
            q.Get(
                q.Match(q.Index('slug'), _slug)
            )
        )
            .then(res => res.data.price)
            .catch(err => console.log('price err', err))
    }

    // TODO -- list of products
    function createOrder (price) {
        var order = {
            status: 'new',
            product: xtend(product, { price })
        }
        
        return client.query(q.Create(q.Collection('orders'), { data: order }))
            .catch(function (err) {
                console.log('create order errrrrrror', err)
            })
    }

    // TODO -- handle > 1 product
    function decStock (_slug) {
        return client.query(
            q.Update(
                q.Select('ref', q.Get( q.Match(q.Index('slug'), _slug) ) ),
                {
                    data: {
                        quantity: q.Subtract(
                            q.Select(
                                ['data', 'quantity'],
                                q.Get( q.Match(q.Index('slug'), _slug) )
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
