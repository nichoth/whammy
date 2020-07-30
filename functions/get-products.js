const SquareConnect = require("square-connect");
const xtend = require("xtend");
const config = require("./config.json")[process.env.NODE_ENV];

// Set Square Connect credentials
const defaultClient = SquareConnect.ApiClient.instance;
defaultClient.basePath = config.path;
// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = config.squareAccessToken;

const catalogApi = new SquareConnect.CatalogApi()
var inventoryApi = new SquareConnect.InventoryApi();

exports.handler = async function (ev, ctx, cb) {
    try {
        var inv = await inventoryApi.batchRetrieveInventoryCounts({})
            .then(function (data) {
                // console.log('***API called successfully. Returned data: ***',
                //     data)
                return data
            }, function onErr (error) {
                console.error('errrrrr', error)
            })

        // we are turning objects with image url's in them
        const opts = { types: "ITEM,IMAGE" };
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
                    return (count.catalog_object_id ===
                        prod.item_data.variations[0].id)
                }),
                imageUrl: (imagesById[prod.image_id] &&
                    imagesById[prod.image_id].image_data.url)
            }))
            .filter(prod => prod.inventory.quantity > 0)

        // console.log('***product list***', products)

        // const { locations } = await locationApi.listLocations();
        return cb(null, {
            statusCode: 200,
            body: JSON.stringify({ products })
        })
    } catch (err) {
        console.log('errrr', err)
        return cb(null, {
            statusCode: 500,
            body: JSON.stringify(err)
        })
    }
}