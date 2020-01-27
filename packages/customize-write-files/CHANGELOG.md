# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.4](https://github.com/bootprint/bootprint-monorepo/compare/v4.0.3...v4.0.4) (2020-01-27)

**Note:** Version bump only for package customize-write-files





## [4.0.1](https://github.com/bootprint/bootprint-monorepo/compare/v4.0.0...v4.0.1) (2020-01-01)

**Note:** Version bump only for package customize-write-files





# 4.0.0 (2019-12-30)


### chore

* bump dependency versions ([bd1c245](https://github.com/bootprint/bootprint-monorepo/commit/bd1c2455dd16cfc5ee46cdcfb9ca8eebec25867c))


### BREAKING CHANGES

* - version 9 of highlight.js highlights JSON slightly differently.
  - The class "hljs-attribute" has been replaced by "hljs-attr"
  - The prefix "lang-" of the `code`-class is not `language-`
  - Quotes are moved inside the "hljs-attr"-span.





# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

<a name="current-release"></a>
# Version 3.0.1 (Tue, 19 Feb 2019 23:12:04 GMT)

* [897c263](https://github.com/bootprint/customize-write-files/commit/897c263) chore: add node 8 to travis-config - Nils Knappmeier
* [7faee02](https://github.com/bootprint/customize-write-files/commit/7faee02) refactor: use async/await, simplify code - Nils Knappmeier
* [3d2f571](https://github.com/bootprint/customize-write-files/commit/3d2f571) refactor: replace mkdirp, pify, rimraf  by fs-extra - Nils Knappmeier
* [be3dfd0](https://github.com/bootprint/customize-write-files/commit/be3dfd0) refactor: replace stream-equal by stream-compare - Nils Knappmeier


# Version 3.0.0 (Fri, 15 Feb 2019 21:09:50 GMT)

* [c859460](https://github.com/bootprint/customize-write-files/commit/c859460) chore: bump dependency versions, use nyc instead of istanbul - Nils Knappmeier
* [d2836a3](https://github.com/bootprint/customize-write-files/commit/d2836a3) chore: drop support for pre-LTS versions of NodeJS (BREAKING) - Nils Knappmeier



# Version 2.0.1 (Fri, 21 Apr 2017 08:20:48 GMT)

* [729a95d](https://github.com/bootprint/customize-write-files/commit/729a95d) Handle undefined engine results gracefully - Nils Knappmeier

# Version 2.0.0 (Sun, 09 Apr 2017 20:20:51 GMT)

* [019b3b4](https://github.com/bootprint/customize-write-files/commit/019b3b4) Remove dependency on "q" and "m-io" - Nils Knappmeier
* [167ddac](https://github.com/bootprint/customize-write-files/commit/167ddac) Bump dependencies to current versions - Nils Knappmeier
* [55e36ae](https://github.com/bootprint/customize-write-files/commit/55e36ae) BREAKING: Drop support for node before version 6 + a lot of chore - Nils Knappmeier
* [05ac7ec](https://github.com/bootprint/customize-write-files/commit/05ac7ec) Fix code style - Nils Knappmeier
* [6aa51dd](https://github.com/bootprint/customize-write-files/commit/6aa51dd) fix(package): update stream-equal to version 1.0.0 - greenkeeper[bot]
* [17efa53](https://github.com/bootprint/customize-write-files/commit/17efa53) Update dependencies to enable Greenkeeper 🌴 (#5) - greenkeeper[bot]



# Version 1.1.0 (Fri, 13 Jan 2017 12:59:22 GMT)

* [ee6dc38](https://github.com/bootprint/customize-write-files/commit/ee6dc38) More tests to increase code coverage (#3) - Nils Knappmeier
* [1ddb27f](https://github.com/bootprint/customize-write-files/commit/1ddb27f) `module.exports.changed`-function: Checks whether running the write function would change anything (#2) - Nils Knappmeier

# Version 1.0.1 (Tue, 20 Dec 2016 14:56:43 GMT)

* [5bae91f](https://github.com/bootprint/customize-write-files/commit/5bae91f) README fix - Nils Knappmeier

# Version 1.0.0 (Tue, 20 Dec 2016 14:47:29 GMT)

* [61c2f8b](https://github.com/bootprint/customize-write-files/commit/61c2f8b) Preparations for version 1.0. - Nils Knappmeier

# Version 0.1.6 (Mon, 19 Dec 2016 23:11:26 GMT)

* [258c87a](https://github.com/bootprint/customize-write-files/commit/258c87a) Refactor tests and add one for creating subdirectories - Nils Knappmeier
* [af79821](https://github.com/bootprint/customize-write-files/commit/af79821) Use m-io instead of q-io, add some JSDoc comments - Nils Knappmeier

# Version 0.1.5 (Tue, 15 Mar 2016 13:57:57 GMT)

* [f54f5d6](https://github.com/bootprint/customize-write-files/commit/f54f5d6) Adjust travis-configuration - Nils Knappmeier


# Version 0.1.4 (Tue, 15 Mar 2016 10:02:28 GMT)

* [9f16b7f](https://github.com/bootprint/customize-write-files/commit/9f16b7f) Fix test-cases - Nils Knappmeier

# Version 0.1.3 (Tue, 15 Mar 2016 09:45:48 GMT)

* [a7dc588](https://github.com/bootprint/customize-write-files/commit/a7dc588) Pre-commit hook for StandardJS, Changelog with thoughtful-release - Nils Knappmeier
* [5c11d70](https://github.com/bootprint/customize-write-files/commit/5c11d70) Move repo to bootprint-organization - Nils Knappmeier

## v0.1.2 - 2015-11-10

### Fix

* Ignore files with null and undefined contents

## v0.1.1 - 2015-11-08

### Fix

* Change method to detect whether standardjs or Thought are installed.


## v0.1.0 - 2015-10-15
### Initial version
