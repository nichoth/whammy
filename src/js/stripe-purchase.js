export async function handleFormSubmission (ev, card, stripe, clientSecret) {
    ev.preventDefault();
    var els = ev.target.elements
    console.log('form submit', ev, els)
    console.log('card', card)

    // https://stripe.com/docs/payments/accept-a-payment#web
    // https://github.com/stripe-samples/accept-a-card-payment/blob/master/using-webhooks/client/web/script.js#L67-L85

    stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
            billing_details: {
                name: 'Jenny Rosen'
            }
        }
    })
        .then(function (res) {
            console.log('res here', res)

            if (res.error) {
                // todo -- show message to the user
                return console.log('errrrp', res.error)
            }

            // server-side -- create order in DB then do stripe payment
            // or via webhook for success
            // * shipping address

            // Set up a webhook or plugin to listen for the
            // payment_intent.succeeded event that handles any business
            // critical post-payment actions.
        })
        .catch(function (err) {
            console.log('oh no', err)
        })
}
