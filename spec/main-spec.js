/*!
 * ride-over <https://github.com/nknapp/ride-over>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
/* global expect */
/* global jasmine */
/* global beforeAll */

// /* global xdescribe */
// /* global xit */

'use strict'

var customize = require('../')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000

var ro1 = customize()
  .registerEngine('test', require('./testEngine.js'))
  .merge({
    test: {
      files: 'spec/fixtures/testPartials1',
      objects: {
        a: {x: 'x1', y: 'y1'},
        b: {x: 'x1', y: 'y1'}
      },
      leafs: {
        a: {x: 'x1', y: 'y1'},
        b: {x: 'x1', y: 'y1'}
      },
      array: ['item1']
    }
  })

describe('After loading a config', function () {
  var testResult = null
  beforeAll(function (next) {
    ro1.run()
      .then(function (result) {
        testResult = result
      })
      .done(next)
  })
  it('the `files`-function should load contents from files', function () {
    expect(testResult.test.files).toEqual({
      'eins.hbs': 'testPartials1/eins {{eins}}',
      'zwei.hbs': 'testPartials1/zwei {{zwei}}'
    })
  })
  it('object values should exist', function () {
    expect(testResult.test.objects).toEqual({
      a: {x: 'x1', y: 'y1'},
      b: {x: 'x1', y: 'y1'}
    })
  })
  it('leaf values should exist', function () {
    expect(testResult.test.leafs).toEqual({
      a: {x: 'x1', y: 'y1'},
      b: {x: 'x1', y: 'y1'}
    })
  })
  it('array values should exist', function () {
    expect(testResult.test.array).toEqual(['item1'])
  })
})

describe('After merging another config', function () {
  var testResult = null
  beforeAll(function (next) {
    ro1
      .merge({
        test: {
          files: 'spec/fixtures/testPartials2',
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
      .then(function (result) {
        testResult = result
      })
      .done(next)
  })

  it('the files should be overridden on a per-file basis', function () {
    expect(testResult.test.files).toEqual({
      'eins.hbs': 'testPartials1/eins {{eins}}',
      'zwei.hbs': 'testPartials2/zwei {{zwei}}',
      'drei.hbs': 'testPartials2/drei {{drei}}'
    })
  })
  it('object values should be deep merged', function () {
    expect(testResult.test.objects).toEqual({
      a: {x: 'x1', y: 'y1'},
      b: {x: 'x1', y: 'y2'}
    })
  })
  it('leaf values should be replaced', function () {
    expect(testResult.test.leafs).toEqual({
      a: {x: 'x1', y: 'y1'},
      b: {y: 'y2'}
    })
  })
  it('array values should exist', function () {
    expect(testResult.test.array).toEqual(['item1', 'item2'])
  })
})

describe('after loading a module', function () {
  var testResult = null
  beforeAll(function (next) {
    // Load a configuration-module
    ro1
      .load(require('./fixtures/module/index.js'))
      .run()
      .then(function (result) {
        testResult = result
      }).done(next)
  })

  it('the files should be overridden on a per-file basis', function () {
    expect(testResult.test.files).toEqual({
      'eins.hbs': 'testPartials1/eins {{eins}}',
      'zwei.hbs': 'module-partials/zwei {{zwei}}'
    })
  })
  it('object values should be deep merged', function () {
    expect(testResult.test.objects).toEqual({
      a: {x: 'x1', y: 'y1'},
      b: {x: 'x1', y: 'y2'}
    })
  })
  it('leaf values should be replaced', function () {
    expect(testResult.test.leafs).toEqual({
      a: {x: 'x1', y: 'y1'},
      b: {y: 'y2'}
    })
  })
  it('array values should exist', function () {
    expect(testResult.test.array).toEqual(['item1', 'item2'])
  })

})
