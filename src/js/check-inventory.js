function checkInventory (cart) {
    if (cart.products().length === 0) return Promise.resolve(true)

    return fetch('/.netlify/functions/check-inventory', {
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
            var allInStock = res.reduce(function (acc, count) {
                return (acc && count.quantity > 0)
            }, true)
            if (!allInStock) cart.ohno()
            return allInStock
        })
}

export default checkInventory
