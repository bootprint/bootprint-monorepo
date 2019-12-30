/*!
 * bootprint-unit-testing <https://github.com/bootprint/bootprint-unit-testing>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

'use strict'

const expect = require('chai').expect
const core = require('../')(require('./module.js'), __dirname)

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
