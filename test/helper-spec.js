/* global describe */
/* global it */

var expect = require('chai').expect

var helpers = require('../handlebars/helpers.js')
describe("the 'htmlId'-helper'", function () {
  it("should replace illegal characters with '-'", function () {
    expect(helpers.htmlId(';/abc')).to.equal('--abc')
  })
})

describe("the 'toUpperCase'-helper'", function () {
  it('should convert strings to upper-case', function () {
    expect(helpers.toUpperCase('abc')).to.equal('ABC')
  })
})
