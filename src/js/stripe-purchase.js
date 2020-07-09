// export async function handleFormSubmission (ev) {
export async function handleFormSubmission (opts) {
    var { ev, card, stripe, clientSecret, product } = opts
    ev.preventDefault();
    var els = ev.target.elements
    console.log('form submit', ev, els)
    // console.log('card', card)

    // ----------------------------------------------
    // const productData = {
    //     sku: ev.target.elements.sku.value,
    //     quantity: ev.target.elements.quantity.value
    // }
        
    // **would create the order record here, on the server**
    // const response = await fetch('/.netlify/functions/create-checkout', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(productData),
    // }).then((res) => res.json());

    // const stripe = Stripe(response.publishableKey);

    // const { error } = await stripe.redirectToCheckout({
    //     sessionId: response.sessionId,
    // });
    // if (error) console.log('errr', error)
// --------------------------


    // https://stripe.com/docs/payments/accept-a-payment#web
    // https://github.com/stripe-samples/accept-a-card-payment/blob/master/using-webhooks/client/web/script.js#L67-L85


    // create order
    // then: confirmCardPayment
    //  if card error, mark the order -- all post pay stuff happens in webhooks
    // then: show success/error page

    // success_url: `${process.env.URL}/success`,
    // window.location.href = '/path'; //relative to domain
    // window.location.assign('/path'); -- http redirect style

    // https://developer.mozilla.org/en-US/docs/Web/API/Location/assign
    // window.location.assign("../"); // one level up
    // window.location.assign("/path"); // relative to domain


    // *********TODO********
    // call create-order here, then do `confirmCardPayment`

    fetch('/.netlify/functions/create-order', {
        method: 'POST',
        body: JSON.stringify({ product })
    })
        .then((res) => {
            confirmCard(ev, card, stripe, clientSecret)
            return res.json()
        })
        .then(res => console.log('res create order', res))
        .catch((err) => console.error('errrrrrr create order', err));
}
    

function confirmCard (ev, card, stripe, clientSecret) {
    console.log('confirm', arguments)
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
        receipt_email: 'foo@example.com'
    })
        .then(function (res) {
            if (res.error) {
                console.log('errrrp', res.error)
                // TODO -- show message to the user
                // return window.location.assign("/error"); // relative to domain
                return
            }

            console.log('success', res)
            // window.location.assign("/success"); // relative to domain

            // TODO
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
