var test = require('tape')
import Buy from '../src/js/buy'

test('`buy` page', function (t) {
    // @TODO test sending a payment request

    // @TODO learn how to put values into the card element
    // call the real `makePayment` function
    var { onSubmit, makePayment, card } = Buy()
    t.ok(document.getElementById('buy-forms'))
    // var { onSubmit } = window.buy
    onSubmit({ shipping: null }, mockPayment)
    t.ok(document.getElementById('waiting'), 'should show the waiting screen')
    
    function mockPayment (opts, cb) {
        // payment happens here, then cb
        setTimeout(() => {
            cb(null)
            t.equal(document.getElementById('waiting').style.display, 'none',
                'should not display waiting element')
            t.end()
        }, 0)
    }

    // TODO
    // makePayment({ shipping, card }, function (err, res) {

    // })
})
