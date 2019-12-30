# customize-engine-handlebars 

[![NPM version](https://img.shields.io/npm/v/customize-engine-handlebars.svg)](https://npmjs.com/package/customize-engine-handlebars)
[![Greenkeeper badge](https://badges.greenkeeper.io/bootprint/bootprint-monorepo.svg)](https://greenkeeper.io/)

> Use handlebars as engine for customize


# Installation

```
npm install customize-engine-handlebars
```

## Usage

The following examples demonstrate how to use this module.

### Configuration

The following usage example has a configuration for all possible properties
of the Handlebars-engine:

```js
const customize = require('customize')
customize()
  .registerEngine('handlebars', require('customize-engine-handlebars'))
  .load(require('./config-module.js'))
  .run()
  .then(console.log)
```

This example loads its configuration from the module `config-module.js`:

```js
module.exports = function(customize) {
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
        name: 'nknapp',
        city: 'Darmstadt'
      }
    }
  })
}

```


*A quick note: If your are creating a real configuration-module, you should always
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


The example also includes a preprocessor (`hb-preprocessor.js`) that calls
[the github API](https://developer.github.com/v3/users/#get-a-single-user)
to retrieve information about the user.

```js
const got = require('got')

module.exports = async function(data) {
  return {
    name: data.name,
    city: data.city,
    github: got('https://api.github.com/users/nknapp').json()
  }
}

```


The result is injected into the data as `github` property and rendered by
the `footer.hbs` partial.

```hbs
------
Github-Name: {{{github.name}}}
```


The output of this example is:

```
{
  "handlebars": {
    "subdir/text3.txt": "------\nBlog: https://blog.knappi.org\n",
    "text1.txt": "I'm nknapp\n\nI'm living in Darmstadt.\n\n------\nBlog: https://blog.knappi.org\n",
    "text2.txt": "I'm nknapp\n\nI'm living in DARMSTADT.\n\n------\nBlog: https://blog.knappi.org\n"
  }
}
```

### More examples

see [docs/examples.md](docs/examples.md) for more examples

## API-documentation

This package will always support the latest version of NodeJS and as well as the current LTS version.
In the future, it will not be considered a breaking change to drop support of a pre-LTS version of NodeJS.

see [docs/api.md](docs/api.md)

# License

`customize-engine-handlebars` is published under the MIT-license.

See [LICENSE.md](LICENSE.md) for details.


# Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
# Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).