# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

## Upcoming

### Add

* The constructor of the Customize class can be accessed via `require('customize').Customize`

### Change

* The `build()`-method is now called `buildConfig()` to allow backward compatibility
  of the `bootprint`-package. The `build()`-method of bootprint has different semantics

## v0.3.0 - 2015-10-05 
### Add

* Necessary methods to add support for `customize-watch`

## v0.2.3 - 2015-07-17

### Change

* If the input configuration of an engine is a Promise, it is resolved 
  before passing it to the engine's preprocessor. Inner Promises are not resolved.

## v0.2.2 - 2015-07-15

* README-Updates in 0.2.1 and 0.2.2

## v0.2.0 - 2015-07-14

### Update
- Promises created with `files()` no longer resolve to the file contents, but 
  to an object `{ path: string, contents: string }`
- The overrider-function now resolves promises if either the original value 
  or the overriding value is a promise (before, both needed to be promises).
  This allows merging of promises and values of the same type
  
### Add

- Engine preprocessors may return Promises or direct values. The result is 
  coerced to a promise dynamically.

### Devel
- Internal renaming of RideOver (old name) to Customize.


## v0.1.0 - 2015-06-29
### Update

- Engines are now expected to return an object `{ defaultConfig: object, preprocessConfig: function, run: function }`
- Expose I/O-helper functions as `require('customize/helpers-io')`.
- More rigid parameter validation in `Customizer#registerEngines(id,engine)`

## v0.0.2 - 2015-06-28
### Fix

- Fix dependencies in package.json
- Removed Handlebars-Engine (will be part of a separate package)

## v0.0.1 - 2015-06-28
### Initial version

- Abstraction of the configuration-override functionality from `bootprint`.
  Using a promise based configuration