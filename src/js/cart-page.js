import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'
import util from './util'
import EVENTS from '@nichoth/shopping-cart/src/EVENTS'

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

cart.on(EVENTS.cart.remove, function (i) {
    renderTotals(document.getElementById('cart-totals'), cart)
    renderControls(document.querySelector('.cart-controls'), cart)
})

function renderTotals (el, cart) {
    // var el = document.getElementById('cart-totals')
    el.innerHTML = ''
    if (cart.products().length === 0) return
    var subTotal = cart.products().reduce(function (acc, { price }) {
        return acc + price
    }, 0)
    function getShipping (l) {
        if (l === 0) return 0
        if (l === 1) return 3
        if (l === 2) return 4
        if (l >= 3 && l <= 8) return 5
        if (l > 8) return 6
    }

    // cart.state(function onChange (state) {
    //     // re-render the stuff
    // })

    // var ship = makeDiv('shipping $0')
    el.appendChild(makeDiv('subtotal $' + subTotal))
    var shippingCost = getShipping(cart.products().length)
    el.appendChild(makeDiv('shipping $' + shippingCost))
    el.appendChild(makeDiv('total $' + (subTotal + shippingCost)))
}

function makeDiv (text) {
    var div = document.createElement('div')
    div.appendChild(document.createTextNode(text))
    return div
}

function renderControls (el, cart) {
    console.log('length', cart.products().length)
    if (cart.products().length < 1) {
        // remove the link
        var link = el.querySelector('a.buy')
        if (link) return link.remove()
    }

    var link = document.createElement('a')
    link.href = '/buy-things'
    link.classList.add('buy')
    link.appendChild(document.createTextNode('buy things'))
    el.appendChild(link)
}

var el = document.getElementById('cart-totals')
renderTotals(el, cart)
renderControls(document.querySelector('.cart-controls'), cart)
