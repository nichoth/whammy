import { html } from 'htm/preact'
import { Component } from 'preact'
var price = require('./price')
var APP_ID = 'sandbox-sq0idb-SYHgUy2XZm6PJjhsp116Cg'

// var hasLoaded = false
var doneWaiting

// test card
// 4111 1111 1111 1111    CVV: 111

var setState

class Payment extends Component {
    constructor () {
        super()
        // this.state.time = Date.now();
        this.state = {}
        this.state.hasLoaded = false
        var self = this
        setState = function (obj) {
            self.setState(obj)
        }
    }

    componentDidUpdate (prevProps) {
        var { orderID } = this.props
        if (!orderID) return
        if (prevProps.orderID) return
        var paymentForm = this.paymentForm = createPaymentForm(orderID)
        paymentForm.build();

        // var btn = document.getElementById('sq-creditcard')
        // btn.addEventListener('click', ev => {
        //     doneWaiting = renderWaitingScreen()
        //     ev.preventDefault()
        //     console.log('payment click', orderID)
        //     paymentForm.requestCardNonce();
        // })
    }

    render (props) {
        var { products, orderID } = props
        var total = price.total(products, orderID)
        console.log('in render order id', props.orderID)

        return html`<div id="form-container">
            <div id="sq-card-number"></div>
            <div class="third" id="sq-expiration-date"></div>
            <div class="third" id="sq-cvv"></div>
            <div class="third" id="sq-postal-code"></div>
            <button id="sq-creditcard" class="button-credit-card"
                disabled=${!this.state.hasLoaded}
                onclick=${ev => {
                    ev.preventDefault()
                    doneWaiting = renderWaitingScreen()
                    this.paymentForm.requestCardNonce()
                    console.log('payment click', orderID)
                }}
            >
                pay ${price.format(total)}
            </button>
        </div>`
    }
}

export default Payment


function renderWaitingScreen () {
    var el = document.getElementById('waiting')
    el.style.display = 'block'
    document.body.classList.add('waiting')

    function doneWaiting () {
        // document.body.removeChild(el)
        el.style.display = 'none'
        document.body.classList.remove('waiting')
    }

    return doneWaiting
}

function renderError (err) {
    var el = document.createElement('div')
    el.classList.add('error-message')
    var msg = document.createElement('pre')
    msg.classList.add('message')
    if (err.code) {
        msg.appendChild(document.createTextNode(
            `ERROR:
            ${err.code}
            ${err.decline_code}
            ${err.doc_url}`
        ))
    }
    el.appendChild(msg)
    document.body.appendChild(el)
    function remove () {
        document.body.removeChild(el)
    }
    return remove
}

window.renderError = renderError
window.renderWaitingScreen = renderWaitingScreen

function createPaymentForm (orderId) {
    return new SqPaymentForm({
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
                setState({ hasLoaded: true })
            },

            /*
            * callback function: cardNonceResponseReceived
            * Triggered when: SqPaymentForm completes a card nonce request
            */
            cardNonceResponseReceived: function (errors, nonce, cardData) {
                // TODO -- in here, call netlify/pay with the nonce, which
                // calls payments_api.createPayment
                // https://developer.squareup.com/docs/payment-form/payment-form-walkthrough#22-configure-the-backend-with-your-access-token
                if (errors) {
                    console.error('Encountered errors:')
                    errors.forEach(function (error) {
                        console.error('  ' + error.message);
                    })
                    doneWaiting()
                    return alert('Encountered errors, check ' +
                        'console for more details')
                }

                console.log('got nonce', arguments)
                alert(`The generated nonce is:\n${nonce}`);

                fetch('/.netlify/functions/pay', {
                    method: 'POST',
                    body: JSON.stringify({
                        nonce: nonce,
                        // in here, this is null and it's not supposed to be
                        orderId: orderId
                    })
                })
                    .then(res => {
                        console.log('pay res', res)
                        res.json().then(r => console.log('json', r))
                        doneWaiting()
                    })
                    .catch(err => {
                        console.log('pay err', err)
                        doneWaiting()
                    })
            }
        }
    })
}
