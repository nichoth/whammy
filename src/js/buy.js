import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'
import { html } from 'htm/preact'
import { render } from 'preact';
import { useState } from 'preact/hooks';
var APP_ID = 'sandbox-sq0idb-SYHgUy2XZm6PJjhsp116Cg'

function Shipping () {
    return html`<form>
        <div id="shipping">
            <h2>Shipping address</h2>
            <div class="form-group">
                <input type="text" name="name" id="name"
                    placeholder="Gob" required />
                <label for="name">name</label>
            </div>
            <div class="form-group">
                <input type="email" name="email" id="email"
                    placeholder="email@example.com" required />
                <label for="email">e-mail</label>
            </div>

            <div class="form-group">
                <input type="text" id="address" name="address"
                    placeholder="123 Streetname" required />
                <label for="address">address</label>
            </div>

            <div class="form-group">
                <input type="text" id="city" name="city"
                    placeholder="Los Angeles" required />
                <label for="city">city</label>
            </div>

            <div class="form-group">
                <input type="text" id="state" name="state"
                    placeholder="CA" required />
                <label for="state">state</label>
            </div>

            <div class="form-group">
                <input type="text" id="zip-code" name="zip-code"
                    placeholder="12345" required inputmode="numeric"
                    pattern="[0-9]*" />
                <label for="zip-code">zip code</label>
            </div>
        </div>
    </form>`
}

render(html`<${Shipping} />`, document.getElementById('content'))



// ------------------ shipping form validation -------------------------
function formIsValid (inputs) {
    return Array.prototype.reduce.call(inputs, (acc, input) => {
        return acc && input.validity.valid
    }, true)
}

var inputs = document.querySelectorAll('input')
var btn = document.querySelector('button[type="submit"]')
btn.disabled = true
Array.prototype.forEach.call(inputs, function (input) {
    input.addEventListener('blur', function (ev) {
        input.classList.add('has-focused')
    })

    input.addEventListener('input', function (ev) {
        btn.disabled = !formIsValid(inputs)
    })
})
// ---------------- /form validation -------------------------


Buy()

function Buy () {
    var cart = new Cart({ key: KEY })

    // Create and initialize a payment form object
    const paymentForm = new SqPaymentForm({
        applicationId: APP_ID,
        inputClass: 'sq-input',
        autoBuild: false,
        // Customize the CSS for SqPaymentForm iframe elements
        inputStyles: [{
            fontSize: '16px',
            lineHeight: '24px',
            padding: '16px',
            placeholderColor: '#a0a0a0',
            backgroundColor: 'transparent',
        }],
        // Initialize the credit card placeholders
        cardNumber: {
            elementId: 'sq-card-number',
            placeholder: 'Card Number'
        },
        cvv: {
            elementId: 'sq-cvv',
            placeholder: 'CVV'
        },
        expirationDate: {
            elementId: 'sq-expiration-date',
            placeholder: 'MM/YY'
        },
        postalCode: {
            elementId: 'sq-postal-code',
            placeholder: 'Zip code'
        },
        // SqPaymentForm callback functions
        callbacks: {
            paymentFormLoaded: function () {
                console.log('loaded', arguments)
            },

            /*
            * callback function: cardNonceResponseReceived
            * Triggered when: SqPaymentForm completes a card nonce request
            */
            cardNonceResponseReceived: function (errors, nonce, cardData) {

                // TODO -- in here, call netlify/pay with the nonce, which
                // calls payments_api.createPayment
                // https://developer.squareup.com/docs/payment-form/payment-form-walkthrough#22-configure-the-backend-with-your-access-token

                console.log('got nonce', arguments)
                if (errors) {
                    console.error('Encountered errors:')
                    errors.forEach(function (error) {
                        console.error('  ' + error.message);
                    })
                    alert('Encountered errors, check browser developer console' +
                    'for more details')
                    return
                }
                alert(`The generated nonce is:\n${nonce}`);
                //TODO: Replace alert with code in step 2.1
            }
        }
    })

    var btn = document.getElementById('sq-creditcard')
    btn.innerHTML = 'pay a dollar'
    btn.addEventListener('click', ev => {
        ev.preventDefault()
        console.log('pay a dollar')
        paymentForm.requestCardNonce();
    })

    window.onload = function () {
        // build the Square Payment Form only when dom is loaded
        paymentForm.build();
    }

}

export default Buy




// Buy()

// function Buy () {
//     // return an object with a `state` object
//     // can attach an object to the window
//     var buy = window.buy = { onSubmit, makePayment }

//     // ---------- form validation -------

//     function formIsValid (inputs) {
//         return Array.prototype.reduce.call(inputs, (acc, input) => {
//             return acc && input.validity.valid
//         }, true)
//     }

//     var inputs = document.querySelectorAll('input')
//     var btn = document.querySelector('button[type="submit"]')
//     btn.disabled = true
//     Array.prototype.forEach.call(inputs, function (input) {
//         input.addEventListener('blur', function (ev) {
//             input.classList.add('has-focused')
//         })

//         input.addEventListener('input', function (ev) {
//             btn.disabled = !formIsValid(inputs)
//         })
//     })

//     // ------------------------------------


//     var cart = new Cart({ key: KEY })

//     function renderWaitingScreen () {
//         var el = document.getElementById('waiting')
//         el.style.display = 'block'
//         document.body.classList.add('waiting')

//         function doneWaiting () {
//             // document.body.removeChild(el)
//             el.style.display = 'none'
//             document.body.classList.remove('waiting')
//         }

//         return doneWaiting
//     }

//     function renderError (err) {
//         var el = document.createElement('div')
//         el.classList.add('error-message')
//         var msg = document.createElement('pre')
//         msg.classList.add('message')
//         if (err.code) {
//             msg.appendChild(document.createTextNode(
//                 `ERROR:
//                 ${err.code}
//                 ${err.decline_code}
//                 ${err.doc_url}`
//             ))
//         }
//         el.appendChild(msg)
//         document.body.appendChild(el)
//         function remove () {
//             document.body.removeChild(el)
//         }
//         return remove
//     }

//     window.renderError = renderError
//     window.renderWaitingScreen = renderWaitingScreen

//     function onSubmit ({ shipping }, makePayment) {
//         var doneWaiting = renderWaitingScreen()
//         makePayment({ card, shipping }, (err, res) => {
//             cart.empty()
//             doneWaiting()
//             if (err) {
//                 renderError(err)
//                 return console.log('err', err)
//             }
//             if (res.type === 'StripeCardError') {
//                 console.log('***err here***', err, res)
//                 return renderError(res)
//             }
//         })
//     }

//     var form = document.querySelector('form')
//     form.addEventListener('submit', ev => {
//         ev.preventDefault()

//         var els = ev.target.elements
//         var shipping = {
//             name: els.name.value,
//             email: els.email.value,
//             address: els.address.value,
//             city: els.city.value,
//             state: els.state.value,
//             zipCode: els['zip-code'].value
//         }

//         onSubmit({ shipping }, makePayment)
//     })

//     function makePayment ({ card, shipping }, cb) {
//         // @TODO - quantity input
//         var products = cart.products().map(prod => xtend(prod, { quantity: 1 }))
//         console.log('products', products)
//         console.log('products in order', products)
//         // https://stripe.com/docs/js/payment_methods/create_payment_method
//         stripe.createPaymentMethod({
//             type: 'card',
//             card: card,
//             billing_details: {
//                 // name: 'Jenny Rosen',
//                 // address: '123 street'
//             }
//         })
//             .then(function (res) {
//                 // console.log('payment method res', res)
//                 if (res.error) return console.log('oh no', res.error)
//                 var opts = {
//                     shipping,
//                     paymentMethodID: res.paymentMethod.id,
//                     products
//                 }
//                 pay(opts).then(res => {
//                     // console.log('....res in here......', res)
//                     cb(null, res)
//                     // window.location.href = '/success'
//                 })
//             })
//             .catch(err => {
//                 // @TODO show error
//                 console.log('errrorrr', err)
//                 cb(err)
//             })
//     }

//     function pay ({ shipping, paymentMethodID, products }) {
//         return fetch('/.netlify/functions/create-order', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 shipping,
//                 paymentMethodID,
//                 // @TODO -- use a real quantity input
//                 products
//             })
//         })
//         .then(function (result) {
//             return result.json()
//         })
//         .catch(function(err) {
//             console.log('errrrrr', err)
//         })
//     }

//     var subTotal = cart.products().reduce(function (acc, { price }) {
//         return acc + price
//     }, 0)
//     var products = cart.products()
//     var shippingCost = getShippingCost(products.length)
//     var total = (subTotal + shippingCost)

//     var priceString = new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD'
//     }).format(total.toFixed(2))

//     var text = document.createTextNode(cart.products().length +
//         (cart.products().length === 1 ? ' thing — ' : ' things – ') +
//         '$' + subTotal + ' + $' + shippingCost + ' shipping = ' +
//         '$' + priceString)

//     // ------------- menu part -----------
//     var menu = document.getElementById('menu')
//     var div = document.createElement('div')
//     div.classList.add('summary')
//     div.appendChild(text)
//     menu.appendChild(div)

//     return buy
// }

// function getShippingCost (l) {
//     if (l === 0) return 0
//     if (l === 1) return 3
//     if (l === 2) return 4
//     if (l >= 3 && l <= 8) return 5
//     if (l > 8) return 6
// }
