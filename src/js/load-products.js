// const SquareConnect = require("square-connect")
import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'
import util from './util'

// const config = require("./config.json").sandbox;

// const {
//     catalogApi,
//     locationApi,
//     orderApi,
//   } = require("../util/square-connect-client");

function createProductFromTemplate (item) {
    // const stripe = Stripe(stripeKey);
    const template = document.querySelector('#product');
    const product = template.content.cloneNode(true);

    var textLink = product.querySelector('.text-link')
    textLink.href = `/${item.slug}`
    product.querySelector('h2').innerText = item.name;
    product.querySelector('.description').innerText = item.description;
    // product.querySelector('[name=sku]').value = item.id;
    // product.querySelector('.price').innerText = item.price;
    product.querySelector('.price').innerText = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format((item.price || 0).toFixed(2));

    var a = product.querySelector('a')
    a.href = `/${item.slug}`

    const img = product.querySelector('img');
    var src = util.getImgUrl(item)
    img.src = src
    img.alt = item.name
    // img.src = item.images[0];
    // var imgSrc = item.pic.split('/')
    // img.src = '/' + imgSrc[1] + '/' + imgSrc[2]

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
    // here, get from square
    // const opts = { types: "ITEM,IMAGE" };
    // const catalogList = await catalogApi.listCatalog(opts)
    // console.log('cat list', catalogList)


    var catalogList = await fetch('/.netlify/functions/get-products')
        .then(res => res.json())
    console.log('cat list', catalogList)


    // const res = await fetch('/.netlify/functions/get-products')
    //     .then((res) => res.json())
    //     .catch((err) => console.error(err));

    const container = document.querySelector('.products');

    // console.log('products with no stock', catalogList.filter(prod => {
    //     return (prod.quantity <= 0)
    // }))

    // res.map(item => item.data).forEach(function (product) {
    //     var content = createProductFromTemplate(product)
    //     container.appendChild(content)
    // })
}

loadProducts()

// start the cart
var cartContainer = document.getElementById('cart-icon-container')
var cart = new Cart({ key: KEY })
cart.createIcon(cartContainer, { link: '/cart' })
