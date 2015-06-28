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
// /* global xdescribe */
// /* global xit */

'use strict'

var rideover = require('../')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000

describe('ride-over:', function () {
  var ro1 = rideover()
    .registerEngine('handlebars', require('../lib/Handlebars.js'))
    .merge({
      handlebars: {
        partials: 'spec/fixtures/testPartials1',
        templates: 'spec/fixtures/templates',
        helpers: {
          helper1: function () {
            return 'helper1'
          }
        },
        data: {
          eins: 'one',
          zwei: 'two',
          drei: 'three',
          vier: 'quatre'
        }
      }
    })

  var ro2 = ro1.merge({
    handlebars: {
      partials: 'spec/fixtures/testPartials2'
    }
  })

  // Load a configuration-module
  var ro3 = ro1.load(require('./fixtures/module/index.js'))

  it('should load and resolve a simple config', function (next) {
    ro1.run()
      .then(function (results) {
        expect(results).toEqual(
          {
            handlebars: {
              'a.md': 'Template A Eins one\nTemplate A Zwei two helper1\n',
              'b.md': 'Template B Eins one\nTemplate B Zwei two\n'
            }
          }
        )
      })
      .done(next)
  })

  it('should merge values of a configuration with new values', function (next) {
    ro2.run()
      .then(function (results) {
        expect(results).toEqual(
          {
            handlebars: {
              'a.md': 'Template A Eins one\nTemplate A Two times two is quatre helper1\n',
              'b.md': 'Template B Eins one\nTemplate B Two times two is quatre\n'
            }
          }
        )
      })
      .done(next)
  })

  it('should load values of a configuration-module', function (next) {
    ro3.run()
      .then(function (results) {
        expect(results).toEqual(
          {
            handlebars: {
              'a.md': 'Template A Eins one\nTemplate A Overridden in Module helper1\n',
              'b.md': 'Template B Eins one\nTemplate B Overridden in Module\n'
            }
          }
        )
      })
      .done(next)
  })
})
