# customize-write-files 

[![NPM version](https://badge.fury.io/js/customize-write-files.svg)](http://badge.fury.io/js/customize-write-files)
     [![Travis Build Status](https://travis-ci.org/bootprint/customize-write-files.svg?branch=master)](https://travis-ci.org/bootprint/customize-write-files)
   [![Coverage Status](https://img.shields.io/coveralls/bootprint/customize-write-files.svg)](https://coveralls.io/r/bootprint/customize-write-files)


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

The goal of `undefined` is to act as an NodeJS-adapter for customize 
and store the result of `customize` in a local directory structure.
 
# Installation

```
npm install customize-write-files
```

 
## Usage

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
  .done(console.log)
```

This will generate the following output

```
custom false {}
debugState false {}
custom false { less: { config: { main: [], paths: [] }, watched: [] } }
debugState false { less: { config: { main: [], paths: [] }, watched: [] } }
custom false { less: { state: 'pending' } }
debugState false { less: { state: 'pending' } }
[ 'target/main.css', 'target/main.css.map' ]
```

##  API-reference

<a name="write"></a>
### write(targetDir) ⇒ <code>function</code>
Creates a function that writes the result of the `customize#run()` method to a
local target directory.

**Kind**: global function  
**Returns**: <code>function</code> - return a function that writes a customize-result to the targetDir.
 The function takes a customize-result as first parameter and returns a promise for a list of filenames.
 (i.e. the files that were actually written)  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| targetDir | <code>string</code> | path to the target directory |




## License

`customize-write-files` is published under the MIT-license. 
See [LICENSE.md](LICENSE.md) for details.

## Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
## Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).