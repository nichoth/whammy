import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'
var stripeKey = 'pk_test_51GrU9fGmvbUUvDLHCSTZ5S1cvBn6pKJdo4fBrit12yFXcV8igIQ2ACaNGV2SkHXN4jiklVSRkXOkQdpKLfPh3MKo00i1PbHHID'
const stripe = Stripe(stripeKey);

(function () {


    // ---------- form validation -------

    // var inputs = document.querySelector('input')
    // inputs.forEach(input => {
    //     input.addEventListener('invalid', ev => console.log('invalid', ev))
    // })

    // ------------------------------------



    var cart = new Cart({ key: KEY })

    // var subTotal = cart.products().reduce(function (acc, { price }) {
    //     return acc + price
    // }, 0)

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
        console.log('in submit', ev, ev.target.elements)

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
    })

    function pay (paymentMethodID, _products) {
        fetch('/.netlify/functions/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paymentMethodID: paymentMethodID,
                products: _products
            })
        }).then(function(result) {
            result.json().then(function (res) {
                handleServerResponse(res)
                console.log('server response from pay', res)
                cart.empty()
                // @TODO
                // * show a success page
            })
        })
        .catch(err => console.log('errrrrr', err))
    }

    var subTotal = cart.products().reduce(function (acc, { price }) {
        return acc + price
    }, 0)

    var orderInfo = document.querySelector('.order-info')
    var text = document.createTextNode(cart.products().length +
        (cart.products().length === 1 ? ' thing – ' : ' things – ') +
        '$' + subTotal)
    orderInfo.appendChild(text)
})();
