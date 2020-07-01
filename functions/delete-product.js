var faunadb = require('faunadb')
var q = faunadb.query
var key = process.env.FAUNA_ADMIN_KEY

var client = new faunadb.Client({ secret: key })

exports.handler = function (ev, ctx, cb) {
    const body = JSON.parse(ev.body)
    var { slug } = body
    console.log('delete **slug**', slug)

    const claims = ctx.clientContext && ctx.clientContext.user;
    if (!claims) {
        return cb(null, {
            statusCode: 401,
            body: JSON.stringify({
                message: 'You must be signed in to call this function'
            })
        })
    }

    client.query(
        q.Delete(
            q.Select(['ref'], q.Get( q.Match(q.Index('slug'), slug) ))
        )
    )
        .then(function (res) {
            return cb(null, {
                statusCode: 200,
                body: JSON.stringify(res)
            })
        })
        .catch(function (err) {
            console.log('err in here', err)
            return cb(null, {
                statusCode: 500,
                body: JSON.stringify(err)
            })
        })
}