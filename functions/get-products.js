const SquareConnect = require("square-connect");
const xtend = require("xtend");
const config = require("./config.json")[process.env.NODE_ENV];
const defaultClient = SquareConnect.ApiClient.instance;
// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications['oauth2'];

defaultClient.basePath = config.path;
oauth2.accessToken = config.squareAccessToken;

// defaultClient.basePath = process.env.SQUARE_PATH
// oauth2.accessToken = process.env.SQUARE_ACCESS_TOKEN
// oauth2.accessToken = process.env.SQUARE_APP_SECRET

const catalogApi = new SquareConnect.CatalogApi()
var inventoryApi = new SquareConnect.InventoryApi();

exports.handler = async function (ev, ctx, cb) {
    try {
        var inv = await inventoryApi.batchRetrieveInventoryCounts({})
            .then(function (data) {
                return data
            }, function onErr (error) {
                console.error('errrrrr', error)
            })

        const opts = { types: "ITEM,IMAGE,TAX" };
        var catalogList = await catalogApi.listCatalog(opts);

        var images = catalogList.objects.filter(item => item.type === 'IMAGE')
        var imagesById = images.reduce(function (acc, image) {
            var _acc = {}
            _acc[image.id] = image
            return xtend(acc, _acc)
        }, {})

        var _products = (catalogList.objects
            .filter(item => item.type === 'ITEM'))

        var products = _products
            .map(prod => xtend(prod, {
                inventory: inv.counts.find(count => {
                    // this works b/c we only have 1 variation per product
                    return (count.catalog_object_id ===
                        prod.item_data.variations[0].id)
                }),
                imageUrl: (imagesById[prod.image_id] &&
                    imagesById[prod.image_id].image_data.url)
            }))
            // only list things with stock
            .filter(prod => {
                console.log('**product**', prod)
                return prod.inventory && prod.inventory.quantity > 0
            })

        // console.log('***product list***', products)

        return cb(null, {
            statusCode: 200,
            body: JSON.stringify({
                products,
                images: imagesById,
                tax: catalogList.objects.filter(thing => thing.type === 'TAX')
            })
        })
    } catch (err) {
        console.log('errrr', err)
        return cb(null, {
            statusCode: 500,
            body: JSON.stringify(err)
        })
    }
}
