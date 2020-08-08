import { Component } from 'preact'
import { html } from 'htm/preact';

function formIsValid (inputs) {
    return Array.prototype.reduce.call(inputs, (acc, input) => {
        return acc && input.validity.valid
    }, true)
}

class Shipping extends Component {
    ref = null;
    setRef = (dom) => this.ref = dom;

    componentWillUnmount () {
        // use this hook to send the shipping state to the parent
        var inputs = this.ref.querySelectorAll('input')
        var shipping = Array.prototype.reduce.call(inputs, (acc, input) => {
            console.log('value', input.value)
            acc[input['name']] = input.value
            return acc
        }, {})
        this.props.onGotShipping(shipping)
    }

    componentDidMount () {
        if (!this.ref) return
        var isValid = false
        var inputs = this.ref.querySelectorAll('input')

        Array.prototype.forEach.call(inputs, function (input) {
            input.addEventListener('input', handleInput)
        })

        var self = this
        function handleInput (ev) {
            var _isValid = formIsValid(inputs)
            if (_isValid !== isValid) {
                self.props.onValidityChange(_isValid)
                isValid = _isValid
            }
        }
    }

    render (props) {
        function blurred (ev) {
            var input = ev.target
            input.classList.add('has-focused')
        }

        return html`<form ref=${this.setRef}>
            <div id="shipping">
                <h2>Shipping address</h2>
                <div class="form-group">
                    <input type="text" name="name" id="name"
                        placeholder="Gob" required onBlur=${blurred}
                    />
                    <label for="name">name</label>
                </div>
                <div class="form-group">
                    <input type="email" name="email" id="email"
                        placeholder="email@example.com" required
                        onBlur=${blurred}
                    />
                    <label for="email">e-mail</label>
                </div>

                <div class="form-group">
                    <input type="text" id="address" name="address"
                        placeholder="123 Streetname" required
                        onBlur=${blurred} />
                    <label for="address">address</label>
                </div>

                <div class="form-group">
                    <input type="text" id="city" name="city"
                        placeholder="Los Angeles" required
                        onBlur=${blurred} />
                    <label for="city">city</label>
                </div>

                <div class="form-group">
                    <input type="text" id="state" name="state"
                        placeholder="CA" required onBlur=${blurred} />
                    <label for="state">state</label>
                </div>

                <div class="form-group">
                    <input type="text" id="zip-code" name="zip-code"
                        placeholder="12345" required inputmode="numeric"
                        pattern="[0-9]*" onBlur=${blurred} />
                    <label for="zip-code">zip code</label>
                </div>
            </div>
        </form>`
    }
}

export default Shipping