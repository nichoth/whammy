import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'
import { html } from 'htm/preact'
import { render } from 'preact'
import { useState } from 'preact/hooks'
import Shipping from './shipping'
import Payment from './pay'
var _ = {
    get: require('lodash/get')
}
import price from './price'

Buy()

function Buy () {
    function ShipAndPay ({ products }) {
        var [state, setState] = useState({ step: 0 })
        var [isValid, setValid] = useState(false)
        var steps = [Shipping, Payment]

        function validChange (_isValid) {
            setValid(_isValid)
        }

        function onAdvance (ev) {
            setState({ step: 1 })
            // call create-order here
        }

        function onGotShipping(shipping) {
            console.log('got shipping', shipping)
        }

        return html`<div>
            <${steps[state.step]} onValidityChange=${validChange}
                onAdvance=${onGotShipping}
                products=${products}
            />
            <div className="form-steps">
                ${state.step === 0 ?
                    (html`<button className="next-step"
                        disabled=${!isValid}
                        onClick=${onAdvance}
                    >
                        pay >
                    </button>`) :
                    null
                }
            </div>
        </div>`
    }

    var cart = new Cart({ key: KEY })

    var products = cart.products()
    var subTotal = price.subTotal(products)
    var shippingCost = price.shipping(products)
    var total = price.total(products)

    var priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format((total/100).toFixed(2))

    var text = document.createTextNode(cart.products().length +
        (cart.products().length === 1 ? ' thing — ' : ' things – ') +
            '$' + subTotal/100 + ' + $' + shippingCost/100 + ' shipping = ' +
            priceString)

    render(html`<${ShipAndPay} products=${products} />`,
        document.getElementById('content'))


    // ------------- menu part -----------
    var menu = document.getElementById('menu')
    var div = document.createElement('div')
    div.classList.add('summary')
    div.appendChild(text)
    menu.appendChild(div)
    // ------------------------------------


    // function onSubmit ({ shipping }, makePayment) {
    //     var doneWaiting = renderWaitingScreen()
    //     makePayment({ card, shipping }, (err, res) => {
    //         cart.empty()
    //         doneWaiting()
    //         if (err) {
    //             renderError(err)
    //             return console.log('err', err)
    //         }
    //         if (res.type === 'StripeCardError') {
    //             console.log('***err here***', err, res)
    //             return renderError(res)
    //         }
    //     })
    // }

    // var form = document.querySelector('form')
    // form.addEventListener('submit', ev => {
    //     ev.preventDefault()

    //     var els = ev.target.elements
    //     var shipping = {
    //         name: els.name.value,
    //         email: els.email.value,
    //         address: els.address.value,
    //         city: els.city.value,
    //         state: els.state.value,
    //         zipCode: els['zip-code'].value
    //     }

    //     onSubmit({ shipping }, makePayment)
    // })

    // function makePayment ({ card, shipping }, cb) {
    //     // @TODO - quantity input
    //     var products = cart.products().map(prod => xtend(prod, { quantity: 1 }))
    //     console.log('products', products)
    //     console.log('products in order', products)
    //     // https://stripe.com/docs/js/payment_methods/create_payment_method
    //     stripe.createPaymentMethod({
    //         type: 'card',
    //         card: card,
    //         billing_details: {
    //             // name: 'Jenny Rosen',
    //             // address: '123 street'
    //         }
    //     })
    //         .then(function (res) {
    //             // console.log('payment method res', res)
    //             if (res.error) return console.log('oh no', res.error)
    //             var opts = {
    //                 shipping,
    //                 paymentMethodID: res.paymentMethod.id,
    //                 products
    //             }
    //             pay(opts).then(res => {
    //                 // console.log('....res in here......', res)
    //                 cb(null, res)
    //                 // window.location.href = '/success'
    //             })
    //         })
    //         .catch(err => {
    //             // @TODO show error
    //             console.log('errrorrr', err)
    //             cb(err)
    //         })
    // }

    // function pay ({ shipping, paymentMethodID, products }) {
    //     return fetch('/.netlify/functions/create-order', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //             shipping,
    //             paymentMethodID,
    //             // @TODO -- use a real quantity input
    //             products
    //         })
    //     })
    //     .then(function (result) {
    //         return result.json()
    //     })
    //     .catch(function(err) {
    //         console.log('errrrrr', err)
    //     })
    // }
}
