# whammy
Trying things with netlify & stripe

-------------------------

## test cards
```
4242424242424242
```
Succeeds and immediately processes the payment.

```
4000000000003220
```
3D Secure 2 authentication must be completed for a successful payment.

```
4000000000009995
```
Always fails with a decline code of insufficient_funds.

```
4000002760003184
```
A test card number that requires authentication.

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

* [ ] should show error messages for bad payment
* [ ] show a success page after payment
* [ ] should show CMS error states
* [ ] diff pages by genre. Need genre input in CMS
* [ ] can "tag" things
* [ ] shipping cost calculator
* [x] can delete things
* [x] description in CMS is optional
* [x] localhost `identity` widget forwards to the right place
* [x] pagination is ok in fauna query
* [ ] create an order
* [x] fix config.yml

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

----------------------------------

[stripe webhook stuff](https://stripe.com/docs/payments/payment-intents/verifying-status#webhooks)


---------------------------------

## webhook test
Serve the functions locally:
```
npm start
```


Setup the stripe webhook destination
```
stripe listen --forward-to localhost:54901/stripe-webhook
```
|^ You need to change the port to the right one (the one returned by `npm start`)
|^ Need to get the secret that is returned from this and put it in env for
    the function


Send the webhook request (it has the right body & headers automatically)
```
$ stripe trigger payment_intent.succeeded
```

```js
serveFunctions({
    functionsDir: path.join(__dirname, '..', 'functions'),
    port: 9090
});
```

https://github.com/netlify/cli/issues/566
https://stripe.com/docs/stripe-cli/webhooks#forward-events
https://stripe.com/docs/api/events/types
https://stripe.com/docs/api/payment_intents/object
https://stripe.com/docs/webhooks/test?lang=node
https://stripe.com/docs/webhooks/build?lang=node



```
stripeEv {
  id: 'evt_1H0yxlBnqQbRlIvQOcDabxh4',
  object: 'event',
  api_version: '2020-03-02',
  created: 1593821435,
  data: {
    object: {
      id: 'pi_1H0yxjBnqQbRlIvQWlHcTMCr',
      object: 'payment_intent',
      amount: 2000,
      amount_capturable: 0,
      amount_received: 0,
      application: null,
      application_fee_amount: null,
      canceled_at: null,
      cancellation_reason: null,
      capture_method: 'automatic',
      charges: [Object],
      client_secret: 'pi_1H0yxjBnqQbRlIvQWlHcTMCr_secret_mXGt3NGtYkEjDEqGrOVE2QUQk',
      confirmation_method: 'automatic',
      created: 1593821435,
      currency: 'usd',
      customer: null,
      description: '(created by Stripe CLI)',
      invoice: null,
      last_payment_error: null,
      livemode: false,
      metadata: {},
      next_action: null,
      on_behalf_of: null,
      payment_method: null,
      payment_method_options: [Object],
      payment_method_types: [Array],
      receipt_email: null,
      review: null,
      setup_future_usage: null,
      shipping: [Object],
      source: null,
      statement_descriptor: null,
      statement_descriptor_suffix: null,
      status: 'requires_payment_method',
      transfer_data: null,
      transfer_group: null
    }
  },
  livemode: false,
  pending_webhooks: 2,
  request: { id: 'req_JaobDjxa7aP0tW', idempotency_key: null },
  type: 'payment_intent.created'
}

.data {
  object: {
    id: 'pi_1H0yxjBnqQbRlIvQWlHcTMCr',
    object: 'payment_intent',
    amount: 2000,
    amount_capturable: 0,
    amount_received: 0,
    application: null,
    application_fee_amount: null,
    canceled_at: null,
    cancellation_reason: null,
    capture_method: 'automatic',
    charges: {
      object: 'list',
      data: [],
      has_more: false,
      total_count: 0,
      url: '/v1/charges?payment_intent=pi_1H0yxjBnqQbRlIvQWlHcTMCr'
    },
    client_secret: 'pi_1H0yxjBnqQbRlIvQWlHcTMCr_secret_mXGt3NGtYkEjDEqGrOVE2QUQk',
    confirmation_method: 'automatic',
    created: 1593821435,
    currency: 'usd',
    customer: null,
    description: '(created by Stripe CLI)',
    invoice: null,
    last_payment_error: null,
    livemode: false,
    metadata: {},
    next_action: null,
    on_behalf_of: null,
    payment_method: null,
    payment_method_options: { card: [Object] },
    payment_method_types: [ 'card' ],
    receipt_email: null,
    review: null,
    setup_future_usage: null,
    shipping: {
      address: [Object],
      carrier: null,
      name: 'Jenny Rosen',
      phone: null,
      tracking_number: null
    },
    source: null,
    statement_descriptor: null,
    statement_descriptor_suffix: null,
    status: 'requires_payment_method',
    transfer_data: null,
    transfer_group: null
  }
}
```


-----------------------------------------

[Elements validates user input as it is typed. To help your customers catch mistakes, listen to change events on the card Element and display any errors](https://stripe.com/docs/payments/accept-a-payment?lang=node)


> Use the Dashboard, a custom webhook, or a third-party plugin to handle *post-payment events* like sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

^ https://stripe.com/docs/payments/checkout/accept-a-payment?lang=node

[metadata](https://stripe.com/docs/payments/payment-intents#storing-information-in-metadata)


--------------------------------

https://stripe.com/docs/payments/checkout/accept-a-payment


> To acknowledge receipt of an event, your endpoint must return a 2xx HTTP status code to Stripe. All response codes outside this range, including 3xx codes, indicate to Stripe that you did not receive the event.
https://stripe.com/docs/webhooks/build?lang=node#return-a-2xx-status-code-quickly

[Shipping address collection](https://stripe.com/docs/payments/checkout/customization?lang=node#shipping-address-collection)


----------------------------------------------------


## stripe webhook payload
```
{
  "id": "evt_1H0yxlBnqQbRlIvQHy2QnROF",
  "object": "event",
  "api_version": "2020-03-02",
  "created": 1593821436,
  "data": {
    "object": {
      "id": "pi_1H0yxjBnqQbRlIvQWlHcTMCr",
      "object": "payment_intent",
      "amount": 2000,
      "amount_capturable": 0,
      "amount_received": 2000,
      "application": null,
      "application_fee_amount": null,
      "canceled_at": null,
      "cancellation_reason": null,
      "capture_method": "automatic",
      "charges": {
        "object": "list",
        "data": [
          {
            "id": "ch_1H0yxkBnqQbRlIvQ4E6pnq5s",
            "object": "charge",
            "amount": 2000,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "application_fee_amount": null,
            "balance_transaction": "txn_1H0yxkBnqQbRlIvQS1apGxi2",
            "billing_details": {
              "address": {
                "city": null,
                "country": null,
                "line1": null,
                "line2": null,
                "postal_code": null,
                "state": null
              },
              "email": null,
              "name": null,
              "phone": null
            },
            "calculated_statement_descriptor": "Stripe",
            "captured": true,
            "created": 1593821436,
            "currency": "usd",
            "customer": null,
            "description": "(created by Stripe CLI)",
            "destination": null,
            "dispute": null,
            "disputed": false,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {
            },
            "invoice": null,
            "livemode": false,
            "metadata": {
            },
            "on_behalf_of": null,
            "order": null,
            "outcome": {
              "network_status": "approved_by_network",
              "reason": null,
              "risk_level": "normal",
              "risk_score": 7,
              "seller_message": "Payment complete.",
              "type": "authorized"
            },
            "paid": true,
            "payment_intent": "pi_1H0yxjBnqQbRlIvQWlHcTMCr",
            "payment_method": "pm_1H0yxjBnqQbRlIvQckXyRocI",
            "payment_method_details": {
              "card": {
                "brand": "visa",
                "checks": {
                  "address_line1_check": null,
                  "address_postal_code_check": null,
                  "cvc_check": null
                },
                "country": "US",
                "exp_month": 7,
                "exp_year": 2021,
                "fingerprint": "7vCGW0oukBtkxGQE",
                "funding": "credit",
                "installments": null,
                "last4": "4242",
                "network": "visa",
                "three_d_secure": null,
                "wallet": null
              },
              "type": "card"
            },
            "receipt_email": null,
            "receipt_number": null,
            "receipt_url": "https://pay.stripe.com/receipts/acct_1GlJDeBnqQbRlIvQ/ch_1H0yxkBnqQbRlIvQ4E6pnq5s/rcpt_Ha9G7PYQqEdXtO2earxkQhRWF14fXF6",
            "refunded": false,
            "refunds": {
              "object": "list",
              "data": [
              ],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/ch_1H0yxkBnqQbRlIvQ4E6pnq5s/refunds"
            },
            "review": null,
            "shipping": {
              "address": {
                "city": "San Francisco",
                "country": "US",
                "line1": "510 Townsend St",
                "line2": null,
                "postal_code": "94103",
                "state": "CA"
              },
              "carrier": null,
              "name": "Jenny Rosen",
              "phone": null,
              "tracking_number": null
            },
            "source": null,
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/charges?payment_intent=pi_1H0yxjBnqQbRlIvQWlHcTMCr"
      },
      "client_secret": "pi_1H0yxjBnqQbRlIvQWlHcTMCr_secret_mXGt3NGtYkEjDEqGrOVE2QUQk",
      "confirmation_method": "automatic",
      "created": 1593821435,
      "currency": "usd",
      "customer": null,
      "description": "(created by Stripe CLI)",
      "invoice": null,
      "last_payment_error": null,
      "livemode": false,
      "metadata": {
      },
      "next_action": null,
      "on_behalf_of": null,
      "payment_method": "pm_1H0yxjBnqQbRlIvQckXyRocI",
      "payment_method_options": {
        "card": {
          "installments": null,
          "network": null,
          "request_three_d_secure": "automatic"
        }
      },
      "payment_method_types": [
        "card"
      ],
      "receipt_email": null,
      "review": null,
      "setup_future_usage": null,
      "shipping": {
        "address": {
          "city": "San Francisco",
          "country": "US",
          "line1": "510 Townsend St",
          "line2": null,
          "postal_code": "94103",
          "state": "CA"
        },
        "carrier": null,
        "name": "Jenny Rosen",
        "phone": null,
        "tracking_number": null
      },
      "source": null,
      "statement_descriptor": null,
      "statement_descriptor_suffix": null,
      "status": "succeeded",
      "transfer_data": null,
      "transfer_group": null
    }
  },
  "livemode": false,
  "pending_webhooks": 1,
  "request": {
    "id": "req_JaobDjxa7aP0tW",
    "idempotency_key": null
  },
  "type": "payment_intent.succeeded"
}
```

## e2e test
```
npm start
```
Visit localhost:8888/<product>.
Submit the test CC number. 

* webhook works -- check in stripe/netlify dashboard
* success page shows -- need to redirect/re-render in client side
* product stock goes -1 -- do this in `create-order` function


-------------------------------

### Decrement operation
https://stackoverflow.com/questions/56894199/how-to-increment-value-in-faunadb-using-javascript-and-serverside-functions

---------------------------------------

[From Static Sites To End User JAMstack Apps With FaunaDB](https://www.smashingmagazine.com/2020/06/static-sites-jamstack-apps-faunadb/)

[E-commerce with fauna tutorial](https://docs.fauna.com/fauna/current/tutorials/ecommerce.html)


--------------------------------------------

[synchronous, server side payments](https://stripe.com/docs/payments/accept-a-payment-synchronously)

[checkout version](https://stripe.com/docs/payments/checkout/accept-a-payment) -- Where you forward the customer to the stripe page. Note the webhook happens before the response in the picture diagram. This is not ideal because the stock decrment/purchase operation are not atomic. You have to buy the thing, then stock is decremented later.

[payment intent](https://stripe.com/docs/payments/payment-intents#best-practices) -- idenpotency key, etc

> Idempotency keys are sent in the Idempotency-Key header, and you should use them for all POST requests to Stripe’s API.
[idempotency key](https://stripe.com/docs/error-handling#sending-idempotency-keys)


the plan
Do the 'synchronous' type of payment process, which happens server-side, and create an `order` record as well. See [accept-a-payment-synchronously](https://stripe.com/docs/payments/accept-a-payment-synchronously)


Use `stripe.createPaymentMethod` on the client

Send the payment method ID to the server where it pays for things
```js
fetch('/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_method_id: result.paymentMethod.id,
      })
    }).then(function(result) {
      // Handle server response (see Step 4)
      result.json().then(function(json) {
        handleServerResponse(json);
      })
    });
```

On the server, create and confirm the paymentIntent
```js
app.post('/pay', async (request, response) => {
    let intent;
    if (request.body.payment_method_id) {
      // Create the PaymentIntent
      intent = await stripe.paymentIntents.create({
        payment_method: request.body.payment_method_id,
        amount: 1099,
        currency: 'usd',
        confirmation_method: 'manual',
        confirm: true
      });
```

First check/decrement the stock, then if it's ok, create an `order` record. Then call stripe.pay and set `confirm: true` on the paymentIntent call

Then when you get the webhook sucess for the payment, mark the order as `paid`, and start shipping things

> Stripe sends a payment_intent.succeeded event when the payment completes. Use the Dashboard, a custom webhook, or a partner solution to receive these events and run actions, like sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.



-----------------------------------------


[server side confirm payment](https://stripe.com/docs/api/payment_intents/confirm)


---------------------------------




## [ecommerce fauna example](https://docs.fauna.com/fauna/current/tutorials/ecommerce#function)

If you call this with a non-existant slug, it will return an error and say "Calling the function resulted in an error."

Exanmple that works:
```js
Call(
  Function("submit_order"),
    [
      [Object({
        "slug": "aaaaaaaaaaa",
        "quantity": 1
      })]
    ]
)
```
res: 
```js
{
  ref: Ref(Collection("orders"), "271505982105846280"),
  ts: 1595187131910000,
  data: {
    line: [
      {
        product: Ref(Collection("products"), "269177027692593672"),
        quantity: 1,
        price: 10
      }
    ],
    status: "new",
    creationDate: Time("2020-07-19T19:32:11.640455Z"),
    shipAddress: "123 street",
    creditCard: "4425"
  }
}
```

-------------------------------------------------

[form validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
[validation tips](https://daverupert.com/2017/11/happier-html5-forms/)


-----------------------------------------------------------------


[metadata](https://stripe.com/docs/api/payment_methods/object#payment_method_object-metadata)



-----------------------------------------------------------------

## testing the 'buy' page

need to use the `buy-things` page
return something from the `buy` page js



