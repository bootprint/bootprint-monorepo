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

  it('should load the path to helper files', function () {
    return expect(hb.run().then((c) => ({helpers: c.handlebars.helpers})))
      .to.eventually.deep.equal({
        'helpers': [
          'test/fixtures/helpers.js'
        ]
      })
  })

  it('should load partials and templates augment them with callers, callees extracted comments', function () {
    return expect(hb.run().then((c) => ({partials: c.handlebars.partials, templates: c.handlebars.templates})))
      .to.eventually.deep.equal({
        'partials': {
          'eins': {
            'calledBy': [
              {
                'line': 1,
                'name': 'a.md',
                'path': 'test/fixtures/templates/a.md.hbs',
                'type': 'template'
              }
            ],
            'callsPartial': [],
            'comments': [],
            'contents': 'testPartials1/eins {{{eins}}}',
            'path': 'test/fixtures/testPartials1/eins.hbs'
          },
          'zwei': {
            'calledBy': [
              {
                'line': 1,
                'name': 'b.md',
                'path': 'test/fixtures/templates/b.md.hbs',
                'type': 'template'
              }
            ],
            'callsPartial': [],
            'comments': [],
            'contents': 'testPartials1/zwei {{{zwei}}}',
            'path': 'test/fixtures/testPartials1/zwei.hbs'
          }
        },
        'templates': {
          'a.md': {
            'callsPartial': [
              {
                'line': 1,
                'name': 'eins'
              }
            ],
            'comments': [],
            'contents': 'a.md {{>eins}}',
            'path': 'test/fixtures/templates/a.md.hbs'
          },
          'b.md': {
            'callsPartial': [
              {
                'line': 1,
                'name': 'zwei'
              }
            ],
            'comments': [],
            'contents': 'b.md {{>zwei}} {{{helper1 zwei}}}',
            'path': 'test/fixtures/templates/b.md.hbs'
          }
        }
      })
  })

  it('should load the path to multiple helper files', function () {
    return expect(hb.merge({
      handlebars: {
        helpers: 'test/fixtures/helpers2.js'
      }
    }).run().then((c) => ({helpers: c.handlebars.helpers})))
      .to.eventually.deep.equal({
        'helpers': [
          'test/fixtures/helpers.js',
          'test/fixtures/helpers2.js'
        ]
      })
  })

  it('should load merged templates and partials', function () {
    return expect(hb.merge({
      handlebars: {
        partials: 'test/fixtures/testPartials2',
        templates: 'test/fixtures/templates-cleanInput'
      }
    }).run().then((c) => ({partials: c.handlebars.partials, templates: c.handlebars.templates})))
      .to.eventually.deep.equal({
        'partials': {
          'drei': {
            'calledBy': [],
            'callsPartial': [],
            'comments': [],
            'contents': 'testPartials2/drei {{{drei}}}',
            'path': 'test/fixtures/testPartials2/drei.hbs'
          },
          'eins': {
            'calledBy': [],
            'callsPartial': [],
            'comments': [],
            'contents': 'testPartials1/eins {{{eins}}}',
            'path': 'test/fixtures/testPartials1/eins.hbs'
          },
          'zwei': {
            'calledBy': [
              {
                'line': 1,
                'name': 'b.md',
                'path': 'test/fixtures/templates/b.md.hbs',
                'type': 'template'
              }
            ],
            'callsPartial': [],
            'comments': [],
            'contents': 'testPartials2/zwei {{{zwei}}}',
            'path': 'test/fixtures/testPartials2/zwei.hbs'
          }
        },
        'templates': {
          'a.md': {
            'callsPartial': [],
            'comments': [],
            'contents': '{{#each .}}{{@key}}={{.}}{{/each}}',
            'path': 'test/fixtures/templates-cleanInput/a.md.hbs'
          },
          'b.md': {
            'callsPartial': [
              {
                'line': 1,
                'name': 'zwei'
              }
            ],
            'comments': [],
            'contents': 'b.md {{>zwei}} {{{helper1 zwei}}}',
            'path': 'test/fixtures/templates/b.md.hbs'
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

  it('should include the call-hierarchy', function () {
    return expect(hb.run().then(x => x.handlebars.callHierarchy)).to.eventually.deep.equal({
      'children': [
        {
          'name': 'a.md',
          'comments': [],
          'path': 'test/fixtures/templates/a.md.hbs',
          'type': 'template',
          'children': [
            {
              'children': [],
              'comments': [],
              'cycleFound': undefined,
              'name': 'eins',
              'path': 'test/fixtures/testPartials1/eins.hbs',
              'type': 'partial'
            }
          ]
        },
        {
          'comments': [],
          'name': 'b.md',
          'path': 'test/fixtures/templates/b.md.hbs',
          'type': 'template',
          'children': [
            {
              'children': [],
              'comments': [],
              'cycleFound': undefined,
              'name': 'zwei',
              'path': 'test/fixtures/testPartials1/zwei.hbs',
              'type': 'partial'
            }
          ]
        }
      ]
    })
  })
})
