export async function handleFormSubmission(event) {
    var els = event.target.elements

    event.preventDefault();
    const form = new FormData(event.target);
    var stuff = {
        // sku: event.target.elements.sku.value,
        quantity: event.target.elements.quantity.value
    }

    console.log('stuff', stuff)

    // const data = {
    //     sku: form.get('sku'),
    //     quantity: Number(form.get('quantity')),
    // };

    const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(stuff),
    }).then((res) => res.json());

    const stripe = Stripe(response.publishableKey);
    const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
    });

    if (error) {
        console.error(error);
    }
}

