# customize-write-files 

[![NPM version](https://img.shields.io/npm/v/customize-write-files.svg)](https://npmjs.com/package/customize-write-files)
[![Travis Build Status](https://travis-ci.org/bootprint/bootprint-monorepo.svg?branch=master)](https://travis-ci.org/bootprint/bootprint-monorepo)
[![Coverage Status](https://img.shields.io/coveralls/bootprint/bootprint-monorepo.svg)](https://coveralls.io/r/bootprint/bootprint-monorepo)

> Post-processor that stores the result of a customize-run in a local directory

The [customize](https://npmjs.com/package/customize) module is a framework for creating overridable configurations for different
engines. It is, in principle, designed to be platform independent (that's actually only half-true).
Engines running in `customize` always return file-contents as JavaScript-object in the form

```js
{
  'engineName': {
    'file.txt': 'contents of the file',
    'subdir/file.txt': 'contents of the other file'
  }
```

The contents of the file may be one of the following

* A string (to be stored in the file `utf-8`-encoded) 
* A buffer
* A readable stream.

The goal of `customize-write-files` is to act as an NodeJS-adapter for customize 
and store the result of `customize` in a local directory structure.
 
## NodeJS compatibility notes

This package will always support the latest version of NodeJS and as well as the current LTS version.
In the future, it will not be considered a breaking change to drop support of a pre-LTS version of NodeJS.

# Installation

```
npm install customize-write-files
```

 
# Usage

The following example demonstrates how to use this module:

```js
const customize = require('customize')
const write = require('customize-write-files')

// Load files from one directory and merge with second
customize()
  .registerEngine('less', require('customize-engine-less'))
  // Add one less file
  .merge({
    less: {
      main: require.resolve('./main.less')
    }
  })
  .run()
  // Write contents to the "target"-directory
  .then(write('target'))
  // Output the names of the files being written
  .then(console.log)
```

This will generate the following output

```
[ 'target/main.css', 'target/main.css.map' ]
```



# License

`customize-write-files` is published under the MIT-license.

See [LICENSE.md](LICENSE.md) for details.


# Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
# Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).