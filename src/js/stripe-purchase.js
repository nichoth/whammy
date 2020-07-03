export async function handleFormSubmission (ev, card, stripe, clientSecret) {
    ev.preventDefault();
    var els = ev.target.elements
    console.log('form submit', ev, els)
    console.log('card', card)

    // https://stripe.com/docs/payments/accept-a-payment#web
    // https://github.com/stripe-samples/accept-a-card-payment/blob/master/using-webhooks/client/web/script.js#L67-L85


    // create order
    // then: confirmCardPayment
    //  if card error, del the order -- all post pay stuff happens in webhooks
    // then: show success/error page

    // success_url: `${process.env.URL}/success`,
    // window.location.href = '/path'; //relative to domain
    // window.location.assign('/path'); -- http redirect style

    // https://developer.mozilla.org/en-US/docs/Web/API/Location/assign
    // window.location.assign("../"); // one level up
    // window.location.assign("/path"); // relative to domain

    stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
            billing_details: {
                name: 'Jenny Rosen'
            }
        },
        shipping: {
            address: {
                line1: 'Address line 1 (e.g., street, PO Box, or company name).',
                line2: 'Address line 2 (e.g., apartment, suite, unit, or building).',
                postal_code: '',
                city: '',
                state: '',
                country: '',
            },
            name: '',
            carrier: '',
            phone: '',
            tracking_number: ''
        },
        receipt_email: 'string'
        // return_url: 'optional'
    })
        .then(function (res) {
            console.log('res here', res)

            if (res.error) {
                // todo -- show message to the user
                window.location.assign("/error"); // relative to domain
                return console.log('errrrp', res.error)
            }

            window.location.assign("/success"); // relative to domain

            // Set up a webhook or plugin to listen for the
            // payment_intent.succeeded event that handles any business
            // critical post-payment actions.
            // * mark in the DB that order was paid
            // * send emails
        })
        .catch(function (err) {
            console.log('oh no', err)
        })
}
