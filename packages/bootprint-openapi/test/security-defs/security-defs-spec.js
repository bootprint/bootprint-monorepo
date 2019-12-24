/*!
 * bootprint-swagger <https://github.com/nknapp/bootprint-swagger>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
/* global before */
const expect = require('chai').expect
const core = require('../core')

describe('The securityDefinitions fixture', function() {
  this.timeout(10000)
  const context = {}
  before(function() {
    return core.run(require.resolve('./swagger.yaml'), __dirname, context)
  })
  it('should have the securityDefinitions description converted to HTML', function() {
    expect(context.$('.security-property-type').html()).to.contain('<strong>')
  })
})
