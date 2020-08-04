import { html } from 'htm/preact'
import { Component } from 'preact'
import price from './price'
var APP_ID = 'sandbox-sq0idb-SYHgUy2XZm6PJjhsp116Cg'

class Payment extends Component {
    constructor () {
        super()
    }

    componentDidMount () {
        var paymentForm = this.paymentForm = createPaymentForm()
        paymentForm.build();

        var btn = document.getElementById('sq-creditcard')
        btn.addEventListener('click', ev => {
            ev.preventDefault()
            console.log('pay a dollar click')
            paymentForm.requestCardNonce();
        })
    }

    render (props) {
        console.log('in here', props)
        var { products } = props
        var total = price.total(products)

        return html`<div id="form-container">
            <div id="sq-card-number"></div>
            <div class="third" id="sq-expiration-date"></div>
            <div class="third" id="sq-cvv"></div>
            <div class="third" id="sq-postal-code"></div>
            <button id="sq-creditcard" class="button-credit-card">
                pay $${price.format(total)}
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
                    return alert('Encountered errors, check ' +
                        'console for more details')
                }

                console.log('got nonce', arguments)
                alert(`The generated nonce is:\n${nonce}`);

                var doneWaiting = renderWaitingScreen()
                fetch('/.netlify/functions/pay', {
                    method: 'POST',
                    body: JSON.stringify({
                        nonce: nonce,
                        orderId: orderId
                    })
                })
                    .then(res => {
                        console.log('pay res', res)
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
