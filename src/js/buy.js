import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'
var stripeKey = 'pk_test_51GrU9fGmvbUUvDLHCSTZ5S1cvBn6pKJdo4fBrit12yFXcV8igIQ2ACaNGV2SkHXN4jiklVSRkXOkQdpKLfPh3MKo00i1PbHHID'
const stripe = Stripe(stripeKey);

(function () {
    // ---------- form validation -------

    var inputs = document.querySelectorAll('input')
    function formIsValid () {
        return Array.prototype.reduce.call(inputs, (acc, input) => {
            return acc && input.validity.valid
        }, true)
    }

    var btn = document.querySelector('button[type="submit"]')
    btn.disabled = true
    Array.prototype.forEach.call(inputs, function (input) {
        input.addEventListener('blur', function (ev) {
            input.classList.add('has-focused')
        })

        input.addEventListener('input', function (ev) {
            btn.disabled = !formIsValid()
        })
    })

    // ------------------------------------


    var cart = new Cart({ key: KEY })

    var style = {
        base: { color: "#32325d" }
    }
    var elements = stripe.elements();
    var cardEl = document.getElementById('card-element')
    var card = elements.create('card', { style });
    card.mount(cardEl);

    function renderWaitingScreen () {
        var el = document.createElement('div')
        el.id = 'waiting'
        document.body.appendChild(el)

        function doneWaiting () {
            document.body.removeChild(el)
        }

        return doneWaiting
    }
    
    var form = document.querySelector('form')
    form.addEventListener('submit', function (ev) {
        ev.preventDefault()
        console.log('in submit', ev, ev.target.elements)

        var products = cart.products()
        console.log('products in buy', products)

        // @TDOO
        // show a loading screen here
        var doneWaiting = renderWaitingScreen()

        // https://stripe.com/docs/js/payment_methods/create_payment_method
        stripe.createPaymentMethod({
            type: 'card',
            card: card,
            billing_details: {
                name: 'Jenny Rosen',
                address: '123 street'
            },
        })
            .then(function (res) {
                console.log('payment method res', res)
                if (res.error) return console.log('oh no', res.error)
                pay(res.paymentMethod.id, products).then(res => {
                    console.log('....in here......', res)
                })
            })
            .catch(err => {
                // @TODO show error
                doneWaiting()
                console.log('errrorrr', err)
            })
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
            return result.json().then(function (res) {
                console.log('server response from pay', res)
                cart.empty()
                window.location.href = '/success'
            })
        })
        .catch(err => {
            // @TODO show error
            doneWaiting()
            console.log('errrrrr', err)
        })
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
