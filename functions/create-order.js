require('dotenv').config()
// var xtend = require('xtend')
const { randomBytes } = require('crypto')
// var fetch = require('node-fetch');
var SquareConnect = require('square-connect')
// const xtend = require('xtend');
// var timestamp = require('monotonic-timestamp')
var price = require('../src/js/price')
const defaultClient = SquareConnect.ApiClient.instance;
var oauth2 = defaultClient.authentications['oauth2'];
const config = require("./config.json")[process.env.NODE_ENV];

// defaultClient.basePath = process.env.SQUARE_PATH
// oauth2.accessToken = process.env.SQUARE_ACCESS_TOKEN

console.log('**node env**', process.env.NODE_ENV)
// console.log(process.env.SQUARE_PATH === config.path)
// console.log(process.env.SQUARE_ACCESS_TOKEN === config.squareAccessToken)
// console.log(process.env.SQUARE_APP_ID === config.squareApplicationId)

// if (process.env.SQUARE_PATH === config.path &&
// process.env.SQUARE_ACCESS_TOKEN === config.squareAccessToken &&
// process.env.SQUARE_APP_ID === config.squareApplicationId) {
//         console.log('******fml*********')
// } else {
//     console.log('**foooob**')
// }

defaultClient.basePath = config.path;
oauth2.accessToken = config.squareAccessToken;

// console.log('**path**', process.env.SQUARE_PATH)
// console.log('***access-tok***', process.env.SQUARE_ACCESS_TOKEN)
// console.log('**app-id**', process.env.SQUARE_APP_ID)
// console.log('**config**', config)

// var checkoutApi = new SquareConnect.CheckoutApi();
var ordersApi = new SquareConnect.OrdersApi();
var catalogApi = new SquareConnect.CatalogApi();


exports.handler = function (ev, ctx, cb) {
    var locationId = 'PR4NVQPCRMEYP'
    var { products, shipping, email } = JSON.parse(ev.body)

    catalogApi.batchRetrieveCatalogObjects({
        object_ids: products.map(prod => prod.id),
        include_related_objects: true
    })
        .then(res => {
            // todo -- in here, map the resp with the req body so you can
            // get the desired quantity for each
            var orderReq = createOrderReqBody(res.objects)
            createOrder(orderReq)
            return res.objects
        })
        .catch(err => {
            console.log('errr here', err)
            return cb(null, {
                statusCode: 500,
                body: JSON.stringify(err)
            })
        })

    // see
    // https://developer.squareup.com/reference/square/orders-api/create-order
    // https://developer.squareup.com/docs/orders-api/create-orders#add-fulfillment-details

    function createOrderReqBody (products) {
        return {
            // Unique identifier for request
            idempotency_key: randomBytes(22).toString('hex'),
            order: {
                line_items: products.map(p => {
                    return {
                        "catalog_object_id": p.item_data.variations[0].id,
                        "quantity": "1"
                    }
                }),
                
                fulfillments: [{
                    type: 'SHIPMENT',
                    shipment_details: {
                        carrier: 'USPS',
                        recipient: {
                            address: {
                                address_line_1: shipping.address,
                                address_line_2: shipping.address2,
                                address_line_3: shipping.address3,
                                locality: shipping.city, // city or town
                                // the state
                                administrative_district_level_1: shipping.state,
                                country: shipping.country,
                                first_name: shipping.firstName,
                                last_name: shipping.lastName,
                                postal_code: shipping['zip-code']
                            },
                            display_name: (shipping.firstName + ' ' +
                                shipping.lastName),
                            email_address: email
                        }
                    },
                    state: 'PROPOSED'
                }],

                taxes: [
                    {
                        "catalog_object_id": "STATE_SALES_TAX",
                        "scope": "ORDER"
                    }
                ],

                service_charges: [{
                    name: "delivery fee",
                    amount_money: {
                      amount: price.shipping(products),
                      currency: "USD"
                    },
                    taxable: true,
                    calculation_phase: "SUBTOTAL_PHASE"
                }],
                state: 'OPEN'
            }
        }
    }

    function createOrder (orderRequestBody) {
        console.log('***order req***', orderRequestBody)
        return ordersApi.createOrder(locationId, orderRequestBody)
            .then(res => {
                console.log('***create order resp***', res)
                console.log('***create resp net amounts***', (res.order.
                    net_amounts.service_charge_money))
                console.log('***taxes***', res.order.total_tax_money)
                return cb(null, {
                    statusCode: 200,
                    body: JSON.stringify(res)
                })
            })
            .catch(err => {
                console.log('***errrrrr***', err)
                return cb(null, {
                    statusCode: 500,
                    body: JSON.stringify(err)
                })
            })
    }

}
