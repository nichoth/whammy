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
    var locationId = 'PR4NVQPCRMEYP'
    var { products, shipping, email } = JSON.parse(ev.body)

    // see
    // https://developer.squareup.com/reference/square/orders-api/create-order
    // https://developer.squareup.com/docs/orders-api/create-orders#add-fulfillment-details

    var orderRequestBody = {
        // Unique identifier for request
        idempotency_key: randomBytes(45).toString("hex"),
        order: {
            line_items: products.map(prod => {
                return {
                    quantity: '' + prod.itemQuantity,
                    catalog_object_id: prod.catalogObjectId
                }
            }),
            fulfillments: [{
                type: 'SHIPMENT',
                shipment_details: {
                    carrier: 'USPS',
                    recipient: {
                        address: {
                            address_line_1: shipping.address1,
                            address_line_2: shipping.address2,
                            address_line_3: shipping.address3,
                            locality: shipping.city, // city or town
                            // the state
                            administrative_district_level_1: shipping.state,
                            country: shipping.country,
                            first_name: shipping.firstName,
                            last_name: shipping.lastName,
                            postal_code: shipping.zipCode
                        },
                        display_name: 'foo',
                        email_address: email
                    }
                },
                state: 'PROPOSED'
            }],
            state: 'OPEN'
        }
    }

    ordersApi.createOrder(locationId, orderRequestBody)
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
