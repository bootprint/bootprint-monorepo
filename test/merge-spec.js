/*!
 * customize <https://github.com/nknapp/ride-over>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
// /* global before */

// /* global xdescribe */
// /* global xit */

'use strict'

var chai = require('chai')
var expect = chai.expect
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

var overrider = require('../').overrider
var Q = require('q')
var _ = require('lodash')
var deep = require('deep-aplus')(Q.Promise)

describe('The custom overrider', function () {
  it('should concatenate arrays', function () {
    expect(_.mergeWith({a: [1, 2]}, {a: [3, 4]}, overrider).a).to.deep.equal([1, 2, 3, 4])
  })
  it('should concatenate arrays within promises', function () {
    expect(deep(_.mergeWith({a: Q([1, Q(2)])}, {a: [3, 4]}, overrider).a)).to.eventually.deep.equal([1, 2, 3, 4])
  })
})
