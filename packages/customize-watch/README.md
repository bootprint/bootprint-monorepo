# customize-watch 

[![NPM version](https://img.shields.io/npm/v/customize-watch.svg)](https://npmjs.com/package/customize-watch)
[![Travis Build Status](https://travis-ci.org/bootprint/customize-watch.svg?branch=master)](https://travis-ci.org/bootprint/customize-watch)
[![Coverage Status](https://img.shields.io/coveralls/bootprint/customize-watch.svg)](https://coveralls.io/r/bootprint/customize-watch)

> A file watcher for customize

`customize-watch` is a file watcher for [customize](https://github.com/nknapp/customize)
It attaches watchers (using [chokidar](https://github.com/paulmillr/chokidar)) to 
the files and directories that are relevant for computing a result with `customize`.

If files are added, removed or changed the result will be recomputed.

# Installation

```
npm install customize-watch
```

## Usage

The following example is almost identical to the
["merging another configuration"-example of the `customize`-module](https://github.com/nknapp/customize#merging-another-configuration).

```js
var customize = require('customize-watch')

// Load files from one directory and merge with second
customize()
  .registerEngine('files', require('./engine-concat-files'))
  .merge({
    files: 'dir1'
  })
  .merge({
    files: 'dir2'
  })
  .watch()
  .on('update', function (result) {
    console.log('result', result.files)
  })
```

It will generate the same output, but every time the files in `dir1` and `dir2` are changed, 
removed or added, the output will be recomputed. The `update`-event will be sent with the result
as argument, every time the computation has finished.












# License

`customize-watch` is published under the MIT-license.

See [LICENSE.md](LICENSE.md) for details.


# Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
# Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).