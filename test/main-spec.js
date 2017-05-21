/*!
 * thought-plugin-bootprint <https://github.com/bootprint/thought-plugin-bootprint>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

const thoughtPluginBootprint = require('../')
const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

describe('thought-plugin-bootprint:', function () {
  it('should be executed', function () {
    expect(thoughtPluginBootprint()).to.equal('thoughtPluginBootprint')
  })
})
