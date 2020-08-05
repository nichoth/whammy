// var xtend = require('xtend')
const { randomBytes } = require('crypto')
// var fetch = require('node-fetch');
var SquareConnect = require('square-connect');
const xtend = require('xtend');
// var timestamp = require('monotonic-timestamp')
const config = require("./config.json")[process.env.NODE_ENV];
const defaultClient = SquareConnect.ApiClient.instance;
var oauth2 = defaultClient.authentications['oauth2'];
defaultClient.basePath = config.path;
oauth2.accessToken = config.squareAccessToken;

// var checkoutApi = new SquareConnect.CheckoutApi();
var ordersApi = new SquareConnect.OrdersApi();
var catalogApi = new SquareConnect.CatalogApi();


exports.handler = function (ev, ctx, cb) {
    var locationId = 'PR4NVQPCRMEYP'
    var { products, shipping, email } = JSON.parse(ev.body)

    // console.log('***products***', products)

    catalogApi.batchRetrieveCatalogObjects({
        object_ids: products.map(prod => prod.id),
        include_related_objects: true
    })
        .then(res => {
            // console.log('***cat res***', res)
            createOrder(createOrderReqBody(res.objects))
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
        return  {
            // Unique identifier for request
            idempotency_key: randomBytes(45).toString('hex'),
            order: {
                line_items: products.map(p => {
                    var _prod = xtend(p, {
                        name: p.item_data.name,
                        quantity: '1',
                        "base_price_money": {
                            "amount": 1599,
                            "currency": "USD"
                        }
                    })
                    return _prod
                }),
                
                // products.map(prod => {
                //     return {
                //         quantity: '1',
                //         catalog_object_id: prod.catalogObjectId
                //         // base_price_money: 1000
                //     }
                // }),
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
                            display_name: 'foo',
                            email_address: email
                        }
                    },
                    state: 'PROPOSED'
                }],
                state: 'OPEN'
            }
        }
    }

    function createOrder (orderRequestBody) {
        return ordersApi.createOrder(locationId, orderRequestBody)
            .then(res => {
                // console.log('***create order***', res)
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
