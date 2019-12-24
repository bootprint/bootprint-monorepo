const withParent = require('../lib/withParent')

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

/* eslint-env mocha */

describe('the withParent-function', function() {
  it('should set the ._customize_custom_overrider-property on a clone', function() {
    const fn = function() {
      return 2
    }
    const clone = withParent(fn)
    expect(fn._customize_custom_overrider).to.be.undefined()
    expect(clone._customize_custom_overrider).to.be.ok()
  })

  it('should set the copy properties from the original function', function() {
    const fn = function() {
      return 2
    }
    fn.myOwnProperty = 2
    const clone = withParent(fn)
    expect(clone.myOwnProperty).to.equal(2)
  })
  // More tests are made implicitly in the other tests (merge, etc)
})
