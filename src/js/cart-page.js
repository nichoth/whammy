import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'
import EVENTS from '@nichoth/shopping-cart/src/EVENTS'
var _ = {
    get: require('lodash/get')
}

var cartContainer = document.getElementById('cart-page-container')
var cart = new Cart({ key: KEY })
cart.createPage(cartContainer, mapper)

// var iconContainer = document.getElementById('cart-icon-container')
// cart.createIcon(iconContainer)

function getImgUrl (item) {
    return item.imageUrl
}

function mapper (html, product, i) {
    console.log('***product***', product)
    var itemData = product.item_data
    var price = _.get(itemData,
        'variations[0].item_variation_data.price_money.amount')
    function Quantity (props) {
        var { item } = props
        if (item.quantity > 1) {
            return html`<input type="number" max=${item.quantity} value=1 />`
        }
        return html`<span class="quantity">Qty 1</span>`
    }

    return html`<span class="item-controls">
        <img src="${getImgUrl(product)}" alt=${product.name} />
        <h2><a href=${product.slug}>${itemData.name}</a></h2>
        <${Quantity} item=${product} />
        <span class="price">$${(price/100).toFixed(2)}</span>
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
    var subTotal = cart.products().reduce(function (acc, prod) {
        var itemData = prod.item_data
        var price = _.get(itemData,
            'variations[0].item_variation_data.price_money.amount')
        return acc + price
    }, 0)
    // subTotal = (subTotal/100).toFixed(2)

    function getShipping (l) {
        if (l === 0) return 0
        if (l === 1) return 300
        if (l === 2) return 400
        if (l >= 3 && l <= 8) return 500
        if (l > 8) return 600
    }

    // @TODO cart.state(function onChange (state) {
    //     // re-render the stuff
    // })

    // var ship = makeDiv('shipping $0')
    el.appendChild(makeDiv('subtotal $' + (subTotal/100).toFixed(2)))
    var shippingCost = getShipping(cart.products().length)
    el.appendChild(makeDiv('shipping $' + (shippingCost/100).toFixed(2)))
    el.appendChild(makeDiv('total $' +
        ((subTotal + shippingCost)/100).toFixed(2)))
}

function makeDiv (text) {
    var div = document.createElement('div')
    div.appendChild(document.createTextNode(text))
    return div
}

function renderControls (el, cart) {
    if (cart.products().length < 1) return

    // var link = document.createElement('a')
    // link.href = '/buy-things'
    // link.classList.add('buy')
    // link.appendChild(document.createTextNode('buy things'))
    // el.appendChild(link)

    var btn = document.createElement('button')
    btn.appendChild(document.createTextNode('buy things'))
    btn.classList.add('buy')
    el.appendChild(btn)
    btn.addEventListener('click', function (ev) {
        ev.preventDefault()
        console.log('click')

        var products = cart.products().map(prod => {
            console.log('prod', prod)
            return prod
        })

        var ids = products.map(function (prod) {
            return prod.item_data.variations[0].id
        })

        console.log('ids', ids)

        fetch('/.netlify/functions/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                catalog_object_ids: ids,
                foo: 'bar'
            })
        })
            .then(res => {
                return res.json().then(function (r) {
                    console.log('***res***', r)
                    window.checkout = r
                    return r
                })
            })
            .catch((err) => console.error('errrr', err))
    })
}

var el = document.getElementById('cart-totals')
renderTotals(el, cart)
renderControls(document.querySelector('.cart-controls'), cart)
