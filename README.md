# customize-watch 

[![NPM version](https://badge.fury.io/js/customize-watch.svg)](http://badge.fury.io/js/customize-watch)
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










##  API-reference

<a name="Recustomize"></a>
### Recustomize
**Kind**: global class  

* [Recustomize](#Recustomize)
  * [new Recustomize(builder)](#new_Recustomize_new)
  * _instance_
    * [.merge](#Recustomize+merge)
    * [.registerEngine](#Recustomize+registerEngine)
    * [.load](#Recustomize+load)
    * [.configSchema()](#Recustomize+configSchema) : <code>function</code>
    * [.buildConfig()](#Recustomize+buildConfig) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.watched()](#Recustomize+watched) ⇒ <code>Promise.&lt;object.&lt;Array.&lt;string&gt;&gt;&gt;</code>
    * [.watch()](#Recustomize+watch) ⇒ <code>EventEmitter</code>
    * [.run()](#Recustomize+run) ⇒ <code>object</code>
  * _inner_
    * [~wrap(fnName)](#Recustomize..wrap) ⇒ <code>function</code>

<a name="new_Recustomize_new"></a>
#### new Recustomize(builder)
Recustomize has the same interface as Customize, but instead of storing
the current configuration-state, it stores a function that computes the state.
The only difference is the [watch()](#Recustomize+watch)-method. It can be
used to emit an event every time one of the input files is added, removed or changed.


| Param | Type | Description |
| --- | --- | --- |
| builder | <code>function</code> | a builder function for a Customize object |

<a name="Recustomize+merge"></a>
#### recustomize.merge
Wrapped function. See [customize](https://github.com/nknapp/customize) for details

**Kind**: instance property of <code>[Recustomize](#Recustomize)</code>  
**Api**: private  
<a name="Recustomize+registerEngine"></a>
#### recustomize.registerEngine
Wrapped function. See [customize](https://github.com/nknapp/customize) for details

**Kind**: instance property of <code>[Recustomize](#Recustomize)</code>  
**Api**: private  
<a name="Recustomize+load"></a>
#### recustomize.load
Wrapped function. See [customize](https://github.com/nknapp/customize) for details

**Kind**: instance property of <code>[Recustomize](#Recustomize)</code>  
**Api**: private  
<a name="Recustomize+configSchema"></a>
#### recustomize.configSchema() : <code>function</code>
Wrapped function. See [customize](https://github.com/nknapp/customize) for details

**Kind**: instance method of <code>[Recustomize](#Recustomize)</code>  
<a name="Recustomize+buildConfig"></a>
#### recustomize.buildConfig() ⇒ <code>Promise.&lt;object&gt;</code>
Return the configuation object

**Kind**: instance method of <code>[Recustomize](#Recustomize)</code>  
**Api**: private  
<a name="Recustomize+watched"></a>
#### recustomize.watched() ⇒ <code>Promise.&lt;object.&lt;Array.&lt;string&gt;&gt;&gt;</code>
Return a list of files and directories that need to be watched
in watch-mode.

**Kind**: instance method of <code>[Recustomize](#Recustomize)</code>  
**Returns**: <code>Promise.&lt;object.&lt;Array.&lt;string&gt;&gt;&gt;</code> - a list of paths to files or directories for each engine  
**Api**: private  
<a name="Recustomize+watch"></a>
#### recustomize.watch() ⇒ <code>EventEmitter</code>
Register file-watchers for all relevant files.
Rebuild the config and run the appropriate engine, whenever
a file has changed.

**Kind**: instance method of <code>[Recustomize](#Recustomize)</code>  
<a name="Recustomize+run"></a>
#### recustomize.run() ⇒ <code>object</code>
Wraps the run(...)-method of the customize object, rebuilding the whole configuration
before running.

**Kind**: instance method of <code>[Recustomize](#Recustomize)</code>  
**Api**: private  
<a name="Recustomize..wrap"></a>
#### Recustomize~wrap(fnName) ⇒ <code>function</code>
Wrap the method of a Customize object such that
instead of the new Customize object, new Recustomize object
with the appropriate builder-function is returned

**Kind**: inner method of <code>[Recustomize](#Recustomize)</code>  
**Api**: private  

| Param |
| --- |
| fnName | 




## License

`customize-watch` is published under the MIT-license. 
See [LICENSE.md](LICENSE.md) for details.

## Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
## Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).