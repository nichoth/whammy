require('dotenv').config()
const { randomBytes } = require('crypto')
var SquareConnect = require('square-connect')
var price = require('../src/js/price');
const xtend = require('xtend');
const defaultClient = SquareConnect.ApiClient.instance;
var oauth2 = defaultClient.authentications['oauth2'];
const config = require("./config.json")[process.env.NODE_ENV];

console.log('**node env**', process.env.NODE_ENV)

defaultClient.basePath = config.path;
oauth2.accessToken = config.squareAccessToken;

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
            // here -- pass in the quantity being ordered for each product
            // need to add a quantity field to each product in the resp

            var prods = res.objects.map(prod => {
                var reqProd = products.find(p => p.id === prod.id)
                return xtend(prod, {
                    quantity: reqProd.quantity
                })
            })

            var orderReq = createOrderReqBody(prods)
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
        console.log('***products***', products)
        return {
            // Unique identifier for request
            idempotency_key: randomBytes(22).toString('hex'),
            order: {
                line_items: products.map(p => {
                    return {
                        "catalog_object_id": p.item_data.variations[0].id,
                        // here -- take quantity input
                        "quantity": p.quantity
                    }
                }),

                taxes: [
                    {
                        "catalog_object_id": "R5DUEVVRRTSINCKI27POCYPU",
                        "scope": "ORDER"
                    }
                ],
                
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
