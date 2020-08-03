# whammy
The square space branch

## test cards

* 	4111 1111 1111 1111    CVV: 111


[ORDERS API: ORDER-AHEAD SAMPLE APP](https://developer.squareup.com/docs/orders-api/quick-start/step-2)

[CATALOG API](https://developer.squareup.com/docs/catalog-api/what-it-does)

---------------------------------

developer dashboard -- api keys for sandbox and live site -- https://developer.squareup.com/apps/sq0idp-iO1CV_ycCPyJ4HW9rhWogg
live dashboard -- products -- https://squareup.com/dashboard
sandboxdashboard -- products -- https://squareupsandbox.com/dashboard


-----------------------------------------------


Start the netlify local dev server, watch css and js files
```
npm start
```

Build everything, the same way it will be deployed
```
npm run build
```

Tests for the buy things page
```
npm test
```

Open the cypress test gui
```
npm run test:open
```

-------------------------------------------------


https://www.netlify.com/blog/2018/07/09/building-serverless-crud-apps-with-netlify-functions-faunadb/#setting-up-functions-for-local-development

https://developer.squareup.com/blog/introducing-square-checkout/

https://developer.squareup.com/docs/online-payment-options

https://developer.squareup.com/docs/payment-form/payment-form-walkthrough

[hosted checkout](https://squareup.com/us/en/townsquare/hosted-checkout-set-up-an-online-payment-form)

https://developer.squareup.com/docs/checkout-api-overview

https://developer.squareup.com/blog/createcheckout-options-explained/

https://developer.squareup.com/docs/checkout-api-overview


------------------------------------------------



[order metadata](https://developer.squareup.com/reference/square/objects/Order#definition__property-metadata)

[payment example](https://github.com/square/connect-api-examples/blob/master/connect-examples/v2/node_orders-payments/routes/checkout.js#L414) -- first create and order, then do `pay(orderId)`

[order payment](https://github.com/square/connect-api-examples/blob/master/connect-examples/v2/node_orders-payments/routes/checkout.js#L362)

[payment form walkthrough](https://developer.squareup.com/docs/payment-form/payment-form-walkthrough)





-------------------------------------------------------------

[walkthrough- integrate payments](https://developer.squareup.com/docs/payment-form/payment-form-walkthrough#113-add-javascript-to-indexhtml)

[SQPaymentForm](https://developer.squareup.com/docs/api/paymentform#navsection-paymentform)

[payment example](https://github.com/square/connect-api-examples/blob/master/connect-examples/v2/node_orders-payments/routes/checkout.js#L362)

[order ahead sample](https://developer.squareup.com/docs/orders-api/quick-start/step-2)

[order ahead sample github](https://github.com/square/connect-api-examples/tree/master/connect-examples/v2/node_orders-payments)

[Add fulfillment details - create orders article](https://developer.squareup.com/docs/orders-api/create-orders#add-fulfillment-details)

[create order route example](https://github.com/square/connect-api-examples/blob/master/connect-examples/v2/node_orders-payments/routes/index.js#L70)

[pay for orders](https://developer.squareup.com/docs/orders-api/pay-for-orders)


## Walkthrough: Integrate Square Payments in a Website
[square form embed](xhttps://developer.squareup.com/docs/payment-form/payment-form-walkthrough#11-embed-sqpaymentform-in-a-static-web-page)
```html
<script type="text/javascript" src="https://js.squareupsandbox.com/v2/paymentform">
</script>
```

[add html els](https://developer.squareup.com/docs/payment-form/payment-form-walkthrough#112--add-an-html-div)


------------------------------

[Walkthrough: Integrate Square Payments in a Website](https://developer.squareup.com/docs/payment-form/payment-form-walkthrough)

--------------------------------------------------

Enter shipping and create an order
Use the order ID to pay for the order with that square order input

## payment
[pay for order](https://developer.squareup.com/docs/orders-api/pay-for-orders)

[create payment](https://github.com/square/connect-nodejs-sdk/blob/fafefbb7e6b29e31d3ee2f8ac4e5c7ce911352d4/docs/PaymentsApi.md#createPayment)

---------------------------------------------

## todo
* new preact view for shipping address
* preact view for card info / submit payment
* both views are in the buy-things route

[walkthrough](https://developer.squareup.com/docs/payment-form/payment-form-walkthrough#22-configure-the-backend-with-your-access-token)


