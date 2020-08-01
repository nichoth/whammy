var xtend = require('xtend')
// var fetch = require('node-fetch');
var SquareConnect = require('square-connect');
var timestamp = require('monotonic-timestamp')
const config = require("./config.json")[process.env.NODE_ENV];
const defaultClient = SquareConnect.ApiClient.instance;
var oauth2 = defaultClient.authentications['oauth2'];
defaultClient.basePath = config.path;
oauth2.accessToken = config.squareAccessToken;

console.log('config.accesstoken', config.squareAccessToken)

// var checkoutApi = new SquareConnect.CheckoutApi();
// var ordersApi = new SquareConnect.OrdersApi();

exports.handler = function (ev, ctx, cb) {
    // sandbox loca'tion
    var locationId = 'PR4NVQPCRMEYP'
    const {
        item_var_id,
        item_id,
        item_quantity,
        location_id
    } = JSON.parse(ev.body)

    const orderRequestBody = {
        idempotency_key: randomBytes(45).toString("hex"), // Unique identifier for request
        order: {
            line_items: [{
            quantity: item_quantity,
            catalog_object_id: item_var_id // Id for CatalogItem object
        }]
        }
    }

    // var { catalog_object_ids } = JSON.parse(ev.body)

    var lineItems = [
        {
            quantity: 1,
            catalog_object_id: catalog_object_ids[0]
        }
    ]

    var _body = createBody({ locationId, lineItems })
    console.log('***___body***', _body)

}

function createBody ({ locationId, lineItems }) {
    return {
        "idempotency_key": '' + timestamp(),
        "redirect_url": "http://localhost:8888/",
        ask_for_shipping_address: true,
        "order": {
            ask_for_shipping_address: true,
            // "fulfillments": [
            //     {
            //         type: 'SHIPMENT',
            //         shipment_details: {
            //             carrier: 'USPS',
            //             recipient: {
            //                 display_name: "Jaiden Urie"
            //             }
            //         }
            //     }
            // ],
            "idempotency_key": '' + timestamp(),
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
