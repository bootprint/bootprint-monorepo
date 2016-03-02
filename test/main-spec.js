/*!
 * ride-over <https://github.com/nknapp/ride-over>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
/* global before */
/* global after */

// /* global xdescribe */
// /* global xit */

'use strict'

require('trace')

var expect = require('chai').expect
var customize = require('../')

var minimalEngine = {
  run: function (obj) {
    return obj
  }
}

var testee = customize()
  .registerEngine('test', require('./testEngine.js'))
  .merge({
    test: {
      files: 'test/fixtures/testPartials1',
      objects: {
        a: {x: 'x1', y: 'y1'},
        b: {x: 'x1', y: 'y1'}
      },
      leafs: {
        a: {x: 'x1', y: 'y1'},
        b: {x: 'x1', y: 'y1'}
      },
      array: ['item1'],
      withParent: function (value) {
        return value + 3
      }
    // TODO: Tests for promises and functions
    }
  })

describe('After loading a config', function () {
  this.timeout(10000)

  var testResult = null
  before(function () {
    return testee.run().then(function (result) {
      testResult = result
    })
  })

  it('the `files`-function should load contents from files', function () {
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
  it('the object values should exist', function () {
    expect(testResult.test.objects).to.eql({
      a: {x: 'x1', y: 'y1'},
      b: {x: 'x1', y: 'y1'}
    })
  })
  it('the leaf values should exist', function () {
    expect(testResult.test.leafs).to.eql({
      a: {x: 'x1', y: 'y1'},
      b: {x: 'x1', y: 'y1'}
    })
  })
  it('the array values should exist', function () {
    expect(testResult.test.array).to.eql(['item1'])
  })
  it('the withParent-function should exist', function () {
    expect(testResult.test.withParent(5)).to.equal(8)
  })
})

describe('After merging another config', function () {
  var testResult = null
  before(function () {
    return testee
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
          array: ['item2'],
          withParent: function (value) {
            return this.parent(value) + 3
          }
        }
      })
      .run()
      .then(function (result) {
        testResult = result
      })
  })

  it('the files should be overridden on a per-file basis', function () {
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
  it('object values should be deep merged', function () {
    expect(testResult.test.objects).to.eql({
      a: {x: 'x1', y: 'y1'},
      b: {x: 'x1', y: 'y2'}
    })
  })
  it('leaf values should be replaced', function () {
    expect(testResult.test.leafs).to.eql({
      a: {x: 'x1', y: 'y1'},
      b: {y: 'y2'}
    })
  })
  it('array values should exist', function () {
    expect(testResult.test.array).to.eql(['item1', 'item2'])
  })
  it('the withParent-function should call the parent', function () {
    expect(testResult.test.withParent(5)).to.equal(11)
  })
})

describe('after loading a module', function () {
  var testResult = null
  before(function () {
    // Load a configuration-module
    return testee
      .load(require('./fixtures/module/index.js'))
      .run()
      .then(function (result) {
        testResult = result
      })
  })

  it('the files should be overridden on a per-file basis', function () {
    return expect(testResult.test.files).to.eql({
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
  it('object values should be deep merged', function () {
    return expect(testResult.test.objects).to.eql({
      a: {x: 'x1', y: 'y1'},
      b: {x: 'x1', y: 'y2'}
    })
  })
  it('leaf values should be replaced', function () {
    return expect(testResult.test.leafs).to.eql({
      a: {x: 'x1', y: 'y1'},
      b: {y: 'y2'}
    })
  })
  it('array values should exist', function () {
    return expect(testResult.test.array).to.eql(['item1', 'item2'])
  })
  it('the withParent-function should properly call the parent-function', function () {
    return expect(testResult.test.withParent(5)).to.equal(16)
  })
})

describe('the "merge"-method', function () {
  it('should not fail merging an empty object', function () {
    testee
      .merge({
        test: {}
      })
      .run()
  })

  it('should throw an error if the config data for an engine that is not registered', function () {
    return expect(function () {
      return testee.merge({test2: {}})
    }).to.throw(Error)
  })

  it('should throw an error if a config is undefined', function () {
    return expect(function () {
      return customize()
        .registerEngine('test', require('./testEngine.js'))
        // TODO: Is this really necessary? It could also treat an undefined config as empty object
        .merge(undefined)
    }).to.throw(Error)
  })

  it('should throw an error if the merge-configuration does not match the schema', function () {
    return expect(customize()
      .registerEngine('test', require('./testEngine.js'))
      .merge({
        test: {
          files: 123
        }
      })
      .buildConfig()).to.be.rejectedWith(Error, /Error while validating Customize configuration/)
  })

  it('should handle a missing "preprocessConfig" and "schema" gracefully', function () {
    return expect(customize().registerEngine('test', minimalEngine).merge({
      test: {
        abc: 'abc'
      }
    }).buildConfig()).to.eventually.deep.equal({
      test: {
        abc: 'abc'
      }
    })
  })
})

describe('The "registerEngine"-method', function () {
  it('should throw errors  if a non-string engine-id is used', function () {
    return expect(function () {
      return customize().registerEngine(123, require('./testEngine.js'))
    }).to.throw(Error, /Engine-id must be a string/)
  })

  it('should throw errors if a engine-id starts with "_"', function () {
    return expect(function () {
      return customize().registerEngine('_test', require('./testEngine.js'))
    }).to.throw(Error, /Engine-id may not start with an underscore/)
  })

  it('should throw errors if an engine does not have a run method', function () {
    return expect(function () {
      // noinspection JSCheckFunctionSignatures
      return customize().registerEngine('test', {})
    }).to.throw(Error, /needs a run method/)
  })

  it('should throw errors if an engine-id is already used', function () {
    return expect(function () {
      return customize()
        .registerEngine('test', require('./testEngine.js'))
        .registerEngine('test', require('./testEngine.js'))
    }).to.throw(Error, /already registered/)
  })

  it('should use an empty default config if none is provided', function () {
    return expect(customize().registerEngine('test', minimalEngine).run()).to.eventually.deep.equal({test: {}})
  })
})

describe('The "configSchema"-method', function () {
  it('should return a combined configuration schema for the all engines', function () {
    var co = customize()
      .registerEngine('test', require('./testEngine.js'))
      .registerEngine('test2', minimalEngine)

    return expect(co.configSchema()).to.deep.equal({
      'id': 'http://json-schema.org/draft-04/schema#',
      '$schema': 'http://json-schema.org/draft-04/schema#',
      'type': 'object',
      'properties': {
        'test': {
          type: 'object',
          properties: {
            'files': {
              type: 'string'
            },
            'objects': {
              type: 'object'
            },
            'leafs': {
              type: 'object'
            },
            'array': {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            withParent: {
              type: 'function'
            }
          }
        },
        'test2': {
          'description': 'No expicit schema has been provided for this engine',
          'type': 'object'
        }
      }
    })
  })
})

describe('The "load"-method', function () {
  it('should handle a missing "package" gracefully', function () {
    var result = customize()
      .registerEngine('test', minimalEngine)
      .load(require('./fixtures/module/nopackage.js'))
      .run()
    return expect(result).to.eventually.deep.equals({
      test: {}
    })
  })
})

describe('the "run"-method', function () {
  var twoEngines = customize()
    .registerEngine('test1', minimalEngine)
    .registerEngine('test2', minimalEngine)
    .merge({
      'test1': 'result1',
      'test2': 'result2'
    })

  it('should only run a single engine, if the "onlyEngine"-option is set', function () {
    return expect(twoEngines.run({onlyEngine: 'test1'})).to.eventually.deep.equal({
      'test1': 'result1',
      'test2': undefined
    })
  })

  it('should only run all engines, if the "onlyEngine"-option is not set', function () {
    return expect(twoEngines.run()).to.eventually.deep.equal({
      'test1': 'result1',
      'test2': 'result2'
    })
  })
})

describe('the "watched"-method', function () {
  it('should return an array for all watch directories and files (promised)', function () {
    var watched = testee
      .registerEngine('test2', require('./testEngine'))
      .merge({
        'test': {
          files: 'test/fixtures/testPartials2'
        },
        'test2': {
          files: 'test/fixtures/templates'
        }
      })
      .watched()

    return expect(watched).to.eventually.deep.equal({
      'test': [
        'test/fixtures/testPartials1',
        'test/fixtures/testPartials2'
      ],
      'test2': [
        'test/fixtures/templates'
      ]
    })
  })
})

describe('Debug output', function () {
  before(function () {
    customize.debugState.enabled = true
    customize.debug.enabled = true
  })
  it('should not disturb normal operation', function () {
    console.log('custom', require('debug')('customize:state').enabled)
    return expect(testee
      .load(require('./fixtures/module/index.js'))
      .run()
      .get('test')
      .get('files')
    ).to.eventually.deep.equal({
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

  after(function () {
    customize.debugState.enabled = false
    customize.debug.enabled = false
  })
})
