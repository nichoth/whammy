import faunadb, { query as q } from 'faunadb'
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
    const product = JSON.parse(ev.body)
    var { name, pic, description } = product.data
    if (!name || !pic || !description) {
        return cb(null, {
            statusCode: 400,
            body: JSON.stringify({
                missing: 'name, pic, or description'
            })
        })
    }

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


    // client.query(q.Create(q.Collection('spells'), {
    //     data: {
    //         name: 'Fire Beak',
    //         element: ['air', 'fire'],
    //     }
    // }))
    // .then((ret) => console.log(ret))


// client.query(
// q.Create(
//     q.Collection('spells'),
//     {
//     data: {
//         name: 'Fire Beak',
//         element: ['air', 'fire'],
//     },
//     },
// )
// )
// .then((ret) => console.log(ret))
