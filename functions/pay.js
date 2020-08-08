var SquareConnect = require('square-connect');
const { randomBytes } = require('crypto')
const config = require("./config.json")[process.env.NODE_ENV];
const defaultClient = SquareConnect.ApiClient.instance;
var oauth2 = defaultClient.authentications['oauth2'];

// defaultClient.basePath = process.env.SQUARE_PATH
// oauth2.accessToken = process.env.SQUARE_ACCESS_TOKEN

oauth2.accessToken = config.squareAccessToken;
defaultClient.basePath = config.path;

var orderApi = new SquareConnect.OrdersApi();
var paymentsApi = new SquareConnect.PaymentsApi();
var locationId = 'PR4NVQPCRMEYP'

console.log('**path env**', process.env.SQUARE_PATH)
console.log('***access-tok***', process.env.SQUARE_ACCESS_TOKEN)
console.log('app-id', process.env.SQUARE_APP_ID)
console.log('config', config)

exports.handler = function (ev, ctx, cb) {
    // console.log('***req***', ev.body)
    var { nonce, orderId } = JSON.parse(ev.body)

    orderApi.batchRetrieveOrders(locationId, { order_ids: [orderId] })
        .then(res => {
            // console.log('***retrieve orders res***', res)
            var { orders } = res
            var order = orders[0]
            makePayment(nonce, order)
        })
        .catch(err => console.log('errrr', err))

    function makePayment (nonce, order) {
        var body = {
            source_id: nonce,
            idempotency_key: randomBytes(20).toString("hex"),
            amount_money: order.total_money, 
            order_id: order.id
        }

        paymentsApi.createPayment(body)
            .then(function (res) {
                console.log('**pay success**', res);
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




    // const res = await orderApi.batchRetrieveOrders(locationId, {
    //     order_ids: [orderId],
    // })
    // var { orders } = res

    // const order = orders[0]

    // console.log('**order**', order)

    // var body = {
    //     source_id: nonce,
    //     idempotency_key: randomBytes(20).toString("hex"),
    //     amount_money: order.total_money, 
    //     order_id: order.id
    // }

    // paymentsApi.createPayment(body)
    //     .then(function (res) {
    //         console.log('pay success', res);
    //         return cb(null, {
    //             statusCode: 200,
    //             body: JSON.stringify(res)
    //         })
    //     })
    //     .catch(function (err) {
    //         console.error('pay error', err);
    //         return cb(null, {
    //             statusCode: 500,
    //             body: JSON.stringify(err)
    //         })
    //     })

}
