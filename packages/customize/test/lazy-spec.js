const chai = require('chai')
chai.use(require('chai-as-promised'))
const expect = chai.expect

const lazy = require('../lib/lazy')

/* eslint-env mocha */

describe('the lazy-function', function () {
  it('should resolve to the return value of the provided function', function () {
    return expect(lazy(() => 3)).to.eventually.equal(3)
  })

  it('should resolve the fulfillment value of the provided function if the result if a promise', function () {
    return expect(lazy(() => Promise.resolve(3))).to.eventually.equal(3)
  })

  it('should not call fn, if the then-function is not called', function () {
    var a = 0
    // use function with side-effect to determine whether is has been called
    lazy(() => a++)
    return new Promise((resolve, reject) => setTimeout(resolve, 100))
      .then(() => expect(a).to.equal(0))
  })

  it('should call fn, if the then-function is called', function () {
    var a = 0
    // use function with side-effect to determine whether is has been called
    var cond1 = lazy(() => a++).then((x) => expect(x).to.equal(0))
    var cond2 = new Promise((resolve, reject) => setTimeout(resolve, 100))
      .then(() => expect(a).to.equal(1))
    return Promise.all([cond1, cond2])
  })

  it('should call not fn more than once', function () {
    var a = 0
    // use function with side-effect to determine whether is has been called
    var promise = lazy(() => a++)
    promise.then((x) => expect(x).to.equal(0))
    promise.then((x) => expect(x).to.equal(0))
    promise.then((x) => expect(x).to.equal(0))
    promise.then((x) => expect(x).to.equal(0))
    return new Promise((resolve, reject) => setTimeout(resolve, 100))
      .then(() => expect(a).to.equal(1))
  })

  it('should reject the resulting promise if fn() throws an error', function () {
    const promise = lazy(() => { throw new Error('abc') })
    return expect(promise).to.be.rejectedWith(/abc/)
  })

  it('should reject the resulting promise if fn() returns a rejected promise', function () {
    const promise = lazy(() => Promise.reject(new Error('abc')))
    return expect(promise).to.be.rejectedWith(/abc/)
  })

  it('should return a promise that is able to catch', function () {
    return expect(lazy(() => { throw new Error('abc') }).catch((err) => err.message + '123')).to.eventually.equal('abc123')
  })

  it('should return a promise that allows to call "then" immediately', function () {
    return expect(lazy(() => 3).then((i) => i + 1)).to.eventually.equal(4)
  })
})
