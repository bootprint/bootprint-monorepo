# bootprint-unit-testing 

[![NPM version](https://img.shields.io/npm/v/bootprint-unit-testing.svg)](https://npmjs.com/package/bootprint-unit-testing)
[![Travis Build Status](https://travis-ci.org/bootprint/bootprint-monorepo.svg?branch=master)](https://travis-ci.org/bootprint/bootprint-monorepo)
[![Coverage Status](https://img.shields.io/coveralls/bootprint/bootprint-monorepo.svg)](https://coveralls.io/r/bootprint/bootprint-monorepo)

> Unit-testing-tools for bootprint-projects


# Installation

```
npm install bootprint-unit-testing
```

## Usage

Consider a bootprint-module that uses the following Handlebarse-template as `index.html.hbs`

```hbs
<body>
<p>name: {{name}}</p>
</body>
```


A test can be written like this: 

```js
/*!
 * bootprint-unit-testing <https://github.com/bootprint/bootprint-unit-testing>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

'use strict'

const expect = require('chai').expect
const core = require('bootprint-unit-testing')(require('./module.js'), __dirname)

describe('The bootprint-unit-testing module', function() {
  this.timeout(10000)
  const context = {}
  before(function() {
    return core.run({ name: 'Nils' }, context)
  })

  it('The output should contain the name in a <p>-tag', function() {
    expect(context.$('p').html()).to.contain('Nils')
  })
})
```

The test will run bootprint with the given module and verify the generated HTML 
using the [cheerio](https://npmjs.com/package/cheerio) library.

```
The bootprint-unit-testing module
    ✓ The output should contain the name in a <p>-tag


  1 passing (134ms)
```



# License

`bootprint-unit-testing` is published under the MIT-license.

See [LICENSE.md](LICENSE.md) for details.


# Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
# Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).