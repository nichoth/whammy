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

    var orderBody = createBody({ locationId, lineItems })
    console.log('***order body***', orderBody)

    var body = new SquareConnect.CreateCheckoutRequest(idempotencyKey,
        orderBody)
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
