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

Buy()


function Buy () {
    var cart = new Cart({ key: KEY })

    function ShipAndPay ({ products, cart }) {
        var [step, setStep] = useState(0)
        var [orderID, setOrderID] = useState(null)
        var [order, setOrder] = useState(null)
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
                        setOrder(r.order)
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
                order=${order}
                cart=${cart}
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

    render(html`<${ShipAndPay} products=${products} cart=${cart} />`,
        document.getElementById('content'))
}
