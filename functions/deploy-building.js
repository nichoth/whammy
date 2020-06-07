exports.handler = function (ev, ctx, cb) {
    console.log('woo triggered function', ev)
    console.log('------------body------------------')
    console.log(JSON.parse(ev.body))

    console.log('ctxvtxvtxvtxctxctxctx:::::::::::')
    console.log(ctx)
    cb(null)
}

