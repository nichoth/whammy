var faunadb = require('faunadb')
var q = faunadb.query
var key = process.env.FAUNA_ADMIN_KEY
var client = new faunadb.Client({ secret: key })

exports.handler = function (ev, ctx, cb) {
    var { slug } = JSON.parse(ev.body)

    client.query(
        q.Get(
            q.Match(q.Index('slug'), slug)
        )
    )
        .then(function (res) {
            console.log('res', res)
            return cb(null, {
                statusCode: 200,
                body: JSON.stringify(res.data)
            })
        })
        .catch(function (err) {
            console.log('errrrrrr', err)
            return cb(null, {
                statusCode: 500,
                body: JSON.stringify(err)
            })
        })
}

