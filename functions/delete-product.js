var faunadb = require('faunadb')
var q = faunadb.query
var key = process.env.FAUNA_ADMIN_KEY

var client = new faunadb.Client({ secret: key })

exports.handler = function (ev, ctx, cb) {
    const body = JSON.parse(ev.body)
    var { slug } = body
    console.log('**slug**', slug)

    client.query(
        q.Delete(
            q.Select(['ref']),
            q.Get( q.Match(q.Index('slug'), slug) )
        )
    )
        .then(function (res) {
            console.log('delete', res)
            return cb(null, {
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