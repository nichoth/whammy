# whammy
Trying things with netlify & stripe

-------------------------

[Products and Prices](https://stripe.com/docs/billing/prices-guide)
> If you only have a few products, you should create and manage them in the Dashboard 

[https://stripe.com/docs/api/products/list](List all products)
```js
require('dotenv').config()
var stripe = require('stripe')(process.env.STRIPE_SECRET);

stripe.products.list({ limit: 3 }, function (err, products) {
    // asynchronously called
});
```

> Before billing a customer, you need to create a Customer object that you can configure with a name, email, and payment method.
[Create a customer](https://stripe.com/docs/billing/prices-guide#create-customer)

------------------------------------

[checkout](https://stripe.com/docs/payments/checkout)




