# customize 

[![Greenkeeper badge](https://badges.greenkeeper.io/bootprint/customize.svg)](https://greenkeeper.io/)

[![NPM version](https://badge.fury.io/js/customize.svg)](http://badge.fury.io/js/customize)
[![Travis Build Status](https://travis-ci.org/bootprint/customize.svg?branch=master)](https://travis-ci.org/bootprint/customize)
[![Coverage Status](https://img.shields.io/coveralls/bootprint/customize.svg)](https://coveralls.io/r/bootprint/customize)


> A simple framework to create customizable engines

Customize is an abstraction of [bootprint's](https://github.com/nknapp/bootprint) the merging-behaviour. 
It allows you to create your own projects and engines (other than Less and Handlebars) and create 
overridable configurations for those.

At its core, it uses [lodash#merge](https://lodash.com/docs#merge) to merge configurations, 
but it uses a customizer-function that also supports promises and custom overrider functions 
attached to the object.

## Engines

* [customize-engine-handlebars](https://npmjs.com/package/customize-engine-handlebars)
* [customize-engine-less](https://npmjs.com/package/customize-engine-less)
* [customize-engine-uglify](https://npmjs.com/package/customize-engine-uglify)

## Used by

* [thought](https://npmjs.com/package/thought)
* [bootprint](https://npmjs.com/package/bootprint)


# Installation

```
npm install customize
```

## Usage 

The following example should demonstrate the usage of Customize and the `files` 
io-helper. Consider the following file tree

<pre><code>

├─┬ dir1
│ ├── a.md
│ └── b.md
├─┬ dir2
│ └── a.md
├── engine-concat-files.js
├── example-buildConfig.js
├── example1.js
└── example2.js
</code></pre>

### Creating an engine

The first thing we need, is an engine. For now, we create an engine that just
concatenates the contents of all files in a directory. We put this engine into
the file `engine-concat-files.js` 

```js
var files = require('customize/helpers-io').files

module.exports = {
  // Optional input schema for engine-configurations
  // If this is present, the JSON will be validated before being passed into "preprocessConfig"
  schema: {
    description: 'Path to a directory containing files',
    type: 'string'
  },

  // Initial configuration when registering the engine.
  defaultConfig: null,

  // Files/Dirs to-be-watched with the default configuration
  defaultWatched: [],

  // This function is called for any `.merge` input.
  // It converts the input into its mergable form
  preprocessConfig: function (config) {
    return files(config)
  },

  // This function is called to determine the files and directories
  // to watch in developmentMode
  watched: function (config) {
    return [
      // The config itself is the directory-path
      config
    ]
  },

  // Runs the engine with a resolved configuration.
  // The config contains no Promises anymore.
  // The function returns an object
  //
  // {
  //    "filename.txt": "file-contents"
  // }
  //
  run: function (config) {
    var result = ''
    for (var filename in config) {
      if (config.hasOwnProperty(filename)) {
        result += config[filename].contents + '\n'
      }
    }
    return {
      // Return a file called "concat.txt"
      'concat.txt': result
    }
  }
}
```

* The engine provides an empty default configuration. This configuration is used 
  as long as no `.merge` and `.load` function is called. 
* The `preprocessor` of the engine assumes that the input configuration for this
  engine a path to a directory. It then uses the `files` io-helper to convert 
  this path into an object of lazy promises.
* The `run`-function concatenates the contents of the files. It returns 
  an object 

  ```js
    { "filename.txt": "contents", ... } 
  ```

  output file. The module [customize-write-files](https://npmjs.com/package/customize-write-files) can be used to 
  write such files to disk in a node environment. In order to this to work, 
  the contents must either be a string, a buffer or a [raadable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable).
  Strings will be stored in `utf-8` encoding.

### Loading a configuration

In order to see, how the preprocessor and the `files`-helper works, we can display 
the configuration after a merge:

```js
var customize = require('customize')

// Load files from one directory and merge with second
customize()
  .registerEngine('files', require('./engine-concat-files'))
  .merge({
    files: 'dir1'
  })
  .buildConfig()
  .done(console.log)
```

The example creates a new Customize-instances, registers our engine under the name 
`files` and provides the path to a directory as configuration for the `files` engine 
(i.e. as property `files` within the configuration object). It then uses the 
`.buildConfig()` function convert all nested promises to a single promise for the whole
config. This example prints the following result.

```js
{ files: 
   { 'b.md': { path: 'dir1/b.md', contents: 'Second file (from dir1)' },
     'a.md': { path: 'dir1/a.md', contents: 'First file (from dir1)' } } }
```

We can see that the `files`-call of the preprocessor converted the directory path into 
an object containing a one property for each file in the directory.

### Running the engine 

So far, we have loaded and displayed the preprocessed configuration. Now replace the 
`.buildConfig()`-call by `.run()`

```js
var customize = require('customize')

// Load files from one directory
customize()
  .registerEngine('files', require('./engine-concat-files'))
  .merge({
    files: 'dir1'
  })
  .run()
  .get('files')
  .done(console.log)
```

The engines `run()`-method will now be executed with the resolved configuration,
which yields the following output:

```
{ 'concat.txt': 'First file (from dir1)\nSecond file (from dir1)\n' }
```

### Merging another configuration

We now have a working customizable configuration. The only thing we have not tried 
yet is to customize it. We are going to assume that someone, maybe Bob, wants to reuse 
the configuration for my own purposes, because he really likes it, and it really does 
exactly what he was looking for. Almost... Except, that the contents of the first file (`a.md`) 
needs to be replace by something else. In reality this might be a Handlebars partial to include 
different contents, or an additional Less-file that changes some styles to follow Bob'
company's style-guide.

We can do this, by merging another configuration, but let's have a look at the directory
tree before doing this:

<pre><code>

├─┬ dir1
│ ├── a.md
│ └── b.md
├─┬ dir2
│ └── a.md
├── engine-concat-files.js
├── example-buildConfig.js
├── example1.js
└── example2.js
</code></pre>

You can see that the second directory contains a file `a.md`. We will use this file to
replace the file of the first directory.

```js
var customize = require('customize')

// Load files from one directory and merge with second
customize()
  .registerEngine('files', require('./engine-concat-files'))
  .merge({
    files: 'dir1'
  })
  .merge({
    files: 'dir2'
  })
  .run()
  .get('files')
  .done(console.log)
```

There is an additional call to `.merge` in this code. Its input is also passed to the 
engine's preprocessor, so now we get two objects containing files and their contents 
and those are merged by the [`.merge`-function of the lodash library](https://lodash.com/docs#merge),
so that in the above example, the property `a.md` is replace by the value in the 
second configuration. So the output of this example is

```
{ 'concat.txt': 'First file (from dir2)\nSecond file (from dir1)\n' }
```

### Advanced usage

This is the essence of `customize`. Actually, things are a bit more complicated. 
A custom overrider ensures (in this order)

* that nested objects can provide there own overrider function in a `_customize_custom_overrider`-property,
* that array-values are concatenated rather than replaced
* and that promises are correctly merged.

Finally, the `.files()`-helper does not return the file contents directly. It returns a promise for the 
file contents. This promise is lazy and only evaluated when the `.then()`-method is called. And it uses the 
`Customize.leaf()` method to attach custom overrider, so that a file-promise replaces its predecessor
without `.then()` being called. 
This means that files, whose contents is overridden by other files, are *not* opened for reading.

### Application of the principles

Currently, there is only the [thought](https://npmjs.com/package/thought) package uses customize, but [bootprint](https://npmjs.com/package/bootprint) uses the same principle.

In `thought` the `.thought/partials` directory is included to allow the user to override default Handlebars-partials with
custom verison.

In `bootprint` the user can create packages with Handlebars-partials and Less-definitions, which include and override 
partials and definitions from other packages.









##  API-reference

The exported module is a function that creates a new empty Customize-instance.

## Modules

<dl>
<dt><a href="#module_customize">customize</a></dt>
<dd><p>Create a new Customize object with an empty configuration</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#jsonschema">jsonschema</a></dt>
<dd><p>The configuration file is defined (and validated) by a JSON-schema
(see <a href="./config-schema.js">the config-schema file</a>) for details.
We use the <code>jsonschema</code> module for validation, along the the
<code>jsonschema-extra</code>-module, because the JSON can contain functions.</p>
</dd>
</dl>

<a name="module_customize"></a>

## customize
Create a new Customize object with an empty configuration


* [customize](#module_customize)
    * _static_
        * [.debugState](#module_customize.debugState)
        * [.debug](#module_customize.debug)
        * [.Customize](#module_customize.Customize) : <code>customize</code>
        * [.overrider](#module_customize.overrider) : <code>customOverrider</code>
        * [.withParent](#module_customize.withParent)
        * [.leaf](#module_customize.leaf) ⇒ <code>Promise</code>
    * _inner_
        * [~Customize](#module_customize..Customize)
            * [new Customize()](#new_module_customize..Customize_new)
            * [.registerEngine(id, engine)](#module_customize..Customize+registerEngine)
            * [.configSchema()](#module_customize..Customize+configSchema)
            * [.merge(config)](#module_customize..Customize+merge) ⇒ <code>Customize</code>
            * [.load(customizeModule)](#module_customize..Customize+load) ⇒ <code>Customize</code>
            * [.buildConfig()](#module_customize..Customize+buildConfig) ⇒ <code>Promise.&lt;object&gt;</code>
            * [.watched()](#module_customize..Customize+watched) ⇒ <code>Promise.&lt;object.&lt;Array.&lt;string&gt;&gt;&gt;</code>
            * [.run([options])](#module_customize..Customize+run) ⇒ <code>Promise.&lt;object&gt;</code>
        * [~customize()](#module_customize..customize) ⇒ <code>Customize</code>

<a name="module_customize.debugState"></a>

### customize.debugState
For coverage testing: Expose the debugState object so it can be enabled an disabled in testcases

**Kind**: static property of <code>[customize](#module_customize)</code>  
<a name="module_customize.debug"></a>

### customize.debug
For coverage testing: Expose the debug object so it can be enabled an disabled in testcases

**Kind**: static property of <code>[customize](#module_customize)</code>  
<a name="module_customize.Customize"></a>

### customize.Customize : <code>customize</code>
Exposes the constructor of the `customize` object

**Kind**: static property of <code>[customize](#module_customize)</code>  
<a name="module_customize.overrider"></a>

### customize.overrider : <code>customOverrider</code>
Custom overrider-function (that is used as `customizer` in (lodash#merge)[https://lodash.com/docs#merge]

**Kind**: static property of <code>[customize](#module_customize)</code>  
<a name="module_customize.withParent"></a>

### customize.withParent
Wrap a function so that if it overrides another function, that function will
be available as `this.parent`

**Kind**: static property of <code>[customize](#module_customize)</code>  
**Read only**: true  
**Api**: public  

| Param |
| --- |
| fn | 

<a name="module_customize.leaf"></a>

### customize.leaf ⇒ <code>Promise</code>
Create a promise that is regarded as leaf in the configuration tree.
That means, that the overrider is not resolving this promise when overriding values.
Promised object values will not be merged but replaced.

**Kind**: static property of <code>[customize](#module_customize)</code>  
**Access:** public  
**Read only**: true  

| Param | Type | Description |
| --- | --- | --- |
| promiseOrValue | <code>\*</code> | a promise or a valude that represents the leaf |

<a name="module_customize..Customize"></a>

### customize~Customize
**Kind**: inner class of <code>[customize](#module_customize)</code>  

* [~Customize](#module_customize..Customize)
    * [new Customize()](#new_module_customize..Customize_new)
    * [.registerEngine(id, engine)](#module_customize..Customize+registerEngine)
    * [.configSchema()](#module_customize..Customize+configSchema)
    * [.merge(config)](#module_customize..Customize+merge) ⇒ <code>Customize</code>
    * [.load(customizeModule)](#module_customize..Customize+load) ⇒ <code>Customize</code>
    * [.buildConfig()](#module_customize..Customize+buildConfig) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.watched()](#module_customize..Customize+watched) ⇒ <code>Promise.&lt;object.&lt;Array.&lt;string&gt;&gt;&gt;</code>
    * [.run([options])](#module_customize..Customize+run) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="new_module_customize..Customize_new"></a>

#### new Customize()
This class does the actual work. When calling
`require('customize')()` a new instance of this
class is returned with an empty configuration, so
`new Customize(...)` should never be called outside
this module
`config` and `parentConfig` are of the form

```js
{ engine: { config: ..., watched: [ ... ] } }
```

<a name="module_customize..Customize+registerEngine"></a>

#### customize.registerEngine(id, engine)
Register an engine

**Kind**: instance method of <code>[Customize](#module_customize..Customize)</code>  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | the identifier of the engine. This identifier is also used  within the config as key within the configuration object to identify the  sub-configuration stored for this engine. |
| engine | <code>object</code> | a customize engine that is registered |
| [engine.defaultConfig] | <code>object</code> | the default configuration of the engine |
| engine.preprocessConfig | <code>function</code> | a preprocessor to convert a merge-configuration to the internal format of the engine |
| engine.run | <code>function</code> | the execution function of the engine (the merged config is passed as parameter |
| engine.run | <code>function</code> | the execution function of the engine (the merged config is passed as parameter) |
| [engine.schema] | <code>object</code> | a JSON-schema to validate the merge-configurations against. |

<a name="module_customize..Customize+configSchema"></a>

#### customize.configSchema()
Returns the JSON-schema that configuration objects must match for this
configuration. The schema does not contain main description property

**Kind**: instance method of <code>[Customize](#module_customize..Customize)</code>  
<a name="module_customize..Customize+merge"></a>

#### customize.merge(config) ⇒ <code>Customize</code>
Creates a new instance of Customize. The configuration values of the current Customize
are used as default values and are overridden by the configuration provided as parameter.

**Kind**: instance method of <code>[Customize](#module_customize..Customize)</code>  
**Returns**: <code>Customize</code> - the new Customize instance  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | configuration overriding the current configuration |

<a name="module_customize..Customize+load"></a>

#### customize.load(customizeModule) ⇒ <code>Customize</code>
Inherit configuration config from another module.
a Customizer-module usually exports a `function(Customize):Customize`
which in tern calls `Customize.merge` to create a new Customize instance.
This function needs to be passed in here.

A new Customize will be returned that overrides the current configuration
with the configuration of the module.

**Kind**: instance method of <code>[Customize](#module_customize..Customize)</code>  
**Returns**: <code>Customize</code> - the Customize instance returned by the module  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| customizeModule | <code>function</code> | that receives a Customize as paramater  and returns a Customize with changed configuration. |

<a name="module_customize..Customize+buildConfig"></a>

#### customize.buildConfig() ⇒ <code>Promise.&lt;object&gt;</code>
Return a promise for the merged configuration.
This functions is only needed to inspect intermediate configuration results
(i.e. for testing and documentation purposes)

**Kind**: instance method of <code>[Customize](#module_customize..Customize)</code>  
**Returns**: <code>Promise.&lt;object&gt;</code> - a promise for the whole configuration  
**Access:** public  
<a name="module_customize..Customize+watched"></a>

#### customize.watched() ⇒ <code>Promise.&lt;object.&lt;Array.&lt;string&gt;&gt;&gt;</code>
Return a promise for the files needing to be watched in watch-mode,
indexed by engine.

**Kind**: instance method of <code>[Customize](#module_customize..Customize)</code>  
**Returns**: <code>Promise.&lt;object.&lt;Array.&lt;string&gt;&gt;&gt;</code> - a promise for the files to be watched.  
**Access:** public  
<a name="module_customize..Customize+run"></a>

#### customize.run([options]) ⇒ <code>Promise.&lt;object&gt;</code>
Run each engine with its part of the config.

**Kind**: instance method of <code>[Customize](#module_customize..Customize)</code>  
**Returns**: <code>Promise.&lt;object&gt;</code> - an object containing on property per registered engine
 (the key is the engine-id) containing the result of each engine  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | optional paramters |
| [options.onlyEngine] | <code>string</code> | optionally the name of an engine, if only a single engine should  be executed |

<a name="module_customize..customize"></a>

### customize~customize() ⇒ <code>Customize</code>
**Kind**: inner method of <code>[customize](#module_customize)</code>  
**Api**: public  
<a name="jsonschema"></a>

## jsonschema
The configuration file is defined (and validated) by a JSON-schema
(see [the config-schema file](./config-schema.js)) for details.
We use the `jsonschema` module for validation, along the the
`jsonschema-extra`-module, because the JSON can contain functions.

**Kind**: global variable  


## IO/Helpers


## Functions

<dl>
<dt><a href="#readFiles">readFiles(directoryPath, [options])</a> ⇒ <code>Promise.&lt;object.&lt;string, Promise.&lt;{path:string, contents:string}&gt;&gt;&gt;</code></dt>
<dd><p>An overridable directory which resolves to the contents of all its files (recursively).
Returns an undefined value if the directory path is undefined.</p>
</dd>
<dt><del><a href="#files">files(directoryPath, [options])</a> ⇒ <code>Promise.&lt;object.&lt;string, Promise.&lt;{path:string, contents:string}&gt;&gt;&gt;</code></del></dt>
<dd><p>An overridable directory which resolves to the contents of all its files (recursively).
Returns an undefined value if the directory path is undefined.
The contents of each file is a UTF-8 encoded string.</p>
</dd>
</dl>

<a name="readFiles"></a>

## readFiles(directoryPath, [options]) ⇒ <code>Promise.&lt;object.&lt;string, Promise.&lt;{path:string, contents:string}&gt;&gt;&gt;</code>
An overridable directory which resolves to the contents of all its files (recursively).
Returns an undefined value if the directory path is undefined.

**Kind**: global function  
**Returns**: <code>Promise.&lt;object.&lt;string, Promise.&lt;{path:string, contents:string}&gt;&gt;&gt;</code> - an object containing
   the relative file-path from the directoryPath as key and the file-path and the file-contents as value  

| Param | Type | Description |
| --- | --- | --- |
| directoryPath | <code>string</code> &#124; <code>null</code> &#124; <code>undefined</code> | the path to the directory |
| [options] | <code>object</code> |  |
| [options.glob] | <code>string</code> | an optional glob pattern for filtering files |
| [options.stream] | <code>boolean</code> | if set to true, the contents of a file will be a readable stream   instead of the actual data. |
| [options.encoding] | <code>string</code> | the file is expected to be encoded. This means that the   instead of a Buffer, a string is returned. If the 'stream' option is set, the stream's encoding   will be set via [readable.setEncoding(encoding)](https://nodejs.org/api/stream.html#stream_readable_setencoding_encoding) |

<a name="files"></a>

## ~~files(directoryPath, [options]) ⇒ <code>Promise.&lt;object.&lt;string, Promise.&lt;{path:string, contents:string}&gt;&gt;&gt;</code>~~
***Deprecated***

An overridable directory which resolves to the contents of all its files (recursively).
Returns an undefined value if the directory path is undefined.
The contents of each file is a UTF-8 encoded string.

**Kind**: global function  
**Returns**: <code>Promise.&lt;object.&lt;string, Promise.&lt;{path:string, contents:string}&gt;&gt;&gt;</code> - an object containing
   the relative file-path from the directoryPath as key and the file-path and the file-contents as value  

| Param | Type | Description |
| --- | --- | --- |
| directoryPath | <code>string</code> &#124; <code>null</code> &#124; <code>undefined</code> | the path to the directory |
| [options] | <code>object</code> |  |
| [options.glob] | <code>string</code> | an optional glob pattern for filtering files |





## License

`customize` is published under the MIT-license. 
See [LICENSE.md](LICENSE.md) for details.

## Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
## Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).