# customize-engine-less 

[![NPM version](https://badge.fury.io/js/customize-engine-less.svg)](http://badge.fury.io/js/customize-engine-less)
[![Travis Build Status](https://travis-ci.org/bootprint/customize-engine-less.svg?branch=master)](https://travis-ci.org/bootprint/customize-engine-less)
[![Coverage Status](https://img.shields.io/coveralls/bootprint/customize-engine-less.svg)](https://coveralls.io/r/bootprint/customize-engine-less)
[![Greenkeeper badge](https://badges.greenkeeper.io/bootprint/customize-engine-less.svg)](https://greenkeeper.io/)

> A less-engine for customize


# Installation

```
npm install customize-engine-less
```

 
# Usage

The following example demonstrates how to use this module:

```js
var customize = require('customize')

// Load files from one directory and merge with second
customize()
  .registerEngine('less', require('customize-engine-less'))
  // Add one less file
  .merge({
    less: {
      main: require.resolve('./main.less')
    }
  })
  // Add another less file overriding some variables
  .merge({
    less: {
      main: require.resolve('./override.less')
    }
  })
  .run()
  .then(console.log)
```

This will generate the following output

```
{ less: 
   { 'main.css': 'div{color:red;background-color:green}/*# sourceMappingURL=main.css.map */',
     'main.css.map': '{"version":3,"sources":["/home/nknappmeier/projects/bootprint/customize-engine-less/examples/main.less"],"names":[],"mappings":"AAGA,IACE,SAAA,CACA","sourcesContent":["@textcolor: blue;\\n@bgcolor: green;\\n\\ndiv {\\n  color: @textcolor;\\n  background-color: @bgcolor;  \\n}\\n\\n\\n\\n"]}' } }
```



# License

`customize-engine-less` is published under the MIT-license.

See [LICENSE.md](LICENSE.md) for details.


# Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
# Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).