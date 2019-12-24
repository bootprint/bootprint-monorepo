/*!
 * customize-watch <https://github.com/nknapp/ride-over>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
/* global before */

// /* global xdescribe */
// /* global xit */

'use strict'

var expect = require('chai').expect
var customize = require('../')

var ro1 = customize()
  .registerEngine('test', require('./testEngine.js'))
  .merge({
    test: {
      files: 'test/fixtures/testPartials1',
      objects: {
        a: { x: 'x1', y: 'y1' },
        b: { x: 'x1', y: 'y1' }
      },
      leafs: {
        a: { x: 'x1', y: 'y1' },
        b: { x: 'x1', y: 'y1' }
      },
      array: ['item1']
      // TODO: Tests for promises and functions
    }
  })

describe('After loading a config', function() {
  this.timeout(10000)

  var testResult = null
  before(function() {
    return ro1.run().then(function(result) {
      testResult = result
    })
  })

  it('the `files`-function should load contents from files', function() {
    expect(testResult.test.files).to.eql({
      'eins.hbs': {
        path: 'test/fixtures/testPartials1/eins.hbs',
        contents: 'testPartials1/eins {{eins}}'
      },
      'zwei.hbs': {
        path: 'test/fixtures/testPartials1/zwei.hbs',
        contents: 'testPartials1/zwei {{zwei}}'
      }
    })
  })
  it('object values should exist', function() {
    expect(testResult.test.objects).to.eql({
      a: { x: 'x1', y: 'y1' },
      b: { x: 'x1', y: 'y1' }
    })
  })
  it('leaf values should exist', function() {
    expect(testResult.test.leafs).to.eql({
      a: { x: 'x1', y: 'y1' },
      b: { x: 'x1', y: 'y1' }
    })
  })
  it('array values should exist', function() {
    expect(testResult.test.array).to.eql(['item1'])
  })
})

describe('After merging another config', function() {
  var testResult = null
  before(function() {
    return ro1
      .merge({
        test: {
          files: 'test/fixtures/testPartials2',
          objects: {
            b: {
              y: 'y2'
            }
          },
          leafs: {
            b: {
              y: 'y2'
            }
          },
          array: ['item2']
        }
      })
      .run()
      .then(function(result) {
        testResult = result
      })
  })

  it('the files should be overridden on a per-file basis', function() {
    expect(testResult.test.files).to.eql({
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
    })
  })
  it('object values should be deep merged', function() {
    expect(testResult.test.objects).to.eql({
      a: { x: 'x1', y: 'y1' },
      b: { x: 'x1', y: 'y2' }
    })
  })
  it('leaf values should be replaced', function() {
    expect(testResult.test.leafs).to.eql({
      a: { x: 'x1', y: 'y1' },
      b: { y: 'y2' }
    })
  })
  it('array values should exist', function() {
    expect(testResult.test.array).to.eql(['item1', 'item2'])
  })
})

describe('after loading a module', function() {
  var testResult = null
  before(function() {
    // Load a configuration-module
    return ro1
      .load(require('./fixtures/module/index.js'))
      .run()
      .then(function(result) {
        testResult = result
      })
  })

  it('the files should be overridden on a per-file basis', function() {
    expect(testResult.test.files).to.eql({
      'eins.hbs': {
        path: 'test/fixtures/testPartials1/eins.hbs',
        contents: 'testPartials1/eins {{eins}}'
      },
      'zwei.hbs': {
        path: 'test/fixtures/module/files/zwei.hbs',
        contents: 'module-partials/zwei {{zwei}}'
      }
    })
  })
  it('object values should be deep merged', function() {
    expect(testResult.test.objects).to.eql({
      a: { x: 'x1', y: 'y1' },
      b: { x: 'x1', y: 'y2' }
    })
  })
  it('leaf values should be replaced', function() {
    expect(testResult.test.leafs).to.eql({
      a: { x: 'x1', y: 'y1' },
      b: { y: 'y2' }
    })
  })
  it('array values should exist', function() {
    expect(testResult.test.array).to.eql(['item1', 'item2'])
  })
})
