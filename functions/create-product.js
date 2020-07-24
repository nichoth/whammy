var faunadb = require('faunadb')
var q = faunadb.query
var key = process.env.FAUNA_ADMIN_KEY
var slugify = require('slugify')
var xtend = require('xtend')

var client = new faunadb.Client({ secret: key })


// client.query(q.Create(q.Collection('spells'), {
//     data: {
//         name: 'Fire Beak',
//         element: ['air', 'fire'],
//     }
// }))
// .then((ret) => console.log(ret))


exports.handler = function (ev, ctx, cb) {
    const product = JSON.parse(ev.body)
    var { name, pic, description } = product.data
    console.log('name, description', name, description)

    if (!name || !pic || !description) {
        return cb(null, {
            statusCode: 400,
            body: JSON.stringify({
                message: 'missing name, pic, or description'
            })
        })
    }

    // console.log('event', ev)
    // console.log('context', ctx)
    // console.log('cient context', ctx.clientContext)
    const claims = ctx.clientContext && ctx.clientContext.user;
    // console.log('claims', claims)
    if (!claims) {
        return cb(null, {
            statusCode: 401,
            body: JSON.stringify({
                message: 'You must be signed in to call this function'
            })
        });
    }

    // is the slug there already?
    // var slug = slugify(name)
    // TODO take input for quantity
    product.data = xtend(product.data, { quantity: 1 })

    client.query(q.Create(q.Collection('products'), product))
        .then(function (res) {
            console.log('create', res)
            cb(null, {
                statusCode: 200,
                body: JSON.stringify(res)
            })
        })
        .catch(function (err) {
            console.log('errerererer', err)
            return cb(null, {
                statusCode: 500,
                body: JSON.stringify(err)
            })
        })
}
