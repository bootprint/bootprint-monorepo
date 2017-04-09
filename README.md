# customize-write-files 

[![NPM version](https://badge.fury.io/js/customize-write-files.svg)](http://badge.fury.io/js/customize-write-files)
[![Travis Build Status](https://travis-ci.org/bootprint/customize-write-files.svg?branch=master)](https://travis-ci.org/bootprint/customize-write-files)
[![Coverage Status](https://img.shields.io/coveralls/bootprint/customize-write-files.svg)](https://coveralls.io/r/bootprint/customize-write-files)
[![Greenkeeper badge](https://badges.greenkeeper.io/bootprint/customize-write-files.svg)](https://greenkeeper.io/)

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
 
# Installation

```
npm install customize-write-files
```

 
# Usage

The following example demonstrates how to use this module:

```js
var customize = require('customize')
var write = require('customize-write-files')

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