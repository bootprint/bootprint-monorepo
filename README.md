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

We can do this, by merging another configuration:

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
  .get("files")
  .done(console.log)
```

Notice the additional `.merge()`-call? Its input is also passed to the engine's preprocessor,
so now we get two objects containing files and their contents and those are merged by the 
[`.merge`-function of the lodash library](https://lodash.com/docs#merge), so that in the above 
example, the property `a.md` is replace by the value in the second configuration. So the output 
of this example is

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

### Global





* * *

##### exports() 

Create a new Customize object with an empty configuration

**Returns**: `Customize`


#### Class: Customize
The main class. The heart of Customize

**withParent**:  , Wrap a function so that if it overrides another function, that function will
be available as `this.parent`
**leaf**:  , Create a promise that is regarded as leaf in the configuration tree.
That means, that the overrider is not resolving this promise when overriding values.
Promised object values will not be merged but replaced.
**overrider**: `customOverrider` , The custom-overrider used by Customize
##### Customize.registerEngine(id, engine) 

Register an engine with a default config

**Parameters**

**id**: `string`, the identifier of the engine (also within the config)

**engine**: `function`, Register an engine with a default config


##### Customize.merge(config) 

Creates a new instance of Customize. The config of the current Customize
are used as default values and are overridden by the config provided as parameter.

**Parameters**

**config**: `object`, config overriding the config of this builder

**Returns**: `Customize`, new Builder instance

##### Customize.load(builderFunction) 

Inherit configuration config from another module.
`require("Customize-modulename")` usually return a function(builder)
and this functions needs to be passed in here.
A new Customize will be returned that overrides the current config
with config from the builderFunction's result.

**Parameters**

**builderFunction**: `function`, that receives a Customize as paramater
 and returns a Customize with changed configuration.

**Returns**: `Customize`, the result of the builderFunction

##### Customize.build() 

Build the configured Bootprint-instance.

**Returns**: `Promise.&lt;object&gt;`, a promise for the whole configuration

##### Customize.run() 

Run each engine with its part of the config.


##### Customize.customOverrider(a, b, propertyName) 

Customize has predefined override rules for merging configs.

* If the overriding object has a `_customize_custom_overrider` function-property,
  it is called to perform the merger.
* Arrays are concatenated
* Promises are resolved and the results are merged

**Parameters**

**a**: , the overridden value

**b**: , the overriding value

**propertyName**: , the property name

**Returns**: `*`, the merged value



* * *












## IO/Helpers


### Global





* * *

##### files(baseDir) 

The file helper resolves the directory filename to the contents of the included files (promised).

**Parameters**

**baseDir**: `string`, the name of the directory

**Returns**: `Promise.&lt;object.&lt;Promise.&lt;string&gt;&gt;&gt;`, an object, containing one entry for each file.
The key of each entry is the path to the file (relative to the baseDir). The value is
a promise that resolves to the file-contents when the `.then()` method is called.



* * *













## License

`customize` is published under the MIT-license. 
See [LICENSE.md](LICENSE.md) for details.

## Contributing Guidelines

<!-- Taken from @tunnckoCore: https://github.com/tunnckoCore/coreflow-templates/blob/master/template/CONTRIBUTING.md -->

Contributions are always welcome!

**Before spending lots of time on something, ask for feedback on your idea first!**

Please search issues and pull requests before adding something new to avoid duplicating
efforts and conversations.


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
