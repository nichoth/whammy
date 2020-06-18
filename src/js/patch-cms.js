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

        // var user 
        var token
        if (netlifyIdentity.currentUser()) {
            netlifyIdentity.currentUser().jwt().then((_token) => {
                token = _token
                // user = { Authorization: `Bearer ${token}` };
            })
        }

        const res = await fetch('/.netlify/functions/create-product', {
            method: 'POST',
            headers: {
                // ...user,
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
