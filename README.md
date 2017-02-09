# bootprint-unit-testing 

[![NPM version](https://badge.fury.io/js/bootprint-unit-testing.svg)](http://badge.fury.io/js/bootprint-unit-testing)
[![Travis Build Status](https://travis-ci.org/bootprint/bootprint-unit-testing.svg?branch=master)](https://travis-ci.org/bootprint/bootprint-unit-testing)
[![Coverage Status](https://img.shields.io/coveralls/bootprint/bootprint-unit-testing.svg)](https://coveralls.io/r/bootprint/bootprint-unit-testing)


> Unit-testing-tools for bootprint-projects


# Installation

```
npm install bootprint-unit-testing
```

## Usage

Using the following module 

<pre><code>

├── module.js
└─┬ templates
  └── index.html.hbs
</code></pre>

A test can be written like this: 

```js
/*!
 * bootprint-unit-testing <https://github.com/bootprint/bootprint-unit-testing>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
/* global before */
// /* global xit */

'use strict'

var expect = require('chai').expect
var core = require('bootprint-unit-testing')(require('./module.js'), __dirname)

describe('The bootprint-unit-testing module', function () {
  this.timeout(10000)
  var context = {}
  before(function () {
    return core.run({ name: 'Nils' }, context)
  })

  it('The output should contain the name in a <p>-tag', function () {
    expect(context.$('p').html()).to.contain('Nils')
  })
})
```

The test will run bootprint with the given module and verify the generated HTML 
using the [cheerio](https://npmjs.com/package/cheerio) library.

```
The bootprint-unit-testing module
    ✓ The output should contain the name in a <p>-tag


  1 passing (376ms)
```



## License

`bootprint-unit-testing` is published under the MIT-license. 
See [LICENSE.md](LICENSE.md) for details.

## Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
## Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).