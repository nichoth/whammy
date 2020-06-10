import { handleFormSubmission } from './stripe-purchase.js';

function createProductFromTemplate (item) {
    const template = document.querySelector('#product');
    const product = template.content.cloneNode(true);

    product.querySelector('h2').innerText = item.name;
    product.querySelector('.description').innerText = item.description;
    product.querySelector('[name=sku]').value = item.id;
    product.querySelector('.price').innerText = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format((item.amount / 100).toFixed(2));

    const img = product.querySelector('img');
    img.src = item.images[0];
    img.alt = item.name;

    const form = product.querySelector('form');
    form.addEventListener('submit', handleFormSubmission);

    return product;
}

export async function loadProducts() {
  const res = await fetch('/.netlify/functions/get-products')
      .then((res) => res.json())
      .catch((err) => console.error(err));

      const container = document.querySelector('.products');

      console.log('products', res.products)
      res.products.forEach((item) => {
          const product = createProductFromTemplate(item);
          container.appendChild(product);
      });
}

loadProducts()

