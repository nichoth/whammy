import netlifyIdentity from "netlify-identity-widget"
var cms = window.CMS

console.log('cms', cms)

CMS.registerEventListener({
    name: 'prePublish',
    handler: async function ({ author, entry }) {
        var str = JSON.stringify({
            author,
            data: entry.get('data')
        })

        console.log('prepublish', str)

        var token
        console.log('current user', netlifyIdentity.currentUser())
        console.log('id', netlifyIdentity)
        if (netlifyIdentity.currentUser()) {
            netlifyIdentity.currentUser().jwt().then((_token) => {
                token = _token
                console.log('in here', _token)
            })
        }

        const res = await fetch('/.netlify/functions/create-product', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: str
        })
            .then((res) => res.json())
            .catch((err) => console.error('errrrrrr', err));
        
        console.log('res', res)
    }
});
