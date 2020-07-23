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
    t.ok(document.getElementById('waiting'))
    function mockPayment (opts, cb) {
        // payment happens here, then cb
        setTimeout(() => {
            t.end()
            cb(null)
        }, 0)
    }
})
