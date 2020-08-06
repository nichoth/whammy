var _ = {
    get: require('lodash/get')
}

function subTotal (products) {
    var subTotal = products.reduce(function (acc, prod) {
        var price = _.get(prod,
            'item_data.variations[0].item_variation_data.price_money.amount')
        return (acc + price)
    }, 0)

    return subTotal
}

function getShippingCost (products) {
    var l = products.length
    if (l === 0) return 0
    if (l === 1) return 300
    if (l === 2) return 400
    if (l >= 3 && l <= 8) return 500
    if (l > 8) return 600
}

function total (products) {
    var sub = subTotal(products)
    var ship = getShippingCost(products)
    var tot = sub + ship
    return tot
}

function format (n) {
    var priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format((n/100).toFixed(2))
    return priceString
}

// export default {
//     subTotal,
//     shipping: getShippingCost,
//     total,
//     format
// }

module.exports = {
    subTotal,
    shipping: getShippingCost,
    total,
    format
}
