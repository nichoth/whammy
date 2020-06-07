var faunadb = require('faunadb')

// https://docs.fauna.com/fauna/current/tutorials/crud.html#retrieve

/* configure faunaDB Client with our secret */
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
})
const q = faunadb.query

exports.handler = function (ev, ctx, cb) {
    // client.query(q.Paginate(q.Match(q.Ref('indexes/all_products'))))
    // client.query(
    //     q.Get(q.Ref(q.Collection('products')))
    // )
    // client.query(q.Paginate(q.Match(q.Collection('products'), {})))
    client.query(
        q.Get( q.Match(q.Index('all_products')) )
    )
        .then(res => {
            console.log('in here', res)
            return cb(null, {
                statusCode: 200,
                body: JSON.stringify(res)
            })
        })
        .catch(err => {
            console.log('errrrrerer', err)
            return cb(null, {
                statusCode: 400,
                body: JSON.stringify(err)
            })
        })

    // client.query(q.Paginate(q.Match(q.Collection('products'), {})))
    // client.query(q.Paginate(q.Match(q.Ref('classes/products'), {})))
    //     .then((res) => {
    //         console.log('respone', res)
    //         cb(null, {
    //             statusCode: 200,
    //             body: JSON.stringify(res)
    //         })
    //     }).catch((err) => {
    //         console.log("oohhh noooo", err)
    //         /* Error! return the error with statusCode 400 */
    //         return cb(null, {
    //             statusCode: 400,
    //             body: JSON.stringify(err)
    //         })
    //     })

}

