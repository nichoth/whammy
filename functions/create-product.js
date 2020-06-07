var faunadb = require('faunadb')

/* configure faunaDB Client with our secret */
const q = faunadb.query
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
})

exports.handler = (event, context, cb) => {
    console.log('-------------ctxvtxvtxvtxctxctxctx:::::::::::-----------')
    console.log(context)

    console.log('--------------event-----------------')
    console.log('ev', event)
    console.log('------------body------------------')
    const body = JSON.parse(event.body);
    console.log('body', body)

    // client.query(q.Create(q.ref('classes/products'), body))
    client.query(q.Create(q.Collection('products'), { data: body }))
        .then((res) => {
            console.log('respone', res)
            cb(null, {
                statusCode: 200,
                body: JSON.stringify(res)
            })
        }).catch((err) => {
            console.log("error", err)
            /* Error! return the error with statusCode 400 */
            return cb(null, {
                statusCode: 400,
                body: JSON.stringify({
                    req: body,
                    err: err
                })
            })
        })
}


    // const data = JSON.parse(event.body)
    // console.log("Function `todo-create` invoked", data)
    // const todoItem = {
    //     data: data
    // }

    // return client.query(q.Create(q.Ref("classes/todos"), todoItem))
    // .then((response) => {
    //     console.log("success", response)
    //     /* Success! return the response with statusCode 200 */
    //     return callback(null, {
    //         statusCode: 200,
    //         body: JSON.stringify(response)
    //     })
    // }).catch((error) => {
    //     console.log("error", error)
    //     /* Error! return the error with statusCode 400 */
    //     return callback(null, {
    //         statusCode: 400,
    //         body: JSON.stringify(error)
    //     })
    // })

