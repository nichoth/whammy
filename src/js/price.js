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
    var totQuantity = products.reduce(function (acc, prod) {
        return acc + parseInt(prod.quantity || 0)
    }, 0)
    if (totQuantity === 0) return 0
    if (totQuantity === 1) return 300
    if (totQuantity === 2) return 400
    if (totQuantity >= 3 && totQuantity <= 8) return 500
    if (totQuantity > 8) return 600
}

function total (order) {
    return order.total_money.amount
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
