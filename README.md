# customize

> A simple framework to create customizable engines

Customize is an abstraction of [bootprint's](https://github.com/nknapp/bootprint) the merging-behaviour. 
It allows you to create your own projects and engines (other than Less and Handlebars) and create 
overridable configurations for those.

At its core, it uses [lodash#merge](https://lodash.com/docs#merge) to merge configurations, 
but it uses a customizer-function that also supports promises and custom overrider functions 
attached to the object.

Currently, there is only one engine ([customize-engine-handlebars](https://npmjs.com/package/customize-engine-handlebars))
and one project that actually uses Customize ([Thought](https://npmjs.com/package/thought)).
Bootprint will use Customize as well, once all features (i.e. like a file watcher) are implemented.


# Installation

```
npm install customize
```

## Usage 

The following example should demonstrate the usage of Customize and the `files` 
io-helper. Consider the following file tree

<pre><code>file-example/
├── dir1/
│   ├── a.md
│   └── b.md
├── dir2/
│   └── a.md
├── engine-concat-files.js
├── example-build.js
├── example1.js
└── example2.js</code></pre>

### Creating an engine

The first thing we need, is an engine. For now, we create an engine that just
concatenates the contents of all files in a directory. We put this engine into
the file `engine-concat-files.js` 

```js
var files = require('customize/helpers-io').files

module.exports = {
  // Initial configuration when registering the engine.
  defaultConfig: null,

  // This function is called for any `.merge` input.
  // It converts the input into its mergable form
  preprocessConfig: function (config) {
    return files(config)
  },

  // Runs the engine with a resolved configuration.
  // The config contains no Promises anymore.
  run: function (config) {
    var result = ''
    for (var filename in config) {
      if (config.hasOwnProperty(filename)) {
        result += config[filename].contents + '\n'
      }
    }
    return result
  }
}
```

* The engine provides an empty default configuration. This configuration is used 
  as long as no `.merge` and `.load` function is called. 
* The `preprocessor` of the engine assumes that the input configuration for this
  engine a path to a directory. It then uses the `files` io-helper to convert 
  this path into an object of lazy promises.
* The `run`-function concatenates and returns the contents of each file.

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
  .build()
  .done(console.log)
```

The example creates a new Customize-instances, registers our engine under the name 
`files` and provides the path to a directory as configuration for the `files` engine 
(i.e. as property `files` within the configuration object). It then uses the 
`.build` function convert all nested promises to a single promise for the whole
config. This example prints the following result.

```js
{ files: 
   { 'a.md': { path: 'dir1/a.md', contents: 'First file (from dir1)' },
     'b.md': { path: 'dir1/b.md', contents: 'Second file (from dir1)' } } }
```

We can see that the `files`-call of the preprocessor converted the directory path into 
an object containing a one property for each file in the directory.

### Running the engine 

So far, we have loaded and displayed the preprocessed configuration. Now replace the 
`.build()`-call by `.run()`

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
First file (from dir1)
Second file (from dir1)
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

<pre><code>file-example/
├── dir1/
│   ├── a.md
│   └── b.md
├── dir2/
│   └── a.md
├── engine-concat-files.js
├── example-build.js
├── example1.js
└── example2.js</code></pre>

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
First file (from dir2)
Second file (from dir1)
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

<a name="module_customize"></a>
## customize
Create a new Customize object with an empty configuration


* [customize](#module_customize)
  * _static_
    * [.withParent](#module_customize.withParent)
    * [.leaf](#module_customize.leaf) ⇒ <code>Promise</code>
  * _inner_
    * [~Customize](#module_customize..Customize)
      * [new Customize()](#new_module_customize..Customize_new)
      * [.registerEngine(id, engine)](#module_customize..Customize+registerEngine)
      * [.merge(config)](#module_customize..Customize+merge) ⇒ <code>Customize</code>
      * [.load(customizeModule)](#module_customize..Customize+load) ⇒ <code>Customize</code>
      * [.build()](#module_customize..Customize+build) ⇒ <code>Promise.&lt;object&gt;</code>
      * [.run()](#module_customize..Customize+run) ⇒ <code>Promise.&lt;object&gt;</code>
    * [~customize()](#module_customize..customize) ⇒ <code>Customize</code>

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
    * [.merge(config)](#module_customize..Customize+merge) ⇒ <code>Customize</code>
    * [.load(customizeModule)](#module_customize..Customize+load) ⇒ <code>Customize</code>
    * [.build()](#module_customize..Customize+build) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.run()](#module_customize..Customize+run) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="new_module_customize..Customize_new"></a>
#### new Customize()
This class does the actual work. When calling
`require('customize')()` a new instance of this
class is returned with an empty configuration, so
`new Customize(...)` should never be called outside
this module

<a name="module_customize..Customize+registerEngine"></a>
#### customize.registerEngine(id, engine)
Register an engine an engine

**Kind**: instance method of <code>[Customize](#module_customize..Customize)</code>  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | the identifier of the engine. This identifier is also used  within the config as key within the configuration object to identify the  sub-configuration stored for this engine. |
| engine | <code>Object</code> | a customize engine that is registered |

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

<a name="module_customize..Customize+build"></a>
#### customize.build() ⇒ <code>Promise.&lt;object&gt;</code>
Return a promise for the merged configuration.
This functions is only needed to inspect intermediate configuration results
(i.e. for testing and documentation purposes)

**Kind**: instance method of <code>[Customize](#module_customize..Customize)</code>  
**Returns**: <code>Promise.&lt;object&gt;</code> - a promise for the whole configuration  
**Access:** public  
<a name="module_customize..Customize+run"></a>
#### customize.run() ⇒ <code>Promise.&lt;object&gt;</code>
Run each engine with its part of the config.

**Kind**: instance method of <code>[Customize](#module_customize..Customize)</code>  
**Returns**: <code>Promise.&lt;object&gt;</code> - an object containing on property per registered engine
 (the key is the engine-id) containing the result of each engine  
**Access:** public  
<a name="module_customize..customize"></a>
### customize~customize() ⇒ <code>Customize</code>
**Kind**: inner method of <code>[customize](#module_customize)</code>  
**Api**: public  


## IO/Helpers


<a name="files"></a>
## files(baseDir) ⇒ <code>Promise.&lt;object.&lt;Promise.&lt;string&gt;&gt;&gt;</code>
The file helper resolves the directory filename to the contents of the included files (promised).

**Kind**: global function  
**Returns**: <code>Promise.&lt;object.&lt;Promise.&lt;string&gt;&gt;&gt;</code> - an object, containing one entry for each file.
The key of each entry is the path to the file (relative to the baseDir). The value is
a promise that resolves to the file-contents when the `.then()` method is called.  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| baseDir | <code>string</code> | the name of the directory |





## License

`customize` is published under the MIT-license. 
See [LICENSE.md](LICENSE.md) for details.

## Release-Notes
 
For release notes, see the [changelog](CHANGELOG.md)
 
## Contributing Guidelines

*This text is taken mainly from @tunnckoCore: https://github.com/tunnckoCore/coreflow-templates/blob/master/template/CONTRIBUTING.md*

Contributions are always welcome!

**Before spending lots of time on something, ask for feedback on your idea first!**

Please search issues and pull requests before adding something new to avoid duplicating
efforts and conversations.

People submitting relevant contributions to the module will be granted commit access to the repository.

### Installing

Fork and clone the repo, then `npm install` to install all dependencies and `npm test` to
ensure all is okay before you start anything.


### Testing

Tests are run with `npm test`. Please ensure all tests are passing before submitting
a pull request (unless you're creating a failing test to increase test coverage or show a problem).

### Code Style

[![standard][standard-image]][standard-url]

This repository uses [`standard`][standard-url] to maintain code style and consistency,
and to avoid style arguments.
```
npm i standard -g
```

It is intentional to don't have `standard`, `istanbul` and `coveralls` in the devDependencies. Travis will handle all that stuffs. That approach will save bandwidth also installing and development time.

[standard-image]: https://cdn.rawgit.com/feross/standard/master/badge.svg
[standard-url]: https://github.com/feross/standard
