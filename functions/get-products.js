// var stripe = require('stripe')(process.env.STRIPE_SECRET);
// var faunadb = require('faunadb')
// var q = faunadb.query
// var key = process.env.FAUNA_ADMIN_KEY
const SquareConnect = require("square-connect");
const xtend = require("xtend");
const config = require("./config.json")['sandbox'];

// Set Square Connect credentials
const defaultClient = SquareConnect.ApiClient.instance;
defaultClient.basePath = config.path;

// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = config.squareAccessToken;

const catalogApi = new SquareConnect.CatalogApi()

// var client = new faunadb.Client({ secret: key })

// https://www.netlify.com/blog/2018/07/09/building-serverless-crud-apps-with-netlify-functions-faunadb/#setting-up-functions-for-local-development



// client.query(
//     q.Map(
//         q.Paginate( q.Match(Index("quantity")), { after: 1 } ),
//         q.Lambda("x", Get(Select(1, Var("x"))))
//     )

// Map(
//     Paginate(
//       Match(Index("emp_by_sal")),
//       { after: 2000 }
//     ),
//     Lambda("x", Get(Select(1, Var("x"))))
//   )

// Map(
//     Paginate(
//       Match(Index("dept_by_deptno"), 10)
//     ),
//     Lambda("X", Get(Var("X")))
// )
// )


exports.handler = async function (ev, ctx, cb) {
//     client.query(
//         q.Map(
//             q.Paginate( q.Match(q.Index("quantity")), { after: 1 } ),
//             q.Lambda("x", q.Get(q.Select(1, q.Var("x"))))
//         )
//         // q.Map(
//         //     q.Paginate( q.Match(q.Index("all_products")), { size: 1000 } ),
//         //     q.Lambda((ref) => q.Get(ref))
//         // )
//     )
//         .then(function (res) {
//             console.log('aaaaaa', res.data)
//             return cb(null, {
//                 statusCode: 200,
//                 body: JSON.stringify(res.data)
//             })
//         })
//         .catch(function (err) {
//             console.log('errrrrr', err)
//             return cb(null, {
//                 statusCode: 500,
//                 body: JSON.stringify(err)
//             })
//         })


    const opts = { types: "ITEM,IMAGE" };
    try {
        // we are turning objects with image url's in them
        var catalogList = await catalogApi.listCatalog(opts);

        var images = catalogList.objects.filter(item => item.type === 'IMAGE')
        var imagesById = images.reduce(function (acc, image) {
            var _acc = {}
            _acc[image.id] = image
            return xtend(acc, _acc)
        }, {})

        var _products = (catalogList.objects
            .filter(item => item.type === 'ITEM'))
        var products = _products.map(prod => xtend(prod, {
            imageUrl: !!(imagesById[prod.image_id] &&
                imagesById[prod.image_id].image_data.url)
        }))
        // console.log('product list', products)

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