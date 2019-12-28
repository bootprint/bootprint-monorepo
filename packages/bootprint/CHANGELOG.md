# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.1.0 (2019-12-28)


### Bug Fixes

* remove "promise.done" function call ([6266cdb](https://github.com/bootprint/bootprint-monorepo/commit/6266cdb4134b0139df00477a1afc77e9180e4cb0))


### Features

* remove unused "customize-engine-uglify" from dependencies ([d27a0a1](https://github.com/bootprint/bootprint-monorepo/commit/d27a0a17e28ac0a95b13fad8f267036db93397d7))





# Release notes

<a name="current-release"></a>
# Version 1.0.2 (Tue, 09 Jan 2018 21:47:03 GMT)

* [eb2d03a](https://github.com/bootprint/bootprint/commit/eb2d03a) Removed lodash dependency (copied from #22 by @jimmywarting) - Nils Knappmeier
* [2c87723](https://github.com/bootprint/bootprint/commit/2c87723) fix: bump `trace-and-clarify-if-possible` to 1.0.3 - Nils Knappmeier

# Version 1.0.1 (Fri, 23 Dec 2016 20:35:00 GMT)

* [824bb17](https://github.com/bootprint/bootprint/commit/824bb17) Update documentation (bootprint-swagger is deprecated) - Nils Knappmeier

# Version 1.0.0 (Fri, 23 Dec 2016 20:22:16 GMT)

* [2d465f5](https://github.com/bootprint/bootprint/commit/2d465f5) Prepare for 1.0 release - Nils Knappmeier

# Version 0.10.0 (Sun, 18 Dec 2016 14:05:39 GMT)

* [c8fe6b5](https://github.com/bootprint/bootprint/commit/c8fe6b5) Add support for including javascript-files with uglify-js - Nils Knappmeier

# Version 0.9.0 (Sat, 17 Dec 2016 21:59:21 GMT)

* [e61426b](https://github.com/bootprint/bootprint/commit/e61426b) Better error message when source file cannot be found - Nils Knappmeier
* [9d9c0f8](https://github.com/bootprint/bootprint/commit/9d9c0f8) Better error-message and tests for invalid number of cli-arguments - Nils Knappmeier
* [c273633](https://github.com/bootprint/bootprint/commit/c273633) Fix check for correct number of command-line arguments - Nils Knappmeier
* [0290846](https://github.com/bootprint/bootprint/commit/0290846) fixes YAMLException that occurs on some openapi yaml - Kit Plummer

# Version 0.8.5 (Tue, 15 Mar 2016 14:18:06 GMT)

* [5ec577c](https://github.com/bootprint/bootprint/commit/5ec577c) Bootprint logo is now at bootprint.github.io - Nils Knappmeier

# Version 0.8.4 (Tue, 15 Mar 2016 14:06:07 GMT)

* [22c9c48](https://github.com/bootprint/bootprint/commit/22c9c48) Adjust travis-configuration - Nils Knappmeier
* [16a5072](https://github.com/bootprint/bootprint/commit/16a5072) Move to bootprint-organization and enable ghook for StandardJS - Nils Knappmeier


## v0.8.3 - 2015-12-24

### Fix

* Fixed: Wrong entry for "main"-script in `package.json` (thanks to [@joaocosta](https://github.com/joaocosta))
* Don't use "trace" in test-cases since it requires Node 4
* Mention requirement of Node 4 for "-l" option in documentation

## v0.8.2 - 2015-12-22

### Fix

* Major documentation fixes.

## v0.8.0 - 2015-11-23

### Add

* #4: Support for yaml via `js-yaml`, thanks [@stephank](https://github.com/stephank)

## v0.7.8 - 2015-10-22

### Fix

* Better error messages in case of HTTP-errors.

## v0.7.7 - 2015-10-19

### Fix

* Update dependencies
* Add `files`-property to package.json
* Input of "getPromise" must JSON-parsed (Fixes loading swagger-specs via HTTP)

## v0.7.6 - 2015-10-17
### Fix

* Issue #7: ReferenceError: httpGet is not defined 
  

## v0.7.4, v0.7.5 - 2015-10-15
### Change

* Bootprint now uses `customize` and its engines. This is only an internal change
  and should not affect the API or the configuration. It allows for more flexibility 
  in the future.

## v0.7.3 - 2015-09-03
### Fixed

- When passing a plaing object as data, bootprint has thrown an exception 

## v0.7.2 - 2015-09-01
### Fixed

- Development-Mode did not start watcher on Handlebars partials

## v0.7.1 - 2015-07-20
### Fixed

- Compatibility code fixed...


## v0.7.0 - 2015-07-20
### Fixed

- Compatibility code for legaxy config format did not respect all possible variations.

## v0.6.0 - 2015-07-20
### Changed

- Template configuration should now be done with `options.handlebars.templates` pointing to a directory
  containing a `index.html.hbs` file (instead of using `options.handlebars.template` to point to a
  template file). Old behaviour still supported. Multiple template files might be supported in the future.
- Pre-processor configuration should now be done with `options.handlebars.preprocessor`

## v0.5.1 - 2015-06-22
### Fixed
- Fix to support legacy config format.
  This was broken in 0.5.0  

## v0.5.0 - 2015-06-22
### Changed

- Preferred path for handlebars options is now in `options.handlebars` (instead of `options`)
  with old configuration still supported
- Support for specifiying a target-filename in `options.handlebars.targetFile` (defaults to `index.html`)


## v0.4.12 - 2015-06-21
### Fixed

- Remove `request` from dependencies

## v0.4.11 - 2015-06-20
### Fixed

- Reduces total extracted size of bootprint by 9 MB, by replacing `request` by `get-promise`
- Display uncaught exceptions with proper stack-traces

## v0.4.10 - 2015-06-18
### Added

- Output used template-module versions

## v0.4.9 - 2015-06-17
### Fixed                          

- `Cannot read property 'bind' of undefined` occuring when running a template-module with preprocessor

## 0.4.7 (2015-04-07)

### Added 

- Handlebars helpers can be registered by a path to a JavaScript-file, instead of directly
    calling "require" with the file.
- &lt;spec> in command-line-interface can also be path to a template-module

## v0.4.6 (2015-04-07)

### Fixed

- [#1: cli.js not found when installing from npm or master](https://github.com/nknapp/bootprint/issues/1)
