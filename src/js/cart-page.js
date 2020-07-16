import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'
import util from './util'

var cartContainer = document.getElementById('cart-page-container')
var cart = new Cart({ key: KEY })
cart.createPage(cartContainer, mapper)

var iconContainer = document.getElementById('cart-icon-container')
cart.createIcon(iconContainer)

function mapper (html, product, i) {
    console.log('in map', product, i)
    return html`
        <span>
            <img src="${util.getImgUrl(product)}" alt=${product.name} />
            product: ${product.name || 'no name'}
        </span>
    `
}
