# whammy
Trying things with netlify & stripe

-------------------------

Use this as a test CC number. The other inputs can be anything
```
4242424242424242
```

--------------------------

[Products and Prices](https://stripe.com/docs/billing/prices-guide)
> If you only have a few products, you should create and manage them in the Dashboard 

[List all products](https://stripe.com/docs/api/products/list)
```js
require('dotenv').config()
var stripe = require('stripe')(process.env.STRIPE_SECRET);

stripe.products.list({ limit: 3 }, function (err, products) {
    // asynchronously called
});
```

[Create a customer](https://stripe.com/docs/billing/prices-guide#create-customer)
> Before billing a customer, you need to create a Customer object that you can configure with a name, email, and payment method.
```js
// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')('sk_test_51GrU9fGmvbUUvDLHxIdVkGP7SsJv9Re4AY6gJ4E9rR55pEIozVyX0BF2H8CO2mpYuZg3eDr4ftjjmTD9GNKsJoMk00wn6cXykX');

const customer = await stripe.customers.create({
  email: 'jenny.rosen@example.com',
  payment_method: 'pm_card_visa',
  invoice_settings: {
    default_payment_method: 'pm_card_visa',
  },
});
```

------------------------------------

[checkout](https://stripe.com/docs/payments/checkout)

-----------------------------------------

## TODO today
for the checkout
- [x] [Retrieve a product](https://stripe.com/docs/api/products/retrieve)

```js
var stripe = require('stripe')('sk_test_51GrU9fGmvbUUvDLHxIdVkGP7SsJv9Re4AY6gJ4E9rR55pEIozVyX0BF2H8CO2mpYuZg3eDr4ftjjmTD9GNKsJoMk00wn6cXykX');

stripe.products.retrieve('prod_HQTNO4cLeDwzDX', function (err, product) {
    // asynchronously called
});
```

-----------------------

## todo
- [x] redirect to a good place after purchase
- [ ] make sure product stock is ok
- [ ] sku has a specific meaning. should change it's use in the code
- [ ] use the lookup_key for prices to relate them to a product
- [ ] only list products that have stock

[How to access query parameters in Netlify functions](https://flaviocopes.com/netlify-functions-query-parameters/)

[Email receipts](https://stripe.com/docs/receipts)

> Stripe can automatically send email receipts after a successful payment, or when you refund one. This is done by providing an email address when making the API request, using the email address of a Customer object, or updating a PaymentIntent with a customer’s email address after checkout
> Receipts for payments created using your test API keys are not sent automatically. Instead, you can view or manually send a receipt using the Dashboard.

------------------------------
* could get products at build time instead of on page load. But that doesn't work because the stock needs to be up to date.
* make the sucess/cancel pages
----------------------------------

## should maybe use fauna + netlify CMS like originally planned b/c stripe doesn't keep stock for us

on product create:
netlify CMS -> ntl function -- create fauna doc

on Purchase:
ntl fn -> stock -1 in fauna, purchase in stripe 
Need to use some kind of listener on stripe to know when to -1 the stock

## comerce.js
3% transaction fee -- $2000/month sales
[commerce.js](https://commercejs.com/)
[commerce.js docs](https://commercejs.com/docs/) -- cart api
[capture order](https://commercejs.com/docs/api/?javascript#capture-order)
[get cart contents](https://commercejs.com/docs/api/?javascript#get-cart-contents)

----------------------------------

[Accept a payment](https://stripe.com/docs/payments/accept-a-payment#web)

Use `elements` in the browser & `paymentIntent` on the server to make a payment. Use `paymentIntent.client_secret`

---------------------------------

And it's back to using the netlify CMS to create docs in fauna I guess.

[Registering to CMS Events](https://www.netlifycms.org/docs/beta-features/#registering-to-cms-events)

> Supported events are `prePublish`, `postPublish`, `preUnpublish`, `postUnpublish`, `preSave` and `postSave`

```js
CMS.registerEventListener({
    name: 'prePublish',
    handler: function ({ author, entry }) {
        var str = JSON.stringify({ author, data: entry.get('data') })
        console.log('prepublish', str)
    }
});

{
  "author":{"login":"nichoth@gmail.com","name":"nichoth"},
  "data":{
    "name":"two",
    "pic":"images/uploads/vag-eye.jpg",
    "description":"woo two description"
  }
}
```

----------------------------------------

[Create, retrieve, update, and delete documents in FaunaDB](https://docs.fauna.com/fauna/current/tutorials/crud.html)

[Quick start with FaunaDB](https://docs.fauna.com/fauna/current/start/cloud.html)

[Create](https://docs.fauna.com/fauna/current/api/fql/functions/create)

-------------------------------------

[FaunaDB/Cookbook/Overview](https://docs.fauna.com/fauna/current/cookbook/)
> Reading or writing database definitions requires an admin key.
```js
var adminClient = new faunadb.Client({
  secret: adminKey
})

adminClient.query(
  q.CreateDatabase({ name: 'annuvin' })
)
.then((ret) => console.log(ret))
```

[Create a document in a collection](https://docs.fauna.com/fauna/current/cookbook/#collection-create-document) -- spells example

[Create a post](https://docs.fauna.com/fauna/current/tutorials/crud#post)

[Building Serverless CRUD apps with Netlify Functions & FaunaDB](https://www.netlify.com/blog/2018/07/09/building-serverless-crud-apps-with-netlify-functions-faunadb/)

> If it’s a valid token issued by the Identity instance linked to the site, Netlify will add the user’s claims in a `context.clientContext.user` object.
You can use this object to add a little guard clause to the handler method in slack.js, blocking access for users who haven’t logged in
[JAMstack architecture on Netlify: How Identity and Functions work together](https://www.netlify.com/blog/2018/03/29/jamstack-architecture-on-netlify-how-identity-and-functions-work-together/)


------------------------------------------

Thur 6-18
Authenticate users before allowing product create URL call.

[identity](https://www.netlifycms.org/docs/add-to-your-site/#authentication) -- example of event listeners on global identity

---------------------------------------

## today
* [ ] automated tests
    - [x] need to know which directory is served as root from tape-run
    - [ ] write tests
* [x] list the products
* [ ] make a quantity field in the products

---------------------------------------------

* [x] list the products
* [x] front-end can display products
* [ ] write a test
* [x] there is a slug for the product URL -- put it in DB
  slug = URL
  fetch('get-product', { body: { slug } })

  or

  --get them all in eleventy and make a separate page for each with the slug as path--

Need to do it at run time so stock is up to date

[Building Serverless CRUD apps with Netlify Functions & FaunaDB](https://www.netlify.com/blog/2018/07/09/building-serverless-crud-apps-with-netlify-functions-faunadb/)

[Create, retrieve, update, and delete documents in FaunaDB](https://docs.fauna.com/fauna/current/tutorials/crud.html#retrieve)
> You can query for posts with a specific title using the match function and the index we created earlier

---------------------------------------


* [ ] has a 404 page for missing slug
* [x] make page for single product

------------------------------------------

* [x] use a separate html page for the product page. Without the logo
* [x] css for single product page
* [x] stripe purchase works

https://stripe.com/docs/payments/accept-a-payment#web

------------------------------------------
6-28

* [ ] show a success page after payment
* [ ] should show error messages for bad payment
* [ ] can delete things
* [ ] should show CMS error states
* [ ] diff pages by genre. Need genre input in CMS
* [ ] can "tag" things
* [x] description in CMS is optional
* [x] localhost `identity` widget forwards to the right place
* [ ] shipping cost calculator
* [x] pagination is ok in fauna query

[Registering to CMS Events](https://www.netlifycms.org/docs/beta-features/#registering-to-cms-events) -- list of CMS events

> Supported events are prePublish, postPublish, preUnpublish, postUnpublish, preSave and postSave.

https://github.com/netlify/netlify-cms/blob/2b46608f86d22c8ad34f75e396be7c34462d9e99/packages/netlify-cms-core/src/lib/registry.js#L6
```js
const allowedEvents = [
  'prePublish',
  'postPublish',
  'preUnpublish',
  'postUnpublish',
  'preSave',
  'postSave',
];
```

```js
  console.log('slug', entry.get('slug'))
```

https://docs.fauna.com/fauna/current/tutorials/indexes/pagination.html#query-large
> The Paginate function defaults to returning up to 64 documents in a "page", which is a subset of the results.

If you use the github or google button on the identity login, it will redirect to the live site URL instead of localhost, but it works with the password.

--------------------------

[fauna ecommerce](https://docs.fauna.com/fauna/current/tutorials/ecommerce)
[delete a post](https://docs.fauna.com/fauna/current/tutorials/crud.html#delete)
[delete](https://docs.fauna.com/fauna/current/api/fql/functions/delete)


