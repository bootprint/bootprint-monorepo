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


##  API-reference

# Global





* * *

### exports() 

Create a new Customize object with an empty configuration

**Returns**: `Customize`


## Class: Customize
The main class. The heart of Customize

**withParent**:  , The main class. The heart of Customize
**leaf**:  , The main class. The heart of Customize
**overrider**: `customOverrider` , The main class. The heart of Customize
### Customize.registerEngine(id, engine) 

Register an engine with a default config

**Parameters**

**id**: `string`, the identifier of the engine (also within the config)

**engine**: `function`, Register an engine with a default config


### Customize.merge(config) 

Creates a new instance of Customize. The config of the current Customize
are used as default values and are overridden by the config provided as parameter.

**Parameters**

**config**: `object`, config overriding the config of this builder

**Returns**: `Customize`, new Builder instance

### Customize.load(builderFunction) 

Inherit configuration config from another module.
`require("Customize-modulename")` usually return a function(builder)
and this functions needs to be passed in here.
A new Customize will be returned that overrides the current config
with config from the builderFunction's result.

**Parameters**

**builderFunction**: `function`, that receives a Customize as paramater
 and returns a Customize with changed configuration.

**Returns**: `Customize`, the result of the builderFunction

### Customize.build() 

Build the configured Bootprint-instance.

**Returns**: `Promise.&lt;object&gt;`, a promise for the whole configuration

### Customize.run() 

Run each engine with its part of the config.


### Customize.customOverrider(a, b, propertyName) 

Customize has predefined override rules for merging configs.

* If the overriding object has a `_ro_custom_overrider` function-property,
  it is called to perform the merger.
* Arrays are concatenated
* Promises are resolved and the results are merged

**Parameters**

**a**: , the overridden value

**b**: , the overriding value

**propertyName**: , the property name

**Returns**: `*`



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
