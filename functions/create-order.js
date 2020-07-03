var faunadb = require('faunadb')
var q = faunadb.query
var key = process.env.FAUNA_ADMIN_KEY

var client = new faunadb.Client({ secret: key })


// client.query(q.Create(q.Collection('spells'), {
//     data: {
//         name: 'Fire Beak',
//         element: ['air', 'fire'],
//     }
// }))
// .then((ret) => console.log(ret))


exports.handler = function (ev, ctx, cb) {
    // const product = JSON.parse(ev.body)
    var order = {
        state: 'new'
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
