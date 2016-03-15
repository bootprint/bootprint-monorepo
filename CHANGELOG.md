# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

<a name="current-release"></a>
# Version 0.5.4 (Tue, 15 Mar 2016 13:56:51 GMT)

* [5b7fd70](https://github.com/bootprint/customize-watch/commit/5b7fd70) Adjust travis-configuration - Nils Knappmeier

# Version 0.5.3 (Tue, 15 Mar 2016 09:22:54 GMT)

* [a5c2643](https://github.com/bootprint/customize-watch/commit/a5c2643) Update .travis.yml to use mocha and all node-versions - Nils Knappmeier

# Version 0.5.2 (Tue, 15 Mar 2016 09:18:34 GMT)

* [b440320](https://github.com/bootprint/customize-watch/commit/b440320) Move repo to bootprint-org - Nils Knappmeier

# Version 0.5.1 (Tue, 15 Mar 2016 09:13:05 GMT)

* [7e47da7](https://github.com/nknapp/customize-watch/commit/7e47da7) Generate changelog with "thoughtful-release" - Nils Knappmeier
* [493ffa8](https://github.com/nknapp/customize-watch/commit/493ffa8) Add pre-commit hook to check code-style against StandardJS - Nils Knappmeier

## v0.5.0 - 2015-12-21
### Fix

* Added a `.configSchema()` method that creates the JSON schema required for input configurations. 

## v0.4.2 - 2015-11-08

### Fix

* Exceptions during configuration loading are no longer swallowed.

## v0.4.1 - 2015-10-19

### Fix

* Add `files`-property to package.json
* Added missing `helpers-io.js` file 
* Include complete testsuite of `customize` to ensure compatibility 

## v0.4.0 - 2015-10-18 

## Add

* Adapt to `customize@0.4.2`. Expose `overrider`

## v0.3.0 - 2015-10-15

### Add

* The constructor of the Customize class can be accessed via `require('customize').Customize`

### Change

* The `build()`-method is now called `buildConfig()` to allow backward compatibility
  of the `bootprint`-package. The `build()`-method of bootprint has different semantics


## v0.2.2 - 2015-10-05
### Fix

* Documentation issues cause by Thought

## v0.2.0 - 2015-10-05
### Update 

* Laxer dependency on "customize" for the initial development-versions

## v0.1.0 - 2015-10-05
### Initial version
