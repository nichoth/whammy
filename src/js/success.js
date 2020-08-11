var price = require('./price')
import { html } from 'htm/preact'
import { render } from 'preact'
import { useEffect, useState } from 'preact/hooks'
const queryString = require('query-string')

var qs = queryString.parse(window.location.search)
var { order_id } = qs

function Success (props) {
    var { orderId } = props
    var [order, setOrder] = useState(null)

    useEffect(() => {
        // document.title = props.title;
        fetch('/.netlify/functions/get-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "order_ids": [ orderId ]
            })
        })
            .then(res => res.json())
            .then(res => {
                console.log('res', res)
                setOrder(res)
            })
            .catch(err => console.log('oh no', err))
    }, [props.orderId])

    console.log('props and state', props, order)

    if (!order) return null

    return html`<ul class="receipt">
        ${order.line_items.map(item => {
            return html`<li><span>${item.name}</span> <span>${price.format(
            item.base_price_money.amount)}</span></li>`
        })}
    </ul>`
}

render(html`<${Success} orderId=${order_id} />`,
    document.getElementById('content'))

