function checkInventory (products) {
    return fetch('/.netlify/functions/check-inventory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            products: products
        })
    })
        .then(res => res.json())
        .then(res => {
            var allInStock = res.reduce(function (acc, count) {
                return (acc && count.quantity > 0)
            }, true)
            return allInStock
        })
}

export default checkInventory
