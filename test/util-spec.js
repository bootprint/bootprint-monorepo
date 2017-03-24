var util = require('../lib/util')

var chai = require('chai')
chai.use(require('dirty-chai'))
var expect = chai.expect

/* eslint-env mocha */

describe('the mapValues-function', function () {
  it('should apply a function to each value', function () {
    expect(util.mapValues({a: 1, b: 2, c: 3}, function (value, key) {
      return key + value
    })).to.deep.equal({a: 'a1', b: 'b2', c: 'c3'})
  })

  it('should retrieve a propert from each value, if the second paramete is a string', function () {
    expect(util.mapValues({a: {x: 1}, b: {x: 2}, c: {x: 3}}, 'x')).to.deep.equal({a: 1, b: 2, c: 3})
  })

  it('should clone an object, if no iteratee is set', function () {
    var original = {a: {x: 1}, b: {x: 2}, c: {x: 3}}
    var clone = util.mapValues(original)
    expect(clone, 'should be deep equal').to.deep.equal(original)
    expect(clone, 'should not be identical').not.to.equal(original)
  })

  it('should always return the object if it is null or undefined', function () {
    expect(util.mapValues(null, 'a')).to.be.null()
    expect(util.mapValues(undefined, 'a')).to.be.undefined()
  })

  it('should throw an error, if the iteratee is neither undefined, a function, nor a string', function () {
    expect(function () {
      util.mapValues({a: 1, b: 2, c: 3}, 2)
    }).to.throw(Error)
  })
})
