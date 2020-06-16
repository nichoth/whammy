
var cms = window.CMS

console.log('cms', cms)

CMS.registerEventListener({
    name: 'prePublish',
    handler: function ({ author, entry }) {
        var str = JSON.stringify({
            author,
            data: entry.get('data')
        })
        console.log('prepublish', str)
    }
});
