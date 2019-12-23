# example-project 

[![NPM version](https://img.shields.io/npm/v/example-project.svg)](https://npmjs.com/package/example-project)

> Example to demonstrate the thought-plugin-bootprint



# Installation

```
npm -g install bootprint
npm -g install example-project
```

## Usage


After installing the package globally, you can run bootprint with the command

```bash
bootprint example-project  target
```

`example.json` can be found in [examples/example.json](examples/example.json) in this project.

Bootprint will then generate the following files:

<pre><code>examples/target/
├── index.html
├── main.css
└── main.css.map
</code></pre> 


## Customizing

You can write your own module that customizes the partials and helpers in this module
(see [the bootprint documentation](https://github.com/bootprint/bootprint/blob/master/doc/modules.md)) for details.

The entrypoint JavaScript-file of such a module would look like.

```js
module.exports = function (customize) {
  return customize
    .load(require('example-project'))
    .merge({
      // You customizations here
    })

// Add "package" metadata. This can be evaluated by documentation generators
module.exports.package = require('./package')
```

# API

see [docs/api.md](docs/api.md)


# License

`example-project` is published under the ISC-license.

No file "LICENSE*" found


 
# Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).