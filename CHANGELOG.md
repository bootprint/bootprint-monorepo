# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

<a name="current-release"></a>
# Version 1.1.0 (Thu, 22 Dec 2016 21:43:36 GMT)

* [6761bff](https://github.com/bootprint/customize/commit/6761bff) IO-Helper "readFiles" for returning the contents of files as stream or Buffer (#1) - Nils Knappmeier
* [0144f70](https://github.com/bootprint/customize/commit/0144f70) Add missing dependency to "m-io" - Nils Knappmeier

# Version 1.0.1 (Tue, 20 Dec 2016 00:29:30 GMT)

* [d99a2fe](https://github.com/bootprint/customize/commit/d99a2fe) Update README - Nils Knappmeier

# Version 1.0.0 (Tue, 20 Dec 2016 00:23:05 GMT)

* [9d460b4](https://github.com/bootprint/customize/commit/9d460b4) Use m-io/fs instead of custom "listTree"-implementation - Nils Knappmeier
* [01af3e9](https://github.com/bootprint/customize/commit/01af3e9) Use "trace-and-clarify-if-possible" when running tests - Nils Knappmeier
* [4773b02](https://github.com/bootprint/customize/commit/4773b02) Use current version of deep-aplus instead of q-deep - Nils Knappmeier
* [753fad6](https://github.com/bootprint/customize/commit/753fad6) Remove the dependency to q-io and use custom implementations of the used functions. - Nils Knappmeier
* [e987d49](https://github.com/bootprint/customize/commit/e987d49) Use q-io@2 to exclude wrongly implemented "Array.prototype.find"-method - Nils Knappmeier



# Version 0.8.4 (Wed, 16 Mar 2016 21:49:32 GMT)

* [92c2ab0](https://github.com/bootprint/customize/commit/92c2ab0) Remove unnecessary debug output - Nils Knappmeier



# Version 0.8.3 (Tue, 15 Mar 2016 13:46:57 GMT)

* [2b04495](https://github.com/bootprint/customize/commit/2b04495) Adjust travis-configuration - Nils Knappmeier

# Version 0.8.2 (Tue, 15 Mar 2016 08:42:44 GMT)

* [1a1f8ed](https://github.com/bootprint/customize/commit/1a1f8ed) Move package to bootprint-org on github, remove locked branch settings - Nils Knappmeier


# Version 0.8.1 (Wed, 02 Mar 2016 18:49:17 GMT)

* [8f7dcc3](https://github.com/nknapp/customize/commit/8f7dcc3) Load the "trace"-module only for tests with node version >= 1 - Nils Knappmeier

# Version 0.8.0 (Wed, 02 Mar 2016 16:40:54 GMT)

* [5c87900](https://github.com/nknapp/customize/commit/5c87900) Added more unit tests to increase test-coverage - Nils Knappmeier
* [6972f07](https://github.com/nknapp/customize/commit/6972f07) Remove method "watch" - Nils Knappmeier
* [2580eb6](https://github.com/nknapp/customize/commit/2580eb6) Better error messages, update jsdoc, less console-output - Nils Knappmeier
* [0cdc00a](https://github.com/nknapp/customize/commit/0cdc00a) customize.withParent() now handles an undefined-argument gracefully - Nils Knappmeier
* [d406762](https://github.com/nknapp/customize/commit/d406762) Use `thoughtful-release` to enforce git-workflow - Nils Knappmeier
* [2bef8b4](https://github.com/nknapp/customize/commit/2bef8b4) Typo in JsDoc-Comment - Nils Knappmeier

## v0.7.0 - 2015-12-20

### Add

* Added a `.configSchema()` method that creates the JSON schema required for input configurations.

## v0.6.1 - 2015-11-08

### Fix

* Exception-Handling for DEBUG=customize:state

## v0.6.0 - 2015-10-22

### Add

* Include `package.json` of loaded modules in `_metadata` in configuration. (Can be access using the `buildConfig()`-method)

## v0.5.0 - 2015-10-21

### Change/Fix
 
* The `files`-function of `require('customize/helpers-io')` now always returns paths
  in POSIX-style, that are separated by slashes and not backslashed (even on Windows)
  (see [bootprint-swagger#42](https://github.com/nknapp/bootprint-swagger/issues/42#issuecomment-149803466))

## v0.4.4 - 2015-10-19

### Fix

* Fix `files`-property in package.json 

## v0.4.3 - 2015-10-19

### Fix

* Add `files`-property to package.json

## v0.4.2 - 2015-10-18

### Fix

* Remove unused dependencies
* Use `mocha`-`chai` as testing framework.

## v0.4.1 - 2015-10-16

### Fix

* Only allow strings in list of watched files. Ignore undefined file-paths.

## v0.4.0 - 2015-10-14

### Add

* The constructor of the Customize class can be accessed via `require('customize').Customize`
* Schema-Validation of engine configurations

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
