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

The following example demonstrates how to use this module:

```js

```

This will generate the following output

```

```

##  API-reference



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
