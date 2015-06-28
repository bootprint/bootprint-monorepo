var _ = require('lodash')

var directory = require('../lib/files.js')
var deep = require('q-deep')
var overrider = require('../').overrider

/* global describe */
/* global it */
// /* global expect */
// /* global xdescribe */
// /* global xit */

describe('the directory-function', function () {
  it('should resolve to the contents of all contained files', function (next) {
    deep(_.merge(
      {dir: directory('spec/fixtures/testPartials1')},
      {dir: directory('spec/fixtures/testPartials2')},
      {dir: directory('spec/fixtures/testPartialsA')},
      overrider
    // TODO add a real test here
    )).then(console.log).done(next)
  })
})
