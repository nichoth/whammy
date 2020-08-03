var SquareConnect = require('square-connect');
const { randomBytes } = require('crypto')
// var timestamp = require('monotonic-timestamp')
const config = require("./config.json")[process.env.NODE_ENV];
const defaultClient = SquareConnect.ApiClient.instance;
defaultClient.basePath = config.path;
var oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = config.squareAccessToken;

var paymentsApi = new SquareConnect.PaymentsApi();
var locationId = 'PR4NVQPCRMEYP'

exports.handler = function (ev, ctx, cb) {
    var { nonce, orderId } = JSON.parse(ev.body)

    const { orders } = await orderApi.batchRetrieveOrders(locationId, {
        order_ids: [orderId],
    })
    const order = orders[0]

    var body = {
        source_id: nonce,
        idempotency_key: randomBytes(45).toString("hex"),
        amount_money: order.total_money, 
        order_id: order.id
    }

    paymentsApi.createPayment(body)
        .then(function (res) {
            console.log('pay success', res);
            return cb(null, {
                statusCode: 200,
                body: JSON.stringify(res)
            })
        })
        .catch(function (err) {
            console.error('pay error', err);
            return cb(null, {
                statusCode: 500,
                body: JSON.stringify(err)
            })
        })

}