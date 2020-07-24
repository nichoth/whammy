var test = require('tape')
import Buy from '../src/js/buy'

test('`buy` page', function (t) {
    // @TODO test sending a payment request

    // @TODO learn how to put values into the card
    var { onSubmit, makePayment, card } = Buy()
    t.ok(document.getElementById('buy-forms'))
    // var { onSubmit } = window.buy
    onSubmit({ shipping: null }, mockPayment)
    t.ok(document.getElementById('waiting'), 'should show the waiting screen')
    function mockPayment (opts, cb) {
        // payment happens here, then cb
        setTimeout(() => {
            cb(null)
            t.notOk(document.getElementById('buy-form'),
                'waiting screen should go away')
            t.end()
        }, 0)
    }
})
