# JavaScript API

## Using an existing module

In order to use a module (e.g. [bootprint-openapi](https://npmjs.com/package/bootprint-openapi) from javascript, install `bootprint` and the module:

```bash
npm install --save bootprint
npm install --save bootprint-openapi
```

Then run the following javascript:

```js
const { Bootprint } = require('bootprint/index')
const bootprintOpenApi = require('bootprint-openapi')

new Bootprint(bootprintOpenApi)
  .run('http://petstore.swagger.io/v2/swagger.json', 'target')
  .then(console.log, console.error)
```

The directory "target" should now contain a file `index.html` and `main.css` which contain a readable
form of the [Swagger-Petstore-Example](http://petstore.swagger.io/).

## Merging configurations

Consider th following file-hierarchy:

<pre><code>
├── content.yaml
├── example.js
├─┬ less/
│ └── main.less
├─┬ partials/
│ ├── body.html.hbs
│ └── footer.html.hbs
├─┬ target/
│ ├── index.html
│ ├── main.css
│ └── main.css.map
└─┬ templates/
  └── index.html.hbs
</code></pre>

The following code demonstrates the usage of the `.merge`-function without loading any module:

```js
const { Bootprint } = require('bootprint/index')

new Bootprint(a => a, {
  handlebars: {
    templates: 'templates',
    partials: 'partials'
  },
  less: {
    main: 'less/main.less'
  }
})
  .run('content.yaml', 'target')
  .then(console.log)
```

This will generate the output:

```
[ 'target/index.html', 'target/main.css', 'target/main.css.map' ]
```

The output shows the list of generated files. This is useful for post-processors.
For example, the output files could be run through a combiner-tool like [inline-html](https://npmjs.com/package/inline-html) to
generate a single self-contained file.

## More examples:

The [bootprint-examples](https://github.com/nknapp/bootprint-examples) repository contains some more examples
of adaptions of the existing configuration-modules `bootprint-swagger` and `bootprint-jsons-schema`.
Go ahead, have a look!


