import { html } from 'htm/preact'
import { render } from 'preact'
const queryString = require('query-string')

function Success (props) {
    return html`<div>fooooo</div>`
}

render(html`<${Success} />`, document.getElementById('content'))

var q = queryString.parse(window.location.search)
console.log('q', q)
