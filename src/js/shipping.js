import { Component } from 'preact'
import { html } from 'htm/preact';

class Shipping extends Component {
    ref = null;
    setRef = (dom) => this.ref = dom;

    render () {
        function blurred (ev) {
            console.log('blurred', ev.target, ev)
            var input = ev.target
            input.classList.add('has-focused')
        }

        function handleInput (ev) {

        }

        return html`<form>
            <div id="shipping">
                <h2>Shipping address</h2>
                <div class="form-group">
                    <input type="text" name="name" id="name"
                        placeholder="Gob" required onBlur=${blurred}
                        onInput=${handleInput}
                    />
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
}

export default Shipping
