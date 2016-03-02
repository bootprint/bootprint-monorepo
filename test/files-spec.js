var _ = require('lodash')

var files = require('../helpers-io').files
var deep = require('q-deep')
var overrider = require('../').overrider
var expect = require('chai').expect

/* global describe */
/* global it */
// /* global xit */

describe('the files-function', function () {
  var x

  it('should resolve to the contents of all contained files', function () {
    return deep(
      _.merge(
        {dir: x = files('test/fixtures/testPartials1')},
        {dir: files('test/fixtures/testPartials2')},
        overrider)
    )
      .then(function (result) {
        expect(result).to.eql({
          dir: {
            'eins.hbs': {
              path: 'test/fixtures/testPartials1/eins.hbs',
              contents: 'testPartials1/eins {{eins}}'
            },
            'zwei.hbs': {
              path: 'test/fixtures/testPartials2/zwei.hbs',
              contents: 'testPartials2/zwei {{zwei}}'
            },
            'drei.hbs': {
              path: 'test/fixtures/testPartials2/drei.hbs',
              contents: 'testPartials2/drei {{drei}}'
            }
          }
        })

        // Do this before the promise is resolved
        expect(x.valueOf()['eins.hbs'].inspect().state).to.equal('fulfilled')
        // zwei.hbs is taken from 'testPartials2' and should not be loaded from 'testPartials1'
        expect(x.valueOf()['zwei.hbs'].inspect().state).to.equal('pending')
      })
  })

  it('should work correctly with globs', function () {
    return deep(
      _.merge(
        {dir: x = files('test/fixtures/testPartials1', { glob: '*ei.hbs' })},
        {dir: files('test/fixtures/testPartials2', { glob: '*ei.hbs' })},
        overrider)
    )
      .then(function (result) {
        expect(result).to.eql({
          dir: {
            'zwei.hbs': {
              path: 'test/fixtures/testPartials2/zwei.hbs',
              contents: 'testPartials2/zwei {{zwei}}'
            },
            'drei.hbs': {
              path: 'test/fixtures/testPartials2/drei.hbs',
              contents: 'testPartials2/drei {{drei}}'
            }
          }
        })
      })
  })

  it('should return "undefined" if the path is undefined', function () {
    expect(files(undefined)).to.equal(undefined)
  })
})
