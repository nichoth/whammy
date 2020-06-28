// import netlifyIdentity from "netlify-identity-widget"
var cms = window.CMS

console.log('cms', cms)

// console.log('current user', netlifyIdentity.currentUser())
// console.log('id', netlifyIdentity)
console.log('ident', window.netlifyIdentity)
    // window.netlifyIdentity.currentUser())

var accessToken

window.netlifyIdentity.on('init', user => {
    console.log('uussseerrr', user)
    if (user && (user || {}).token) {
        console.log('token', user.token)
        console.log('access token', user.token.access_token)
        accessToken = user.token.access_token
    }
    console.log('current user', netlifyIdentity.currentUser())
    if (!user) {
        window.netlifyIdentity.on("login", () => {
            document.location.href = "/admin/";
        });
    }
});


// cms.registerEventListener({
//     name: 'preSave',
//     handler: function (opts) {
//         console.log('presave', opts)
//     }
// })

// this event works somehow
cms.registerEventListener({
    name: 'preUnpublish',
    handler: function ({ author, entry }) {
        console.log('preUnpublish', entry.toJS())
        // TODO -- del from fauna here
    }
})


cms.registerEventListener({
    name: 'prePublish',
    handler: async function (opts) {
        var { author, entry } = opts
        var str = JSON.stringify({
            author,
            data: entry.get('data')
        })

        console.log('prePublish', entry.toJS())
        console.log('slug', entry.get('slug'))

        // var token
        // if (netlifyIdentity.currentUser()) {
        //     netlifyIdentity.currentUser().jwt().then((_token) => {
        //         console.log('in here', _token)
        //         token = _token
        //     })
        // }

        const res = await fetch('/.netlify/functions/create-product', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: str
        })
            .then((res) => res.json())
            .catch((err) => console.error('errrrrrr', err));
        
        console.log('res', res)
    }
});
