import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'
var stripeKey = 'pk_test_51GrU9fGmvbUUvDLHCSTZ5S1cvBn6pKJdo4fBrit12yFXcV8igIQ2ACaNGV2SkHXN4jiklVSRkXOkQdpKLfPh3MKo00i1PbHHID'
const stripe = Stripe(stripeKey);

var cart = new Cart({ key: KEY })

var subTotal = cart.products().reduce(function (acc, { price }) {
    return acc + price
}, 0)

var style = {
    base: { color: "#32325d" }
}
var elements = stripe.elements();
var cardEl = document.getElementById('card-element')
var card = elements.create('card', { style });
card.mount(cardEl);

var form = document.querySelector('form')
form.addEventListener('submit', function (ev) {
    ev.preventDefault()
    console.log('submit', ev, ev.target.elements)

    var products = cart.products()
    console.log('products in buy', products)

    // https://stripe.com/docs/js/payment_methods/create_payment_method
    stripe.createPaymentMethod({
        type: 'card',
        card: card,
        billing_details: {
            name: 'Jenny Rosen',
            address: '123 street'
        },
    })
        .then(function(res) {
            console.log('payment method res', res)
            if (res.error) return console.log('oh no', res.error)
            pay(res.paymentMethod.id, products)
        })
        .catch(err => console.log('errrorrr', err))

    function pay (methodID, _products) {
        fetch('/.netlify/functions/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paymentMethodID: methodID,
                products: _products
            })
        }).then(function(result) {
            // Handle server response (see Step 4)
            result.json().then(function (res) {
                handleServerResponse(res);
            })
        })
        .catch(err => console.log('errrrrr', err))
    }

    function handleServerResponse (res) {
        console.log('server response', res)
    }
})
