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

const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const overrider = require('../').overrider
const mergeWith = require('lodash.mergewith')
const deep = require('deep-aplus')(Promise)

describe('The custom overrider', function() {
  it('should concatenate arrays', function() {
    expect(mergeWith({ a: [1, 2] }, { a: [3, 4] }, overrider).a).to.deep.equal([1, 2, 3, 4])
  })
  it('should concatenate arrays within promises', function() {
    expect(
      deep(mergeWith({ a: Promise.resolve([1, Promise.resolve(2)]) }, { a: [3, 4] }, overrider).a)
    ).to.eventually.deep.equal([1, 2, 3, 4])
  })
})
