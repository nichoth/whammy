import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'
import { countBy } from 'lodash'
var _ = {
    get: require('lodash/get')
}
var slugify = require('@sindresorhus/slugify')

function createProductFromTemplate (item) {
    var itemData = item.item_data
    const template = document.querySelector('#product');
    const product = template.content.cloneNode(true);

    var textLink = product.querySelector('.text-link')
    textLink.href = `/${slugify(itemData.name)}`
    product.querySelector('h2').innerText = itemData.name;
    product.querySelector('.description').innerText = itemData.description;

    var price = _.get(itemData,
        'variations[0].item_variation_data.price_money.amount')
    // console.log('price', price)
    product.querySelector('.price').innerText = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format((price/100 || 0).toFixed(2));

    // @TODO add product id in hidden field

    var a = product.querySelector('a')
    // a.href = `/${item.id}`
    a.href = `/${slugify(itemData.name)}`

    const img = product.querySelector('img');
    var src = item.imageUrl
    img.src = src
    img.alt = itemData.name

    return product;
}

export async function loadProducts() {
    var { products,
        images,
        tax } = await fetch('/.netlify/functions/get-products')
        .then(res => res.json())
        .catch(err => console.log('errrrororor', err))

    console.log('cat list', products, images, tax)

    const container = document.querySelector('.products');

    if (!products) return
    products
        // for some reason we don't display products with no variations
        .filter(prod => prod.item_data.variations)
        .forEach(function (product) {
            var content = createProductFromTemplate(product)
            container.appendChild(content)
        })
}

loadProducts()

// start the cart
var cart = new Cart({ key: KEY })
var cartContainer = document.getElementById('cart-icon-container')
cart.createIcon(cartContainer, { link: '/cart' })

window.cart = cart

// check inventory
// fetch inventory for the cart items, and if necessary call cart.ohno
fetch('/.netlify/functions/check-inventory', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        products: cart.products()
    })
})
    .then(res => res.json())
    .then(res => {
        console.log('**inventory**', res)
        var hasStock = res.reduce(function (acc, count) {
            return (acc && count.quantity > 0)
        }, true)
        console.log('has stock', hasStock)
        if (!hasStock) cart.ohno()
    })
    .catch(err => {
        return console.log('errrr', err)
    })


