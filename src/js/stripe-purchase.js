
export async function handleFormSubmission (ev, card, stripe, clientSecret) {
    ev.preventDefault();
    var els = ev.target.elements
    console.log('form submit', ev, els)
    console.log('card', card)

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
        })
        .catch(function (err) {
            console.log('oh no', err)
        })
}

