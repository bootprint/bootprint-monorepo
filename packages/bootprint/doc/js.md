# JavaScript API 

## Using an existing module

In order to use a module (e.g. [bootprint-swagger](https://npmjs.com/package/bootprint-swagger) from javascript, install `bootprint` and the module:  

```bash
npm install --save bootprint
npm install --save bootprint-swagger
```

Then run the following javascript:

```js
var bootprint = require('bootprint')
   .load(require('bootprint-swagger'))
   .merge({ /* Any other configuration */ })
   .build('http://petstore.swagger.io/v2/swagger.json','target')
   .generate()
   .done(console.log);
```

The directory "target" should now contain a file `index.html` and `main.css` which contain a readable
form of the [Swagger-Petstore-Example](http://petstore.swagger.io/).

## En detail...

`bootprint` currently does **not** support browsers. The JavaScript API can only be accessed in 
a node-like environment. In order to do that, you need to have the `bootprint`-module 
and a template module installed locally.


* `require("bootprint")` returns an preconfigured [customize](https://npmjs.com/package/customize) instance) that 
  provides methods to load and override configuration options in a defined way.
  The object is designed to be immutable: Methods that modify the configuration always 
  return a new instance of `customize`.
* The [load function](api.md#loadconfigurationmodulefunctioncustomizecustomizecustomizecustomize) loads a template-module based on the
  current configuration. The method returns a new BootprintBuilder.
* The [merge function](api.md#mergeconfigurationobject-customize) overrides options from the current
  configuration with values from an explicit configuration object.
  See [the configuration reference](config.md) for details about configuration options
* The [build function](api.md#buildinputstringobject-targetdirstringbootprint) function returns a preconfigured instance 
  of the [Bootprint class](api.md#the-bootprint-class)
* The [generate function](api.md#generatepromisestring) invokes Handlebars and LESS. 
  It returns a promise that is fulfilled when Bootprint is finished.
  
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
require('bootprint')
  .merge({
    handlebars: {
      templates: 'templates',
      partials: 'partials'
    },
    less: {
      main: 'less/main.less'
    }
  })
  .build('content.yaml', 'target')
  .generate()
  .then(console.log, console.error)
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


