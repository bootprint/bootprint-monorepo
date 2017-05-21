# thought-plugin-bootprint 

[![NPM version](https://badge.fury.io/js/thought-plugin-bootprint.svg)](http://badge.fury.io/js/thought-plugin-bootprint)[![Travis Build Status](https://travis-ci.org/bootprint/thought-plugin-bootprint.svg?branch=master)](https://travis-ci.org/bootprint/thought-plugin-bootprint)[![Coverage Status](https://img.shields.io/coveralls/bootprint/thought-plugin-bootprint.svg)](https://coveralls.io/r/bootprint/thought-plugin-bootprint)[![Greenkeeper badge](https://badges.greenkeeper.io/bootprint/thought-plugin-bootprint.svg)](https://greenkeeper.io/)

> A thought-plugin for Bootprint modules


## Installation

In order to use this plugin for [thought](https://npmjs.com/package/thought),
first add it to the dev-dependencies of your project

```bash
npm install --save-dev thought-plugin-bootprint
```

## Usage

You can then add a file `.thought/config.js` to your 
project, with the following contents.

```js
module.exports = {
  plugins: [
    require('thought-plugin-bootprint')
  ]
}
```

## Example

You can see the plugin in action in [the example-project](examples/example-project)


## API (Partials and Helpers)

see [docs/api.md](docs/api.md)

# License

`thought-plugin-bootprint` is published under the MIT-license.

See [LICENSE.md](LICENSE.md) for details.


# Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
# Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).