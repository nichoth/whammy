var SquareConnect = require('square-connect');
const config = require("./config.json")[process.env.NODE_ENV];
const defaultClient = SquareConnect.ApiClient.instance;
var oauth2 = defaultClient.authentications['oauth2'];
defaultClient.basePath = config.path;
oauth2.accessToken = config.squareAccessToken;

var checkoutApi = new SquareConnect.CheckoutApi();
var ordersApi = new SquareConnect.OrdersApi();

exports.handler = async function (ev, ctx, cb) {
    // sandbox location
    var locationId = 'PR4NVQPCRMEYP'
    var { catalog_object_ids } = JSON.parse(ev.body)

    // order -- https://github.com/square/connect-nodejs-sdk/blob/fafefbb7e6b29e31d3ee2f8ac4e5c7ce911352d4/docs/Order.md
    var order = {
        location_id: locationId,
        line_items: [
            {
                quantity: 1,
                catalog_object_id: catalog_object_ids[0]
            }
        ]
    }
    var orderBody = new SquareConnect.CreateOrderRequest(idempotencyKey, order);
    var order = ordersApi.createOrder(locationId, orderBody)
        .then(function (res) {
            console.log('****create order****', res);
            return res
        }, function (error) {
            console.log('oh no', error);
        })



    // var body = new SquareConnect.CreateCheckoutRequest(idempotency_key, order)
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


function createBody () {
    return {
        "idempotency_key": "86ae1696-b1e3-4328-af6d-f1e04d947ad6",
        "redirect_url": "https://merchant.website.com/order-confirm",
        "order": {
            "idempotency_key": "12ae1696-z1e3-4328-af6d-f1e04d947gd4",
            "order": {
                "location_id": "location_id",
                "customer_id": "customer_id",
                "reference_id": "reference_id",
                "line_items": [
                {
                    "name": "Printed T Shirt",
                    "quantity": "2",
                    "base_price_money": {
                    "amount": 1500,
                    "currency": "USD"
                    },
                    "applied_discounts": [
                    {
                        "discount_uid": "56ae1696-z1e3-9328-af6d-f1e04d947gd4"
                    }
                    ],
                    "applied_taxes": [
                    {
                        "tax_uid": "38ze1696-z1e3-5628-af6d-f1e04d947fg3"
                    }
                    ]
                },
                {
                    "name": "Slim Jeans",
                    "quantity": "1",
                    "base_price_money": {
                        "amount": 2500,
                        "currency": "USD"
                    }
                },
                {
                    "name": "Woven Sweater",
                    "quantity": "3",
                    "base_price_money": {
                        "amount": 3500,
                        "currency": "USD"
                    }
                }
                ],
                "taxes": [
                {
                    "uid": "38ze1696-z1e3-5628-af6d-f1e04d947fg3",
                    "type": "INCLUSIVE",
                    "percentage": "7.75",
                    "scope": "LINE_ITEM"
                }
                ],
                "discounts": [
                {
                    "uid": "56ae1696-z1e3-9328-af6d-f1e04d947gd4",
                    "type": "FIXED_AMOUNT",
                    "scope": "LINE_ITEM",
                    "amount_money": {
                        "amount": 100,
                        "currency": "USD"
                    }
                }
                ]
            }
        },
        "additional_recipients": [
        {
            "location_id": "057P5VYJ4A5X1",
            "description": "Application fees",
            "amount_money": {
                "amount": 60,
                "currency": "USD"
            }
        }
        ],
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



