/*!
 * customize-engine-handlebars <https://github.com/nknapp/customize-engine-handlebars>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
// /* global it */
// /* global xdescribe */
// /* global xit */

'use strict'

var customize = require('customize')
var _ = require('lodash')

var hb = customize()
  .registerEngine('handlebars', require('../'))
  .merge({
    handlebars: {
      partials: 'spec/fixtures/testPartials1',
      helpers: {
        helper1: function (abc) {
          return 'helper1(' + abc + ')'
        }
      },
      templates: 'spec/fixtures/templates',
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

describe('customize-engine-handlebars', function () {
  it('should load partials and templates and return one result per template', function (next) {
    hb.run().tap(function (result) {
      expect(result).toEqual({
        handlebars: {
          'a.md': 'a.md testPartials1/eins one',
          'b.md': 'b.md testPartials1/zwei two helper1([object Object])'
        }
      });

    }).done(next)
    // body
  });
})
