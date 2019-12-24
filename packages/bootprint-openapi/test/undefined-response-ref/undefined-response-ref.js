/*!
 * bootprint-swagger <https://github.com/nknapp/bootprint-swagger>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
// /* global before */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const expect = chai.expect

const core = require('../core')

describe('The undefined-response-ref fixture', function() {
  this.timeout(10000)
  const context = {}

  it('should fail to be built with bootprint-swagger', function() {
    return expect(core.run(require('./swagger.json'), __dirname, context)).to.be.rejected
  })
})
