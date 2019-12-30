# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2019-12-30)


### Bug Fixes

* **package:** update stream-equal to version 1.0.0 ([6aa51dd](https://github.com/bootprint/bootprint-monorepo/commit/6aa51dda899b0b655f974a9874d959f8cc54db48))
* bump `trace-and-clarify-if-possible` to 1.0.3 ([2c87723](https://github.com/bootprint/bootprint-monorepo/commit/2c87723a5f9317fa053f0a5411d85d670e25d7b8))
* fix bootprint-unit-testing and use it in bootprint-openapi ([3d00453](https://github.com/bootprint/bootprint-monorepo/commit/3d0045315a55aa129290dacc3ae4649e3af28377))
* fix renamed functions in lodash ([7df9f81](https://github.com/bootprint/bootprint-monorepo/commit/7df9f81225a20a44c83d373eaa71c10c8ba09804))
* remove "promise.done" function call ([6266cdb](https://github.com/bootprint/bootprint-monorepo/commit/6266cdb4134b0139df00477a1afc77e9180e4cb0))


### chore

* bump dependency versions ([bd1c245](https://github.com/bootprint/bootprint-monorepo/commit/bd1c2455dd16cfc5ee46cdcfb9ca8eebec25867c))


### Features

* remove unused "customize-engine-uglify" from dependencies ([d27a0a1](https://github.com/bootprint/bootprint-monorepo/commit/d27a0a17e28ac0a95b13fad8f267036db93397d7))


### BREAKING CHANGES

* - version 9 of highlight.js highlights JSON slightly differently.
  - The class "hljs-attribute" has been replaced by "hljs-attr"
  - The prefix "lang-" of the `code`-class is not `language-`
  - Quotes are moved inside the "hljs-attr"-span.
