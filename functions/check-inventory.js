const config = require("./config.json")[process.env.NODE_ENV]
var SquareConnect = require('square-connect')
var defaultClient = SquareConnect.ApiClient.instance
var oauth2 = defaultClient.authentications['oauth2']

// defaultClient.basePath = process.env.SQUARE_PATH
// oauth2.accessToken = process.env.SQUARE_ACCESS_TOKEN
defaultClient.basePath = config.path
oauth2.accessToken = config.squareAccessToken;

const inventoryApi = new SquareConnect.InventoryApi()

exports.handler = function (ev, ctx, cb) {
    var { products } = JSON.parse(ev.body)

    var ids = products.map(prod => {
        return prod.item_data.variations[0].id
    })
    console.log('**ids**', ids)

    inventoryApi.batchRetrieveInventoryCounts({
        catalog_object_ids: ids
    })
        .then(res => {
            console.log('**inv**', res)
            return cb(null, {
                statusCode: 200,
                body: JSON.stringify(res.counts)
            })
        })
        .catch(err => {
            console.log('errrr', err)
            return cb(null, {
                statusCode: 500,
                body: JSON.stringify(err)
            })
        })
        
}
