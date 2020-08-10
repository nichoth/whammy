var xtend = require('xtend')
const config = require("./config.json")[process.env.NODE_ENV]
var unslug = require('unslug')
var SquareConnect = require('square-connect')
var defaultClient = SquareConnect.ApiClient.instance
var oauth2 = defaultClient.authentications['oauth2']

// defaultClient.basePath = process.env.SQUARE_PATH
// oauth2.accessToken = process.env.SQUARE_ACCESS_TOKEN
defaultClient.basePath = config.path
oauth2.accessToken = config.squareAccessToken;

const catalogApi = new SquareConnect.CatalogApi()
const inventoryApi = new SquareConnect.InventoryApi()

exports.handler = function (ev, ctx, cb) {
    var { name } = JSON.parse(ev.body)

    var body = {
        query: {
            object_types: 'ITEM',
            exact_query: {
                attribute_name: 'name',
                attribute_value: unslug(name)
            }
        },
        include_related_objects: true
    }

    catalogApi.searchCatalogObjects(body).then(async function (res) {
        console.log('*** catalog api res: ***',  res);
        var item = res.objects[0]
        var image = res.related_objects.find(obj => obj.type === 'IMAGE')
        var id = item.item_data.variations[0].id

        var inv = await inventoryApi.retrieveInventoryCount(id, {})
            .catch(err => console.log('errrrrooooo', err))

        cb(null, {
            statusCode: 200,
            body: JSON.stringify(xtend(item, {
                imageUrl: image.image_data.url,
                inventory: inv.counts[0],
                tax: res.related_objects.find(obj => obj.type === 'TAX')
            }))
        })

    }, function onErr (err) {
        console.log('errrrrppppp', err);
        return cb(null, {
            statusCode: 500,
            body: JSON.stringify(err)
        })
    })

}
