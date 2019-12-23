/*!
 * bootprint-swagger <https://github.com/nknapp/bootprint-swagger>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
/* global before */
var expect = require('chai').expect
var core = require('bootprint-unit-testing')(require('../..'), __dirname)

describe('The fstab-fixture', function () {
  this.timeout(10000)
  var context = {}
  before(function () {
    return core.run(require('./schema.json'), context)
  })

  it('should have a pattern-block in the fstab-section', function () {
    expect(context.$('#definition-diskUUID .json-property-pattern .json-schema--regex').text())
      .to.equal('^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$')
  })
})
