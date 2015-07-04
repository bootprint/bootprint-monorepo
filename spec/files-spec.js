var _ = require('lodash')

var files = require('../lib/files.js')
var deep = require('q-deep')
var overrider = require('../').overrider

/* global describe */
/* global it */
/* global expect */
// /* global xit */

describe('the files-function', function () {
  var x
  it('should resolve to the contents of all contained files', function (next) {
    deep(_.merge(
      {dir: x = files('spec/fixtures/testPartials1')},
      {dir: files('spec/fixtures/testPartials2')},
      overrider
    // TODO add a real test here
    )).then(function (result) {
      expect(result).toEqual({
        dir: {
          'eins.hbs': {
            path: 'spec/fixtures/testPartials1/eins.hbs',
            contents: 'testPartials1/eins {{eins}}'
          },
          'zwei.hbs': {
            path: 'spec/fixtures/testPartials2/zwei.hbs',
            contents: 'testPartials2/zwei {{zwei}}'
          },
          'drei.hbs': {
            path: 'spec/fixtures/testPartials2/drei.hbs',
            contents: 'testPartials2/drei {{drei}}'
          }
        }
      })
      expect(x.valueOf()['eins.hbs'].inspect().state).toBe('fulfilled')
      // zwei.hbs is taken from 'testPartials2' and should not be loaded from 'testPartials1'
      expect(x.valueOf()['zwei.hbs'].inspect().state).toBe('pending')
    }).done(next)
  })
})
