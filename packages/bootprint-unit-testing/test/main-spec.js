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

const expect = require('chai').expect
const core = require('../')(require('./fixtures/module.js'), __dirname)

describe('The bootprint-unit-testing module', function() {
  this.timeout(10000)
  const context = {}
  before(function() {
    return core.run({ name: 'Nils' }, context)
  })

  it('should pass a cheerio-elements as `context.$`', function() {
    expect(context.$('p').html()).to.contain('Nils')
  })
})
