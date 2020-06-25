export async function handleFormSubmission (ev) {
    var els = ev.target.elements

    event.preventDefault();
    // const form = new FormData(event.target);
    var stuff = {
        sku: els.sku.value,
        quantity: els.quantity.value
    }

    // console.log('hererere', els.sku.value)
    console.log('stuff', stuff)
    console.log('form submit', ev, ev.target.elements)
    // console.log('target.els', els)

    // const data = {
    //     sku: form.get('sku'),
    //     quantity: Number(form.get('quantity')),
    // };

    // const response = await fetch('/.netlify/functions/create-checkout', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(stuff),
    // }).then((res) => res.json());

    // console.log('*****response****', response)

    // const stripe = Stripe(response.publishableKey);
    // const { error } = await stripe.redirectToCheckout({
    //     sessionId: response.sessionId,
    // });

    // if (error) {
    //     console.error(error);
    // }
}

