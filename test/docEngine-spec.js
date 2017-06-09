/*!
 * customize-engine-handlebars <https://github.com/nknapp/customize-engine-handlebars>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */
'use strict'

var customize = require('customize')
var _ = require('../lib/utils')
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

var expect = chai.expect

describe('the docEngine', function () {
  var emptyEngine = null
  var hb = null
  before(function () {
    emptyEngine = customize().registerEngine('handlebars', require('../').docEngine)
    hb = emptyEngine
      .merge({
        handlebars: {
          partials: 'test/fixtures/testPartials1',
          helpers: 'test/fixtures/helpers.js',
          templates: 'test/fixtures/templates',
          data: {
            eins: 'one',
            zwei: 'two',
            drei: 'three',
            vier: 'four'
          },
          preprocessor: function (data) {
            return _.mapValues(data, function (value) {
              return '->' + value + '<-'
            })
          }
        }
      })
  })

  it('should load partials and templates and return one result per template', function () {
    return expect(hb.run()).to.eventually.deep.equal({
      'handlebars': {
        'data': {
          'drei': 'three',
          'eins': 'one',
          'vier': 'four',
          'zwei': 'two'
        },
        'hbsOptions': {},
        'helpers': [
          'test/fixtures/helpers.js'
        ],
        'partialWrapper': [],
        'partials': {
          'eins.hbs': {
            'contents': 'testPartials1/eins {{{eins}}}',
            'path': 'test/fixtures/testPartials1/eins.hbs'
          },
          'zwei.hbs': {
            'contents': 'testPartials1/zwei {{{zwei}}}',
            'path': 'test/fixtures/testPartials1/zwei.hbs'
          }
        },
        'preprocessor': [
          null
        ],
        'templates': {
          'a.md.hbs': {
            'contents': 'a.md {{>eins}}',
            'path': 'test/fixtures/templates/a.md.hbs'
          },
          'b.md.hbs': {
            'contents': 'b.md {{>zwei}} {{{helper1 zwei}}}',
            'path': 'test/fixtures/templates/b.md.hbs'
          }
        }
      }
    })
  })

  it('should collect multple helper-files and merge templates and partials', function () {
    return expect(hb.merge({
      handlebars: {
        partials: 'test/fixtures/testPartials2',
        helpers: 'test/fixtures/helpers2.js',
        templates: 'test/fixtures/templates-cleanInput',
        data: {
          eins: 'eins',
          zwei: 'zwei'
        },
        preprocessor: 'test/fixtures/preprocessor1.js'
      }

    }).run()).to.eventually.deep.equal({
      'handlebars': {
        'data': {
          'drei': 'three',
          'eins': 'eins',
          'vier': 'four',
          'zwei': 'zwei'
        },
        'hbsOptions': {},
        'helpers': [
          'test/fixtures/helpers.js',
          'test/fixtures/helpers2.js'
        ],
        'partialWrapper': [],
        'partials': {
          'drei.hbs': {
            'contents': 'testPartials2/drei {{{drei}}}',
            'path': 'test/fixtures/testPartials2/drei.hbs'
          },
          'eins.hbs': {
            'contents': 'testPartials1/eins {{{eins}}}',
            'path': 'test/fixtures/testPartials1/eins.hbs'
          },
          'zwei.hbs': {
            'contents': 'testPartials2/zwei {{{zwei}}}',
            'path': 'test/fixtures/testPartials2/zwei.hbs'
          }
        },
        'preprocessor': [
          null,
          'test/fixtures/preprocessor1.js'
        ],
        'templates': {
          'a.md.hbs': {
            'contents': '{{#each .}}{{@key}}={{.}}{{/each}}',
            'path': 'test/fixtures/templates-cleanInput/a.md.hbs'
          },
          'b.md.hbs': {
            'contents': 'b.md {{>zwei}} {{{helper1 zwei}}}',
            'path': 'test/fixtures/templates/b.md.hbs'
          }
        }
      }
    })
  })

  it('should use "null" as placeholder for helpers that are defined in a function', function () {
    var hb2 = hb.merge({
      handlebars: {
        helpers: function () {
          return {
            helper1: function (value) {
              return `helper1[${value}]`
            }
          }
        },
        data: function () {
          return ['eins', 'zwei', 'drei', 'view'].reduce((result, key) => {
            result[key] = key.split('').reverse().join('')
            return result
          }, {})
        }
      }
    })
    return expect(hb2.run().then(x => x.handlebars.helpers)).to.eventually.deep.equal([
      'test/fixtures/helpers.js',
      null
    ])
  })

  it('should not include helper- or preprocessor-modules that do not exist', function () {
    return expect(emptyEngine.merge({
      handlebars: {
        helpers: 'test/fixtures/non-existing-helper.js',
        preprocessor: 'test/fixtures/non-existing-preprocessor.js'
      }
    }).run()).to.deep.equal({})
  })

  it('should include the source-code of the partial wrapper', function () {
    var hb2 = emptyEngine.merge({
      handlebars: {
        partialWrapper: function (contents, name) {
          return '[' + name + '] ' + contents + ' [/' + name + ']'
        }
      }
    })

    return expect(hb2.run().then(x => x.handlebars.partialWrapper)).to.eventually.deep.equal([
      `function (contents, name) {\n          return '[' + name + '] ' + contents + ' [/' + name + ']'\n        }`
    ])
  })

  it('should include multiple partial wrappers', function () {
    var hb2 = emptyEngine.merge({
      handlebars: {
        partialWrapper: function (contents, name) {
          return '[' + name + '] ' + contents + ' [/' + name + ']'
        }
      }
    })
      .merge({
        handlebars: {
          partialWrapper: function (contents, name) {
            return '(' + this.parent(contents, name) + ')'
          }
        }
      })
    return expect(hb2.run().then(x => x.handlebars.partialWrapper)).to.eventually.deep.equal([
      `function (contents, name) {\n          return '[' + name + '] ' + contents + ' [/' + name + ']'\n        }`,
      `function (contents, name) {\n            return '(' + this.parent(contents, name) + ')'\n          }`
    ])
  })

  it('should include the source-locators property', function () {
    var hb2 = hb.merge({
      handlebars: {
        addSourceLocators: true
      }
    })
    return expect(hb2.run().then(x => x.handlebars.addSourceLocators)).to.eventually.equal(true)
  })
})
