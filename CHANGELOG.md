# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

## v0.2.0 - 2015-08-03

### Change

- The `promised-handlebars` module is now used to provide support for
  helpers that return promises.

## v0.1.0 - 2015-07-19

### Documentation

- Comprehensive README example

### Added

- Options for `Handlebars#compile()` can be provided via the `hbsOptions`-property 
  in the configuration
- Allow `helpers` to be a function that returns a helper-object (or a promise for 
  a helper object)
- Allow `helpers` to be the path to a Javascript-module

### Change
- If the input configuration of a Customize-engine is a Promise, it is resolved 
  before passing it to the engine's preprocessor. Inner Promises are not resolved.
- Replaced filesystem access via `q-io/fs` by `require`.  Try to avoid browser
  incompatibilities, althought `customize` does not support browsers yet.

## v0.0.1 - 2015-06-29
### Initial version

- Extracted handlebars-engine from `customize`