import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'

function createProductFromTemplate (item) {
    const template = document.querySelector('#product');
    const product = template.content.cloneNode(true);

    var textLink = product.querySelector('.text-link')
    textLink.href = `/${item.slug}`
    product.querySelector('h2').innerText = item.name;
    product.querySelector('.description').innerText = item.description;
    product.querySelector('.price').innerText = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format((item.price || 0).toFixed(2));
    // @TODO add product id in hidden field

    var a = product.querySelector('a')
    a.href = `/${item.slug}`

    const img = product.querySelector('img');
    var src = item.image_url
    img.src = src
    img.alt = item.name

    return product;
}

export async function loadProducts() {
    var catalogList = await fetch('/.netlify/functions/get-products')
        .then(res => res.json())
        .catch(err => console.log('errrrororor', err))
    console.log('cat list', catalogList)

    const container = document.querySelector('.products');

    catalogList.forEach(function (product) {
        var content = createProductFromTemplate(product)
        container.appendChild(content)
    })
}

loadProducts()

// start the cart
var cartContainer = document.getElementById('cart-icon-container')
var cart = new Cart({ key: KEY })
cart.createIcon(cartContainer, { link: '/cart' })
