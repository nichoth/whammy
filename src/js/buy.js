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
var price = require('./price')

Buy()

function Buy () {
    var cart = new Cart({ key: KEY })

    function ShipAndPay ({ products }) {
        var [step, setStep] = useState(0)
        var [orderID, setOrderID] = useState(null)
        var [isValid, setValid] = useState(false)
        var steps = [Shipping, Payment]

        function validChange (_isValid) {
            setValid(_isValid)
        }

        function onAdvance (ev) {
            setStep(1)
        }

        function onGotShipping (shipping) {
            console.log('got shipping', shipping)

            fetch('/.netlify/functions/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shipping,
                    // @TODO -- use a real quantity input
                    products
                })
            })
                .then(function (res) {
                    res.json().then(r => {
                        console.log('******creat order resp****', r)
                        setOrderID(r.order.id)
                        if (r && r.response && r.response.text) {
                            console.log('aaaaaaaaaaa', r.response.text)
                        }
                    })
                })
                .catch(function(err) {
                    console.log('errrrrr', err)
                })
        }

        return html`<div>
            <${steps[step]} onValidityChange=${validChange}
                onGotShipping=${onGotShipping}
                products=${products}
                orderID=${orderID}
            />
            <div className="form-steps">
                ${step === 0 ?
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

    var products = cart.products()
    var subTotal = price.subTotal(products)
    var shippingCost = price.shipping(products)
    var total = price.total(products)

    var priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format((total/100).toFixed(2))

    var text = document.createTextNode(products.length +
        (products.length === 1 ? ' thing — ' : ' things – ') +
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
}
