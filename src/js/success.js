import { html } from 'htm/preact'
import { render } from 'preact'

function Success (props) {
    return html`<div>fooooo</div>`
}

render(html`<${Success} />`, document.getElementById('content'))
