# whammy demo
`src/js/create` -> `functions/todos-create.js` -> faunaDB

* [Triggering deploys through webhooks and markdown magic](https://www.netlify.com/blog/2017/07/06/triggering-deploys-through-webhooks-and-markdown-magic/)
* [Building Serverless CRUD apps with Netlify Functions & FaunaDB](https://www.netlify.com/blog/2018/07/09/building-serverless-crud-apps-with-netlify-functions-faunadb/) -- good intro to faunaDB + netlify. A todo app, shows normal CRUD operations. The basis for this repo.
* [e-commerce tutorial](https://docs.fauna.com/fauna/current/tutorials/ecommerce.html) -- crud functions to order things. Track stock, but does not show an example of payments. [github](https://github.com/nichoth/fauna-netlify)
* [Learn How to Accept Money on Jamstack Sites in 38 Minutes](https://www.netlify.com/blog/2020/04/13/learn-how-to-accept-money-on-jamstack-sites-in-38-minutes/?utm_source=blog&utm_medium=stripe-jl&utm_campaign=devex) -- call the stripe API from a netlify function. Not fauna/CRUD related. [github](https://github.com/nichoth/buying-things)
* [Create A Bookmarking Application With FaunaDB, Netlify And 11ty](https://www.smashingmagazine.com/2019/10/bookmarking-application-faunadb-netlify-11ty/) -- more crud, 11ty
* [Trigger serverless functions on events](https://docs.netlify.com/functions/trigger-on-events/) -- list of available triggers
* [Build serverless functions with JavaScript](https://docs.netlify.com/functions/build-with-javascript/#format) -- hello worls example. function args
* [Serverless Database CRUD Example](https://nordschool.com/build-a-serverless-database-using-faunadb-and-netlify-functions)
* [FaunaDB Add-on for Netlify](https://docs.fauna.com/fauna/current/integrations/netlify.html) -- `netlify addons:create fauna`
* [Registering to CMS Event](https://www.netlifycms.org/docs/beta-features/#registering-to-cms-events) -- The CMS front end app
* [The Workflow](https://www.netlify.com/products/workflow/) -- staging branch
* [Building a Serverless Comment System with Netlify Functions, Storyblok and Vue.js](https://markus.oberlehner.net/blog/building-a-serverless-comment-system-with-netlify-functions-storyblok-and-vue/) -- tutorial using storyblok CMS
* [Make a headless CMS eCommerce front-end for Vue.js, Nuxt.js and Snipcart](https://www.sanity.io/blog/e-commerce-vue-nuxt-snipcart) -- sanity.io example

--------------------------------

Use an incoming webhook in netlify that is called on push to github
```
update CMS -> push to github -> call netlify/update-fauna
```
A deploy hook

**How to get the ID of the document that was added in the netlify CMS? Would need it in the netlify function to send to faunaDB.**

In the frontend, display things only if they show up in fauna. Need to use the doc's ID to lookup inventory in fauna.

------------------------------------

## "the app"
https://whammy-demo.netlify.app/
https://dashboard.fauna.com/db/whammy-demo -- faunaDB UI

---------------------------

## Set up netlify functions and fauna
Create a faunadb key in the fauna UI, and paste it into netlify as an env variable.

```
FAUNADB_SERVER_SECRET=YourFaunaDBKeyHere
```

## create todos collection
The collection must exist in faunaDB before you operate on it. Create the `todos` collection in the fauna UI.



---------------------------
## hooks
>  To make a function trigger on an event, match the name of the function file to the name of the event. For example, to trigger a function on deploy-succeeded events, name the function file deploy-succeeded.js 

```js
exports.handler = function (event, context, callback) {
    // your server-side functionality
}
```

`deploy-building`-- Triggered when Netlify starts building a site for deployment.

> The request body for these functions is a JSON document that includes information about the associated site, as well as the object that triggered the event. All payloads have this shape:

```js
{
  "payload": {
    # information about the object that triggered the event
  },
  "site": {
    # information about the associated site
  }
}
```

`deploy-succeeded` -> fauna create with ID for each `product` doc

---------------

## Registering to CMS Events
[Registering to CMS Event](shttps://www.netlifycms.org/docs/beta-features/#registering-to-cms-events)

```js
import CMS from 'netlify-cms';
CMS.registerEventListener({
    name: 'postSave',
    handler: ({ author, entry }) => {
        console.log(JSON.stringify({
            author,
            data: entry.get('data') 
        })),
    }
});
```

-----------------------------

[notes on ID field](https://www.netlifycms.org/docs/configuration-options/#identifier_field) -- "title" is default ID. Can use `identifier_field` to choose another:
```
collections:
  - name: posts
    identifier_field: name
```

todo
* test deploy event in nertlify. What is the payload for that? Would be great if we had access to all the files.


------------------------------------

Make the DB the source of truth. Creating a doc in the CMS creates one in the DB. There is nothing linking it to the CMS, but there is a path to the images, which are on netlify.


--------------------------------
`deploy-building`

`ev.body`
`ev.body.payload.published_deploy.title` -- commit msg
`ev.body.payload.published_deploy.commit_url: 'https://github.com/nichoth/whammy-demo/commit/3c1d2f81b03133be4ed059bb62528cc3806ccf18'`
`ev.body.payload.commit_url: commit_url: 'https://github.com/nichoth/whammy-demo/commit/3c1d2f81b03133be4ed059bb62528cc3806ccf18',`
`ev.body.payload.title: 'Create product “vrrrha”'`

When you see something with that commit msg, create a product in fauna with 1 inventory.

```js
{
    title: 'Create product “vhsvhs”',
    commit_url: ''
}
```

Look in `src/uploads` for the image files.
Use the normal git local process for content and image files.


----------------------------------

Hook into the CMS and have it create things in faunaDB. See https://www.netlifycms.org/docs/beta-features/#registering-to-cms-events . 

------------------------------------

Show things in the front-end
* Make a SS function that will get content from netlify CMS and fauna and merge it so that it filters out-of-stock things

-------------------------------------

## cryptography things
* [chloride](https://github.com/dominictarr/chloride)
* [libsodium](https://doc.libsodium.org/)
* [node sodium](https://github.com/paixaop/node-sodium)


## CMS
* https://www.sanity.io/
* https://www.datocms.com/
* https://forestry.io/
* Contentful -- free/10 users, "micro" space
* https://prismic.io/ -- $7/3 users
* netlify CMS -- free -- makes commits to your repo
* [storyblok](https://www.storyblok.com/)

---------------------------------------

The CMS event returns an immutable.js object. Convert to normal JS with `toObject`, `toArray`, and `toJS`.

Get the images from netlify server, path is in `.data` of CMS event:
```
{
    collection: "product",
    data: {
        description: "woo description",
        name: "530 vhs 3",
        pic: "images/uploads/vag-eye.jpg"
    }
}
```

On create a new product
All the data goes into fauna. The pic data is just a path
FE prepublish event -> netlify SS fn -> fauna create -> FE resp

on get products
```
netlify SS fn -> fauna get -> resp
```

todo
* SS function to create products
* SS function to get products
* need to listen for onDelete also
* onEdit also

----------------------------------------------

* need to figure out how to distinguish a delete op from create/update
* how to make sure CMS changes are legitimate?

in client side CMS:
```
data: {
    isModification: null,
    newRecord: true
}
```

--------------------------------
Get the posts and show them in the page

* [retrieve posts docs](https://docs.fauna.com/fauna/current/tutorials/crud.html#retrieve)
* [Create A Bookmarking Application With FaunaDB, Netlify And 11ty](https://www.smashingmagazine.com/2019/10/bookmarking-application-faunadb-netlify-11ty/) -- smashing magazine demo. Paginate method

-------------------------------

* [Learning FQL, Part 1: FaunaDB Schema Objects](https://fauna.com/blog/learning-fql-part-1-faunadb-schema-objects)
* [cookbook/overview](https://docs.fauna.com/fauna/current/cookbook/index.html)

Get a collection
```js
client.query(
  q.Get(q.Collection('spells'))
)
.then((ret) => console.log(ret))
```

Create a document in a collection
```js
client.query(
  q.Create(
    q.Collection('spells'),
    {
      data: {
        name: 'Fire Beak',
        element: ['air', 'fire'],
      },
    },
  )
)
.then((ret) => console.log(ret))
```

## classes
classes = collections
This function is deprecated as of FaunaDB 2.7.0. Use Collections instead.

Create a new product via CMS
* SS function works -- needs params in request
* front end calls the SS function from CMS hook

Use a shopping cart class/collection, ID'd by user
* contains refs to products

An 'order' class
* contains a list of refs to products



