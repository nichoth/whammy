import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'
import util from './util'

var cartContainer = document.getElementById('cart-page-container')
var cart = new Cart({ key: KEY })
cart.createPage(cartContainer, mapper)

// var iconContainer = document.getElementById('cart-icon-container')
// cart.createIcon(iconContainer)

function mapper (html, product, i) {
    console.log('in map', product, i)

    function Quantity (props) {
        var { item } = props
        if (item.quantity > 1) {
            return html`<input type="number" max=${item.quantity} value=1 />`
        }
        return html`<span class="quantity">Qty 1</span>`
    }

    return html`<span class="item-controls">
        <img src="${util.getImgUrl(product)}" alt=${product.name} />
        <h2><a href=${product.slug}>${product.name}</a></h2>
        <${Quantity} item=${product} />
        <span class="price">$${product.price}</span>
    </span>`
}

var el = document.getElementById('cart-totals')
var subTotal = cart.products().reduce(function (acc, { price }) {
    return acc + price
}, 0)
// var ship = makeDiv('shipping $0')
el.appendChild(makeDiv('subtotal $' + subTotal))
// el.appendChild(ship)
// el.appendChild(makeDiv('total $' + subTotal))

function makeDiv (text) {
    var div = document.createElement('div')
    div.appendChild(document.createTextNode(text))
    return div
}
