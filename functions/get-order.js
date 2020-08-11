var fetch = require('node-fetch')
const config = require("./config.json")[process.env.NODE_ENV];

// var SquareConnect = require('square-connect');
// var defaultClient = SquareConnect.ApiClient.instance;
// var oauth2 = defaultClient.authentications['oauth2'];
// defaultClient.basePath = config.path
// oauth2.accessToken = config.squareAccessToken

// var ordersApi = new SquareConnect.OrdersApi()
var locationId = 'PR4NVQPCRMEYP'


exports.handler = function (ev, ctx, cb) {
    var url = 'https://connect.squareupsandbox.com/v2/locations/' +
        locationId + '/orders/batch-retrieve'
    var { order_ids } = JSON.parse(ev.body)

    fetch(url, {
        method: 'POST',
        headers: {
            'Square-Version': '2020-07-22',
            'Authorization': 'Bearer ' + config.squareAccessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "order_ids": order_ids
        })
    })
        .then(res => res.json())
        .then(res => {
            return cb(null, {
                statusCode: 200,
                body: JSON.stringify(res.orders[0])
            })
        })
        .catch(err => {
            console.log('oh no', err)
            return cb(null, {
                statusCode: 500,
                body: JSON.stringify(err)
            })
        })
}
