// var stripeKey = 'pk_test_51GrU9fGmvbUUvDLHCSTZ5S1cvBn6pKJdo4fBrit12yFXcV8igIQ2ACaNGV2SkHXN4jiklVSRkXOkQdpKLfPh3MKo00i1PbHHID'
// const stripe = Stripe(stripeKey);
import Cart from '@nichoth/shopping-cart'
import KEY from './KEY'


function createSingleProduct (item) {
    console.log('item', item)
    const template = document.querySelector('#single-product');
    const product = template.content.cloneNode(true);

    product.querySelector('h2').innerText = item.name;
    product.querySelector('.description').innerText = item.description;
    // product.querySelector('[name=sku]').value = item.id;
    product.querySelector('.price').innerText = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format((item.price || 0).toFixed(2));

    const img = product.querySelector('img');
    var imgSrc = item.pic.split('/')
    img.src = '/' + imgSrc[1] + '/' + imgSrc[2]
    img.alt = item.name;

    var cartContainer = document.getElementById('cart-icon-container')
    var cart = new Cart({ key: KEY })
    cart.createIcon(cartContainer, { link: '/cart' })

    var inCart = cart.products().find(({ slug }) => slug === item.slug)

    const form = product.querySelector('form');
    form.addEventListener('submit', function (ev) {
        ev.preventDefault()
        console.log('submit/add', ev, item)
        if (!inCart) cart.add(item)
        window.location.href = '/cart'
    })

    // ----------- the link version ---------------
    // var btn = product.querySelector('.add-to-cart')
    // btn.addEventListener('click', function (ev) {
    //     console.log('click', ev)
    //     if (!inCart) return cart.add(item)
    // })
    // ---------------------------------------------

    if (item.quantity < 1) {
        var div = document.createElement('div')
        div.innerText = 'Sold out'
        form.replaceWith(div)
    }
    if (inCart) {
        var link = document.createElement('a')
        link.setAttribute('href', '/cart')
        link.classList.add('view-cart')
        link.textContent = 'View cart'
        form.replaceWith(link)
    }

    return product
}

async function loadSingleProduct (id) {
    // const res = await fetch('/.netlify/functions/get-single-product', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ slug })
    // })
    //     .then((res) => res.json())
    //     .catch((err) => console.error('errrr', err));

    // console.log('get single response', res)

    // var container = document.querySelector('.single-product-container')
    // var content = createSingleProduct(res)
    // container.appendChild(content)

    // var opts = { 'includeRelatedObjects': true }

    const res = await fetch('/.netlify/functions/get-single-product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
        .then((res) => res.json())
        .catch((err) => console.error('errrr', err));

    console.log('response', res)

    // apiInstance.retrieveCatalogObject(id, opts).then(function (data) {
    //     console.log('API called successfully. Returned data: ' + data);
    // }, function (error) {
    //     console.error(error);
    // })
}

var href = window.location.href
var segments = href.split('/')
var id = segments[3]
loadSingleProduct(id)
