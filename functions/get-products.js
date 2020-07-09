// var stripe = require('stripe')(process.env.STRIPE_SECRET);
var faunadb = require('faunadb')
var q = faunadb.query
var key = process.env.FAUNA_ADMIN_KEY
var client = new faunadb.Client({ secret: key })

// https://www.netlify.com/blog/2018/07/09/building-serverless-crud-apps-with-netlify-functions-faunadb/#setting-up-functions-for-local-development



// client.query(
//     q.Map(
//         q.Paginate( q.Match(Index("quantity")), { after: 1 } ),
//         q.Lambda("x", Get(Select(1, Var("x"))))
//     )

// Map(
//     Paginate(
//       Match(Index("emp_by_sal")),
//       { after: 2000 }
//     ),
//     Lambda("x", Get(Select(1, Var("x"))))
//   )

// Map(
//     Paginate(
//       Match(Index("dept_by_deptno"), 10)
//     ),
//     Lambda("X", Get(Var("X")))
// )
// )



exports.handler = function (ev, ctx, cb) {
    client.query(
        q.Map(
            q.Paginate( q.Match(q.Index("quantity")), { after: 1 } ),
            q.Lambda("x", q.Get(q.Select(1, q.Var("x"))))
        )
        // q.Map(
        //     q.Paginate( q.Match(q.Index("all_products")), { size: 1000 } ),
        //     q.Lambda((ref) => q.Get(ref))
        // )
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
}