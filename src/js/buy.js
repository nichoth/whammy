import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'
var stripeKey = 'pk_test_51GrU9fGmvbUUvDLHCSTZ5S1cvBn6pKJdo4fBrit12yFXcV8igIQ2ACaNGV2SkHXN4jiklVSRkXOkQdpKLfPh3MKo00i1PbHHID'
const stripe = Stripe(stripeKey);

export default Buy

Buy()

function Buy () {
    // return an object with a `state` object
    // can attach an object to the window
    var buy = window.buy = { onSubmit, makePayment }

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

    buy.card = card

    function renderWaitingScreen () {
        // var el = document.createElement('div')
        // el.id = 'waiting'
        // document.body.appendChild(el)

        var el = document.getElementById('waiting')
        el.style.display = 'block'
        document.body.classList.add('waiting')

        function doneWaiting () {
            document.body.removeChild(el)
            document.body.classList.remove('waiting')
        }

        return doneWaiting
    }

    window.renderWaitingScreen = renderWaitingScreen

    function onSubmit ({ shipping }, makePayment) {
        var doneWaiting = renderWaitingScreen()
        makePayment({ card, shipping }, (err, res) => doneWaiting())
    }

    var form = document.querySelector('form')
    form.addEventListener('submit', ev => {
        ev.preventDefault()

        var els = ev.target.elements
        var shipping = {
            name: els.name,
            email: els.email,
            address: els.address,
            city: els.city,
            state: els.state,
            zipCode: els['zip-code']
        }
        // var fn = (cb) => makePayment({ card }, cb)
        onSubmit({ shipping }, makePayment)
    })

    function makePayment ({ card, shipping }, cb) {
        var products = cart.products()
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
                var opts = {
                    shipping,
                    paymentMethodID: res.paymentMethodID,
                    products
                }
                pay(opts, products).then(res => {
                    console.log('....in here......', res)
                    cb(null, res)
                })
            })
            .catch(err => {
                // @TODO show error
                console.log('errrorrr', err)
                cb(err)
            })
    }

    function pay ({ shipping, paymentMethodID, products }) {
        return fetch('/.netlify/functions/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                shipping,
                paymentMethodID,
                products
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

    return buy
}


