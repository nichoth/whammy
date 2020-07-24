var test = require('tape')
import Buy from '../src/js/buy'

// need to submit the form
// then check if the waiting screen is there
// then check that it goes away when the request is done

test('`buy` page', function (t) {
    Buy()
    t.ok(document.getElementById('buy-forms'))
    var { onSubmit } = window.buy
    onSubmit(mockPayment)
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