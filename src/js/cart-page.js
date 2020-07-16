import Cart from '@nichoth/shopping-cart'

var cartContainer = document.getElementById('cart-page-container')
var cart = new Cart()
cart.createPage(cartContainer, mapper)

function mapper (html, product, i) {
    console.log('in map', product, i)
    return html`<li>product: ${product.name}<//>`
}
