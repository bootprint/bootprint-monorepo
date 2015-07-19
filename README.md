# customize-engine-handlebars

> Use handlebars as engine for customize


# Installation

```
npm install customize-engine-handlebars
```

## Usage

The following example demonstrates how to use this module:

<pre><code>examples/
├── config-module.js
├── example-merge.js
├── example.js
├── hb-helpers.js
├── hb-preprocessor.js
├── partials/
│   └── footer.hbs
├── partials2/
│   └── footer.hbs
└── templates/
    ├── text1.txt.hbs
    └── text2.txt.hbs</code></pre>

### Configuration

The following usage example has a configuration for all possible properties
of the Handlebars-engine:

```js
var customize = require('customize')
customize()
  .registerEngine('handlebars', require('customize-engine-handlebars'))
  .load(require('./config-module.js'))
  .run()
  .done(console.log)
```

This example loads its configuration from the module `config-module.js`

```js
module.exports = function (customize) {
  return customize.merge({
    handlebars: {
      // Directory containing templates
      templates: 'templates',
      // Directory containing partials
      partials: 'partials',
      // JS-file exporting Handlebars helper-functions
      helpers: 'hb-helpers.js',
      // JS-file exporting a preprocessor function
      preprocessor: 'hb-preprocessor.js',
      // Input data for Handlebars
      data: {
        name: 'Nils',
        city: 'Darmstadt'
      }
    }
  })
}

```


*A quick note: If your are really creating a configuration-module, you should always
use `require.resolve` or `__dirname` to determine the correct path to referenced files.*

All the templates in the `templates` directory are called with the provided `data` (name and city).
Each one generates an entry in the result of the engine. The templates call a partial that is 
inserted below the main content. Helper functions from the `hb-helpers.js`-file are registered 
with Handlebars and `text2.txt.hbs` uses the `shout`-helper from `hb-helpers.js` to turn a 
string into upper-case. 

```hbs
I'm {{name}}

I'm living in {{shout city}}.

{{>footer}}
```


The example also includes a preprocessor (`hb-preprocessor.js`) that calls [the open weather map API](http://openweathermap.org/current#name)
to determine the current weather in the given city. 

```js
module.exports = function (data) {
  var url = 'http://api.openweathermap.org/data/2.5/weather?q=' +
    data.city +
    '&units=metric'
  return {
    name: data.name,
    city: data.city,
    weather: require('get-promise')(url).get('data').then(JSON.parse)
  }
}

```


The result is injected into the data as `weather` property and rendered by 
the `footer.hbs` partial.

```hbs
------
Weather: {{{weather.weather.0.description}}}
```


The output of this example is:

```
{ handlebars: 
   { 'text1.txt': 'I\'m Nils\n\nI\'m living in Darmstadt.\n\n------\nWeather: scattered clouds',
     'text2.txt': 'I\'m Nils\n\nI\'m living in DARMSTADT.\n\n------\nWeather: scattered clouds' } }
```


### Customizing configurations

We can use the mechanism of [customize](https://npmjs.com/package/customize) to adapt the configuration.
In the following example, we replace the `footer.hbs`-partial by a different version.
We do this by specifying a new partial directory. Partials with the same name as in 
the previous directory will overwrite the old one.

```js
var customize = require('customize')
customize()
  .registerEngine('handlebars', require('customize-engine-handlebars'))
  .load(require('./config-module.js'))
  .merge({
    handlebars: {
      partials: 'partials2'
    }
  })
  .run()
  .done(console.log)
```

The new `footer.hbs` writes only the current temperature, instead of the weather description

```hbs
------
Temperature: {{{weather.main.temp}}}
```


The output of this example is

```
{ handlebars: 
   { 'text1.txt': 'I\'m Nils\n\nI\'m living in Darmstadt.\n\n------\nTemperature: 21.35',
     'text2.txt': 'I\'m Nils\n\nI\'m living in DARMSTADT.\n\n------\nTemperature: 21.35' } }
```

In a similar fashion, we could replace other parts of the configuration, like templates, helpers
and the pre-processor. If we would provide a new preprocessor, it could call the old one,
by calling `this.parent(args)`


##  API-reference

### Global




**Members:**

+ preprocessor

* * *

##### preprocessConfig(config) 

**Parameters**

**config**: `Promise.&lt;object&gt;`, the input configuration that is written by the user

**Returns**: `Promise.&lt;object&gt;`, the configuration that is passed into the merging process
   later expected as parameter to the main function of the engine


##### run(config) 

Runs the handlebars-engine. The engine is

**Parameters**

**config**: , Runs the handlebars-engine. The engine is



##### stripHandlebarsExt(value, key) 

Use in mapkeys to remove the hbs extension

**Parameters**

**value**: `*`, ignored

**key**: `string`, the original filename

**Returns**: `string`, the filename without .hbs



* * *












## License

`customize-engine-handlebars` is published under the MIT-license. 
See [LICENSE.md](LICENSE.md) for details.

## Contributing Guidelines

<!-- Taken from @tunnckoCore: https://github.com/tunnckoCore/coreflow-templates/blob/master/template/CONTRIBUTING.md -->

Contributions are always welcome!

**Before spending lots of time on something, ask for feedback on your idea first!**

Please search issues and pull requests before adding something new to avoid duplicating
efforts and conversations.


### Installing

Fork and clone the repo, then `npm install` to install all dependencies and `npm test` to
ensure all is okay before you start anything.


### Testing

Tests are run with `npm test`. Please ensure all tests are passing before submitting
a pull request (unless you're creating a failing test to increase test coverage or show a problem).

### Code Style

[![standard][standard-image]][standard-url]

This repository uses [`standard`][standard-url] to maintain code style and consistency,
and to avoid style arguments.
```
npm i standard -g
```

It is intentional to don't have `standard`, `istanbul` and `coveralls` in the devDependencies. Travis will handle all that stuffs. That approach will save bandwidth also installing and development time.

[standard-image]: https://cdn.rawgit.com/feross/standard/master/badge.svg
[standard-url]: https://github.com/feross/standard
