// var xtend = require('xtend')
const { randomBytes } = require('crypto')
// var fetch = require('node-fetch');
var SquareConnect = require('square-connect');
// var timestamp = require('monotonic-timestamp')
const config = require("./config.json")[process.env.NODE_ENV];
const defaultClient = SquareConnect.ApiClient.instance;
var oauth2 = defaultClient.authentications['oauth2'];
defaultClient.basePath = config.path;
oauth2.accessToken = config.squareAccessToken;

// var checkoutApi = new SquareConnect.CheckoutApi();
var ordersApi = new SquareConnect.OrdersApi();

exports.handler = function (ev, ctx, cb) {
    // sandbox loca'tion
    var locationId = 'PR4NVQPCRMEYP'
    var { products } = JSON.parse(ev.body)

    var orderRequestBody = {
        // Unique identifier for request
        idempotency_key: randomBytes(45).toString("hex"),
        order: {
            line_items: products.map(prod => {
                return {
                    quantity: prod.itemQuantity,
                    catalog_object_id: prod.catalogObjectId
                }
            }),
            fulfillments: [{
                type: 'SHIPMENT',
                shipment_details: {
                    carrier: 'USPS',
                    recipient: {
                        address: {
                            address_line_1: '',
                            address_line_2: '',
                            address_line_3: '',
                            locality: '', // city or town
                            administrative_district_level_1: '',  // the state
                            country: '',
                            first_name: '',
                            last_name: '',
                            postal_code: ''
                        },
                        email_address: ''
                    }
                },
                state: 'PROPOSED'
            }],
            state: 'OPEN'
        }
    }

    ordersApi.createOrder(location_id, orderRequestBody)
        .then(res => {
            console.log('create order', res)
            return cb(null, {
                statusCode: 200,
                body: JSON.stringify(res)
            })
        })
        .catch(err => {
            console.log('errrrrr', err)
            return cb(null, {
                statusCode: 500,
                body: JSON.stringify(err)
            })
        })

}

// function createBody ({ locationId, lineItems }) {
//     return {
//         "idempotency_key": '' + timestamp(),
//         "redirect_url": "http://localhost:8888/",
//         ask_for_shipping_address: true,
//         "order": {
//             ask_for_shipping_address: true,
//             // "fulfillments": [
//             //     {
//             //         type: 'SHIPMENT',
//             //         shipment_details: {
//             //             carrier: 'USPS',
//             //             recipient: {
//             //                 display_name: "Jaiden Urie"
//             //             }
//             //         }
//             //     }
//             // ],
//             "idempotency_key": '' + timestamp(),
//             "location_id": locationId,
//             "line_items": lineItems.map(item => {
//                 return xtend(item, { quantity: item.quantity + '' })
//             })
//         },
//         "merchant_support_email": "merchant+support@website.com",
//         "pre_populate_buyer_email": "example@email.com",
//         // "pre_populate_shipping_address": {
//         //     "address_line_1": "1455 Market St.",
//         //     "address_line_2": "Suite 600",
//         //     "locality": "San Francisco",
//         //     "administrative_district_level_1": "CA",
//         //     "postal_code": "94103",
//         //     "country": "US",
//         //     "first_name": "Jane",
//         //     "last_name": "Doe"
//         // }
//     }
// }
