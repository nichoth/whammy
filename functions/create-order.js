var xtend = require('xtend')
var SquareConnect = require('square-connect');
const config = require("./config.json")[process.env.NODE_ENV];
const defaultClient = SquareConnect.ApiClient.instance;
var oauth2 = defaultClient.authentications['oauth2'];
defaultClient.basePath = config.path;
oauth2.accessToken = config.squareAccessToken;

var checkoutApi = new SquareConnect.CheckoutApi();
var ordersApi = new SquareConnect.OrdersApi();

exports.handler = function (ev, ctx, cb) {
    // sandbox location
    var locationId = 'PR4NVQPCRMEYP'
    var { catalog_object_ids } = JSON.parse(ev.body)
    var idempotencyKey = '1'

    var lineItems = [
        {
            quantity: 1,
            catalog_object_id: catalog_object_ids[0]
        }
    ]

    // order -- https://github.com/square/connect-nodejs-sdk/blob/fafefbb7e6b29e31d3ee2f8ac4e5c7ce911352d4/docs/Order.md
    // var _order = {
    //     location_id: locationId,
    //     line_items: [
    //         {
    //             quantity: 1,
    //             catalog_object_id: catalog_object_ids[0]
    //         }
    //     ]
    // }
    // var orderBody = new SquareConnect.CreateOrderRequest(idempotencyKey, _order);
    var orderBody = createBody({ locationId, lineItems })
    console.log('***order body***', orderBody)
    // var order = await ordersApi.createOrder(locationId, orderBody)
    //     .then(function (res) {
    //         console.log('****create order****', res);
    //         return res
    //     }, function (error) {
    //         console.log('oh no', error);
    //     })

    // console.log('*****order******', order)

    var body = new SquareConnect.CreateCheckoutRequest(idempotencyKey,
        orderBody)
    // var body = new SquareConnect.CreateCheckoutRequest()
    console.log('***body***', body)

    checkoutApi.createCheckout(locationId, body)
        .then(function (data) {
            console.log('**checkout successful**', data);
            return cb(null, {
                statusCode: 200,
                body: JSON.stringify(data)
            })
        }, function onErr (err) {
            console.error('errriii', err);
            cb(null, {
                statusCode: 500,
                body: JSON.stringify(err)
            })
        })
}





// {"errors":[{"category":"INVALID_REQUEST_ERROR","code":"INVALID_VALUE",
// "detail":"Server-derived field is calculated and cannot be set by a client.",
// "field":"order.id"}]

// path: '/v2/locations/PR4NVQPCRMEYP/checkouts'




// The ID of the business location to associate the order with.
// var locationId = "locationId_example";

// CreateOrderRequest | An object containing the fields to POST for the
// request.  See the corresponding object definition for field details.

// var ordersApi = new SquareConnect.OrdersApi();
// var body = new SquareConnect.CreateOrderRequest(idempotencyKey, order);
// order -- https://github.com/square/connect-nodejs-sdk/blob/fafefbb7e6b29e31d3ee2f8ac4e5c7ce911352d4/docs/Order.md
// ordersApi.createOrder(locationId, body).then(function(data) {
//   console.log('API called successfully. Returned data: ' + data);
// }, function(error) {
//   console.error(error);
// });






// fetch.post('https://connect.squareup.com/v2/locations/{location_id}/orders', {
        // method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json'
        //   },
//     body: JSON.stringify({
//         "idempotency_key": "UNIQUE_STRING",
//         "order": {
//             "line_items": [{
//                 "catalog_object_id": "COFFEE_ITEM_ID",
//                 "modifiers": [{
//                     "catalog_object_id": "SMALL_MODIFIER_ID"
//                 }],
//                 "quantity": "1"
//             }]
//         }
//     })
// })
// .then(res => console.log(res))
// .catch(err => console.log('rrrrrrr', err))





// .CreateOrderRequest
// https://github.com/square/connect-nodejs-sdk/blob/fafefbb7e6b29e31d3ee2f8ac4e5c7ce911352d4/docs/Order.md

// var body = new SquareConnect.CreateOrderRequest(); // CreateOrderRequest | An object containing the fields to POST for the request.  See the corresponding object definition for field details.
// apiInstance.createOrder(locationId, body).then(function(data) {
//   console.log('API called successfully. Returned data: ' + data);
// }, function(error) {
//   console.error(error);
// });}

// var body = new SquareConnect.CreateCheckoutRequest(idempotency_key, order)


function createBody ({ locationId, lineItems }) {
    return {
        "idempotency_key": "86ae1696-b1e3-4328-af6d-f1e04d947ad6",
        "redirect_url": "https://merchant.website.com/order-confirm",
        "order": {
            "idempotency_key": "12ae1696-z1e3-4328-af6d-f1e04d947gd4",
            "location_id": locationId,
            "line_items": lineItems.map(item => {
                return xtend(item, { quantity: item.quantity + '' })
            }),
        },
        "ask_for_shipping_address": true,
        "merchant_support_email": "merchant+support@website.com",
        "pre_populate_buyer_email": "example@email.com",
        "pre_populate_shipping_address": {
            "address_line_1": "1455 Market St.",
            "address_line_2": "Suite 600",
            "locality": "San Francisco",
            "administrative_district_level_1": "CA",
            "postal_code": "94103",
            "country": "US",
            "first_name": "Jane",
            "last_name": "Doe"
        }
    }

}


// first create an order, then use it to call createCheckout



