import Cart from '@nichoth/shopping-cart'
// import { handleFormSubmission } from './stripe-purchase.js';
// var stripeKey = 'pk_test_51GrU9fGmvbUUvDLHCSTZ5S1cvBn6pKJdo4fBrit12yFXcV8igIQ2ACaNGV2SkHXN4jiklVSRkXOkQdpKLfPh3MKo00i1PbHHID'

function createProductFromTemplate (item) {
    // const stripe = Stripe(stripeKey);
    const template = document.querySelector('#product');
    const product = template.content.cloneNode(true);

    product.querySelector('h2').innerText = item.name;
    product.querySelector('.description').innerText = item.description;
    // product.querySelector('[name=sku]').value = item.id;
    // product.querySelector('.price').innerText = item.price;
    product.querySelector('.price').innerText = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format((item.price || 0).toFixed(2));

    var a = product.querySelector('a')
    a.href = `/${item.name}`

    const img = product.querySelector('img');
    // img.src = item.images[0];
    var imgSrc = item.pic.split('/')
    img.src = '/' + imgSrc[1] + '/' + imgSrc[2]
    img.alt = item.name;

    // const form = product.querySelector('form');
    // form.addEventListener('submit', handleFormSubmission);

    // var style = {
    //     base: { color: "#32325d" }
    // }

    // var elements = stripe.elements();
    // var cardEl = product.querySelector('.card-element')
    // var card = elements.create('card', { style });
    // card.mount(cardEl);

    return product;
}

export async function loadProducts() {
    const res = await fetch('/.netlify/functions/get-products')
        .then((res) => res.json())
        .catch((err) => console.error(err));

    const container = document.querySelector('.products');

    console.log('products', res)

    res.map(item => item.data).forEach(function (product) {
        var content = createProductFromTemplate(product)
        container.appendChild(content)
    })
}

loadProducts()

// start the cart
var cartContainer = document.getElementById('cart-container')
var cart = new Cart()
cart.createIcon(cartContainer)
