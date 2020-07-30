var xtend = require('xtend')
const config = require("./config.json")[process.env.NODE_ENV]
var unslug = require('unslug')
var SquareConnect = require('square-connect')
var defaultClient = SquareConnect.ApiClient.instance
defaultClient.basePath = config.path
var oauth2 = defaultClient.authentications['oauth2']
oauth2.accessToken = config.squareAccessToken;
const catalogApi = new SquareConnect.CatalogApi()

exports.handler = function (ev, ctx, cb) {
    // var { id } = JSON.parse(ev.body)
    var { name } = JSON.parse(ev.body)
    console.log('****name******', unslug(name))

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
    catalogApi.searchCatalogObjects(body).then(function (res) {
        console.log('API called successfully. Returned data: ',  res);
        var item = res.objects[0]
        var image = res.related_objects.find(obj => obj.type === 'IMAGE')
        return cb(null, {
            statusCode: 200,
            body: JSON.stringify(xtend(item, {
                imageUrl: image.image_data.url
            }))
        })
    }, function (err) {
        console.log('errrrr', err);
        return cb(null, {
            statusCode: 500,
            body: JSON.stringify(err)
        })
    })

}
