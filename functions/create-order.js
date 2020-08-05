var xtend = require('xtend')
var fetch = require('node-fetch');
const { randomBytes } = require('crypto')
var SquareConnect = require('square-connect');
const config = require("./config.json")[process.env.NODE_ENV];
const defaultClient = SquareConnect.ApiClient.instance;
var oauth2 = defaultClient.authentications['oauth2'];
defaultClient.basePath = config.path;
oauth2.accessToken = config.squareAccessToken;

console.log('config.accesstoken', config.squareAccessToken)

var checkoutApi = new SquareConnect.CheckoutApi();
// var ordersApi = new SquareConnect.OrdersApi();

exports.handler = function (ev, ctx, cb) {
    // sandbox loca'tion
    var locationId = 'PR4NVQPCRMEYP'
    var { catalog_object_ids } = JSON.parse(ev.body)
    var idempotencyKey = '' + randomBytes(20)

    var lineItems = [
        {
            quantity: 1,
            catalog_object_id: catalog_object_ids[0]
        }
    ]

    var _body = createBody({ locationId, lineItems })
    // console.log('***___body***', _body)

    var body = new SquareConnect.CreateCheckoutRequest(idempotencyKey, _body)
    console.log('***body***', body)

    // var headers = {
    //     'Square-Version': '2020-07-22',
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + config.squareAccessToken
    // }

    // var url = 'https://connect.squareupsandbox.com/v2/locations/PR4NVQPCRMEYP/checkouts'
    // fetch(url, {
    //     method: 'POST',
    //     headers: headers,
    //     body: JSON.stringify(body)
    // })
    //     .then(res => res.json())
    //     .then(res => {
    //         console.log('******response to create checkout*****', res)
    //         if (res.errors) {
    //             return cb(null, {
    //                 statusCode: 500,
    //                 body: JSON.stringify(res.errors)
    //             })
    //         }
    //         return cb(null, {
    //             statusCode: 200,
    //             body: JSON.stringify(res)
    //         })
    //     })
    //     .catch(err => {
    //         console.log('errrrr', err)
    //         return cb(null, {
    //             statusCode: 500,
    //             body: JSON.stringify(err)
    //         })
    //     })

    checkoutApi.createCheckout(locationId, body)
        .then(function (res) {
            console.log('**checkout successful**', res);
            console.log('******shipping*****', res.checkout.ask_for_shipping_address)
            return cb(null, {
                statusCode: 200,
                body: JSON.stringify(res)
            })
        }, function onErr (err) {
            console.error('errriii', err);
            cb(null, {
                statusCode: 500,
                body: JSON.stringify(err)
            })
        })
}

function createBody ({ locationId, lineItems }) {
    return {
        "idempotency_key": '' + randomBytes(20),
        "redirect_url": "http://localhost:8888/",
        "ask_for_shipping_address": true,
        "order": {
            "idempotency_key": '' + randomBytes(20),
            "location_id": locationId,
            "line_items": lineItems.map(item => {
                return xtend(item, { quantity: item.quantity + '' })
            })
        },
        "merchant_support_email": "merchant+support@website.com",
        "pre_populate_buyer_email": "example@email.com",
        // "pre_populate_shipping_address": {
        //     "address_line_1": "1455 Market St.",
        //     "address_line_2": "Suite 600",
        //     "locality": "San Francisco",
        //     "administrative_district_level_1": "CA",
        //     "postal_code": "94103",
        //     "country": "US",
        //     "first_name": "Jane",
        //     "last_name": "Doe"
        // }
    }
}
