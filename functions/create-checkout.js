const stripe = require('stripe')(process.env.STRIPE_SECRET);
// const inventory = require('./data/products.json');

exports.handler = async (event) => {
    const { sku, quantity } = JSON.parse(event.body);

    // const product = inventory.find((p) => p.sku === sku);
    const validatedQuantity = quantity > 0 && quantity < 11 ? quantity : 1;
    console.log('*****sku******', sku)
    var product = await stripe.products.retrieve(sku)
    console.log('****product*****', product)

    try {
        var prices = await stripe.prices.list({})
    } catch (err) {
        console.log('erererererer', err)
    }

    var price = prices.data.find(p => p.product === product.id)
    console.log('*****price*****', price)

    // TODO -- would create an order record here

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_address_collection: {
            allowed_countries: ['US', 'CA'],
        },
        success_url: `${process.env.URL}/success`,
        cancel_url: process.env.URL,
        line_items: [
            {
                name: product.name,
                description: product.description,
                images: [product.image],
                // amount: price.unit_amount,
                // price: price.id,
                currency: 'USD',
                quantity: validatedQuantity,
                price: price.id
            },
        ],
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            sessionId: session.id,
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        }),
    };
};
