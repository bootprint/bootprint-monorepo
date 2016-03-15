/*!
 * customize-engine-handlebars <https://github.com/nknapp/customize-engine-handlebars>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
// /* global xdescribe */
/* global xit */

'use strict'

var customize = require('customize')
var _ = require('lodash')
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

var expect = chai.expect

var hb = customize()
  .registerEngine('handlebars', require('../'))
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

describe('customize-engine-handlebars', function () {
  it('should load partials and templates and return one result per template', function () {
    return expect(hb.run()).to.eventually.deep.equal({
      handlebars: {
        'a.md': 'a.md testPartials1/eins ->one<-',
        'b.md': 'b.md testPartials1/zwei ->two<- helper1(->two<-)'
      }
    })
  })

  xit('should throw an exception if loading an existing helpers module fails', function () {})
})
