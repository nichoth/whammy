import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'
import EVENTS from '@nichoth/shopping-cart/src/EVENTS'
var slugify = require('@sindresorhus/slugify')
var _ = {
    get: require('lodash/get')
}
var price = require('./price')
import checkInventory from './check-inventory'

var cartContainer = document.getElementById('cart-page-container')
var cart = new Cart({ key: KEY })
cart.createPage(cartContainer, mapper)
window.cart = cart

function getImgUrl (item) {
    return item.imageUrl
}

var inventory
checkInventory(cart)
    .then(({ allInStock, inventory: _inventory }) => {
        console.log('inventory', _inventory)
        inventory = _inventory
        if (allInStock) return

        cart.createPage(cartContainer, mapper)
        renderControls(document.querySelector('.cart-controls'), cart,
            allInStock)
    })
    .catch(err => {
        console.log('err', err)
    })

function mapper (html, product, i) {
    var oos
    if (inventory) {
        var inv = inventory.find(_inv => (_inv.catalog_object_id ===
            product.item_data.variations[0].id))
        oos = inv.quantity <= 0
        console.log('oos', oos)
    }

    var itemData = product.item_data
    var price = _.get(itemData,
        'variations[0].item_variation_data.price_money.amount')
    price = (price * (product.quantity || 0))

    function Quantity (props) {
        var { item } = props
        console.log('**item***', item)
        if (inventory) {
            var inv = inventory.find(_inv => (_inv.catalog_object_id ===
                product.item_data.variations[0].id))
            if (inv.quantity > 1) {
                return html`<span>Qty: <input type="number"
                    min=1
                    max=${inv.quantity}
                    value=${item.quantity || 1}
                    onChange=${ev => {
                        cart.changeQuantity(i, ev.target.value)
                    }}
                /> of ${inv.quantity}</span>`
            }
            return html`<span class="quantity">Qty: 1 of ${inv.quantity}</span>`
        }
        return html`<span class="quantity">Qty: 1</span>`
    }

    return html`${oos ? html`<div class="ohno-stock">out of stock</div>` : ''}
        <span class="item-controls ${oos ? 'out-of-stock' : ''}">
            <img src="${getImgUrl(product)}" alt=${product.name} />
            <h2><a href=${slugify(itemData.name)}>${itemData.name}</a></h2>
            <${Quantity} item=${product} />
            <span class="price"> $${(price/100).toFixed(2)}</span>
        </span>
    `
}

cart.on(EVENTS.cart.remove, function (i) {
    renderTotals(document.getElementById('cart-totals'), cart)
    renderControls(document.querySelector('.cart-controls'), cart)
})

cart.on(EVENTS.quantity.change, ev => {
    renderTotals(document.getElementById('cart-totals'), cart)
})

function renderTotals (el, cart) {
    el.innerHTML = ''
    if (cart.products().length === 0) return
    var subTotal = cart.products().reduce(function (acc, prod) {
        var itemData = prod.item_data
        var price = _.get(itemData,
            'variations[0].item_variation_data.price_money.amount')
        return acc + (price * prod.quantity || 0)
    }, 0)

    el.appendChild(makeDiv('subtotal $' + (subTotal/100).toFixed(2)))
    var shippingCost = price.shipping(cart.products())
    el.appendChild(makeDiv('shipping $' + (shippingCost/100).toFixed(2)))
    el.appendChild(makeDiv('total $' +
        ((subTotal + shippingCost)/100).toFixed(2)))
    el.appendChild(makeDiv('+ tax'))
}

function makeDiv (text) {
    var div = document.createElement('div')
    div.appendChild(document.createTextNode(text))
    return div
}

function renderControls (el, cart, allInStock) {
    var _link = document.querySelector('.buy')
    if (_link) _link.remove()
    if (cart.products().length < 1) return

    var link = document.createElement('a')
    if (allInStock !== false) {
        link.href = '/buy-things'
    }
    if (allInStock === false) {
        link.classList.add('disabled')
    }
    link.classList.add('buy')
    link.appendChild(document.createTextNode('buy things'))
    el.appendChild(link)
}

var el = document.getElementById('cart-totals')
renderTotals(el, cart)
renderControls(document.querySelector('.cart-controls'), cart)
