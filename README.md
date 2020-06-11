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

[tList all products](https://stripe.com/docs/api/products/lis)
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
* [Retrieve a product](https://stripe.com/docs/api/products/retrieve)

```js
var stripe = require('stripe')('sk_test_51GrU9fGmvbUUvDLHxIdVkGP7SsJv9Re4AY6gJ4E9rR55pEIozVyX0BF2H8CO2mpYuZg3eDr4ftjjmTD9GNKsJoMk00wn6cXykX');

stripe.products.retrieve('prod_HQTNO4cLeDwzDX', function (err, product) {
    // asynchronously called
});
```

-----------------------

## todo
* forward to a good place after purchase
* make sure product stock is ok


