// import { addToCart } from './add-to-cart.js';
var stripeKey = 'pk_test_51GrU9fGmvbUUvDLHCSTZ5S1cvBn6pKJdo4fBrit12yFXcV8igIQ2ACaNGV2SkHXN4jiklVSRkXOkQdpKLfPh3MKo00i1PbHHID'
// const stripe = Stripe(stripeKey);
import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'

function createSingleProduct (item) {
    const template = document.querySelector('#single-product');
    const product = template.content.cloneNode(true);

    // todo -- put content in the template
    product.querySelector('h2').innerText = item.name;
    product.querySelector('.description').innerText = item.description;
    // product.querySelector('[name=sku]').value = item.id;
    // product.querySelector('.price').innerText = item.price;
    product.querySelector('.price').innerText = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format((item.price || 0).toFixed(2));

    console.log('item', item)
    const img = product.querySelector('img');
    var imgSrc = item.pic.split('/')
    img.src = '/' + imgSrc[1] + '/' + imgSrc[2]
    img.alt = item.name;

    // var style = {
    //     base: { color: "#32325d" }
    // }
    // var elements = stripe.elements();
    // var cardEl = product.querySelector('#card-element')
    // var card = elements.create('card', { style });
    // card.mount(cardEl);

    var cartContainer = document.getElementById('cart-icon-container')
    var cart = new Cart({ key: KEY })
    cart.createIcon(cartContainer, { link: '/cart' })

    var inCart = cart.products().find(({ slug }) => slug === item.slug)

    const form = product.querySelector('form');
    form.addEventListener('submit', function (ev) {
        ev.preventDefault()
        console.log('submit/add', ev, item)
        if (!inCart) return cart.add(item)
    })

    if (inCart) {
        var link = document.createElement('a')
        link.setAttribute('href', '/cart')
        link.setAttribute('class', 'view-cart')
        link.textContent = 'View cart'
        form.replaceWith(link)
    }

    return product
}

async function loadSingleProduct (slug) {
    const res = await fetch('/.netlify/functions/get-single-product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slug })
    })
        .then((res) => res.json())
        .catch((err) => console.error('errrr', err));

    console.log('woooooo', res)

    var container = document.querySelector('.single-product-container')
    var content = createSingleProduct(res)
    container.appendChild(content)
}

var href = window.location.href
var segments = href.split('/')
var path = segments[3]
loadSingleProduct(path)

