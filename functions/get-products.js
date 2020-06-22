// var stripe = require('stripe')(process.env.STRIPE_SECRET);
var faunadb = require('faunadb')
var q = faunadb.query
var key = process.env.FAUNA_ADMIN_KEY
var client = new faunadb.Client({ secret: key })

// https://www.netlify.com/blog/2018/07/09/building-serverless-crud-apps-with-netlify-functions-faunadb/#setting-up-functions-for-local-development

exports.handler = function (ev, ctx, cb) {
    client.query(
        q.Map(
            q.Paginate( q.Match(q.Index("all_products")) ),
            q.Lambda((ref) => q.Get(ref))
        )
    )
        .then(function (res) {
            console.log('aaaaaa', res.data)
            return cb(null, {
                statusCode: 200,
                body: JSON.stringify(res.data)
            })
        })
        .catch(function (err) {
            console.log('errrrrr', err)
            return cb(null, {
                statusCode: 500,
                body: JSON.stringify(err)
            })
        })


    // client.query(
    //     q.Paginate( q.Match(q.Index("all_products")) )
    // )
    //     .then(function (res) {
    //         var docs = res.data
    //         const contentQuery = docs.map((ref) => {
    //             return q.Get(ref)
    //         })

    //         client.query(contentQuery)
    //             .then(function (res) {
    //                 console.log('aaaaaa', res)
    //                 return cb(null, {
    //                     statusCode: 200,
    //                     body: JSON.stringify(res)
    //                 })
    //             })
    //             .catch(function (err) {
    //                 return cb(null, {
    //                     statusCode: 500,
    //                     body: JSON.stringify(err)
    //                 })
    //             })
    //     })
    //     .catch(function (err) {
    //         console.log('errrr here', err)
    //         cb(null, {
    //             statusCode: 500,
    //             body: JSON.stringify({
    //                 message: err.message
    //             })
    //         })
    //     })

}