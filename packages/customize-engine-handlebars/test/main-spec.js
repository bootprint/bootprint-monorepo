/*!
 * customize-engine-handlebars <https://github.com/nknapp/customize-engine-handlebars>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */
'use strict'

const customize = require('customize')
const _ = require('../lib/utils')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const expect = chai.expect

describe('customize-engine-handlebars', function() {
  let emptyEngine = null
  let hb = null
  before(function() {
    emptyEngine = customize().registerEngine('handlebars', require('../'))
    hb = emptyEngine.merge({
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
        preprocessor: function(data) {
          return _.mapValues(data, function(value) {
            return '->' + value + '<-'
          })
        }
      }
    })
  })

  it('should load partials and templates and return one result per template', function() {
    return expect(hb.run()).to.eventually.deep.equal({
      handlebars: {
        'a.md': 'a.md testPartials1/eins ->one<-',
        'b.md': 'b.md testPartials1/zwei ->two<- helper1(->two<-)'
      }
    })
  })

  it('should watch the relevant files and directories', function() {
    return expect(hb.watched().then(watched => watched.handlebars.sort())).to.eventually.deep.equal([
      'test/fixtures/helpers.js',
      'test/fixtures/templates',
      'test/fixtures/testPartials1'
    ])
  })

  it('should watch merged directories as well', function() {
    const hb2 = hb.merge({
      handlebars: {
        partials: 'test/fixtures/testPartials2'
      }
    })
    return expect(hb2.watched().then(watched => watched.handlebars.sort())).to.eventually.deep.equal([
      'test/fixtures/helpers.js',
      'test/fixtures/templates',
      'test/fixtures/testPartials1',
      'test/fixtures/testPartials2'
    ])
  })

  it('should load helpers and data from a function', function() {
    const hb2 = hb.merge({
      handlebars: {
        helpers: function() {
          return {
            helper1: function(value) {
              return `helper1[${value}]`
            }
          }
        },
        data: function() {
          return ['eins', 'zwei', 'drei', 'view'].reduce((result, key) => {
            result[key] = key
              .split('')
              .reverse()
              .join('')
            return result
          }, {})
        }
      }
    })
    return expect(hb2.run()).to.eventually.deep.equal({
      handlebars: {
        'a.md': 'a.md testPartials1/eins ->snie<-',
        'b.md': 'b.md testPartials1/zwei ->iewz<- helper1[->iewz<-]'
      }
    })
  })

  it('should throw an exception if loading an existing helpers-module fails', function() {
    return expect(
      hb
        .merge({
          handlebars: {
            helpers: 'test/fixtures/helpers-error.js'
          }
        })
        .run()
    ).to.be.rejected
  })

  it('should throw no exception if a helper- or preprocessor-module does not exist', function() {
    return expect(
      hb
        .merge({
          handlebars: {
            helpers: 'test/fixtures/non-existing-helper.js',
            preprocessor: 'test/fixtures/non-existing-preprocessor.js'
          }
        })
        .run()
    ).not.to.be.rejected
  })

  it('should maintain the this-context of helper calls', function() {
    const hb2 = emptyEngine.merge({
      handlebars: {
        templates: 'test/fixtures/helperTemplate',
        helpers: {
          helper: function(abc) {
            return this.a + '|' + abc
          }
        },
        data: {
          context: { a: '123' },
          arg: '456'
        }
      }
    })
    return expect(hb2.run().then(x => x.handlebars.singleArgument)).to.eventually.equal('123|456')
  })

  it('should pass the the customize-configuration as "customize"-property to the options', function() {
    const hb2 = emptyEngine.merge({
      handlebars: {
        templates: 'test/fixtures/helperTemplate',
        helpers: {
          helper: (abc, options) => (options.customize.config.preprocessor ? 'yes' : 'no')
        },
        data: { context: {} }
      }
    })
    return expect(hb2.run().then(x => x.handlebars.singleArgument)).to.eventually.equal('yes')
  })

  it('should pass the the HandlebarsEnvironment as "customize.engine"-property to the options', function() {
    const hb2 = emptyEngine.merge({
      handlebars: {
        templates: 'test/fixtures/helperTemplate',
        helpers: {
          helper: (abc, options) => options.customize.engine.constructor.name
        },
        data: { context: {} }
      }
    })
    return expect(hb2.run().then(x => x.handlebars.singleArgument)).to.eventually.equal('HandlebarsEnvironment')
  })

  it('should apply the partial wrapper', function() {
    const hb2 = hb.merge({
      handlebars: {
        partialWrapper: function(contents, name) {
          return '[' + name + '] ' + contents + ' [/' + name + ']'
        }
      }
    })

    return expect(hb2.run()).to.eventually.deep.equal({
      handlebars: {
        'a.md': 'a.md [eins] testPartials1/eins ->one<- [/eins]',
        'b.md': 'b.md [zwei] testPartials1/zwei ->two<- [/zwei] helper1(->two<-)'
      }
    })
  })

  it('the parent partial wrapper should be available through `this.parent()`', function() {
    const hb2 = hb
      .merge({
        handlebars: {
          partialWrapper: function(contents, name) {
            return '[' + name + '] ' + contents + ' [/' + name + ']'
          }
        }
      })
      .merge({
        handlebars: {
          partialWrapper: function(contents, name) {
            return '(' + this.parent(contents, name) + ')'
          }
        }
      })
    return expect(hb2.run()).to.eventually.deep.equal({
      handlebars: {
        'a.md': 'a.md ([eins] testPartials1/eins ->one<- [/eins])',
        'b.md': 'b.md ([zwei] testPartials1/zwei ->two<- [/zwei]) helper1(->two<-)'
      }
    })
  })

  it('should add source-locators if the "addSourceLocator"-option is enabled"', function() {
    const hb2 = hb.merge({
      handlebars: {
        addSourceLocators: true
      }
    })
    return expect(hb2.run()).to.eventually.deep.equal({
      handlebars: {
        'a.md':
          '<sl line="1" col="0" file="test/fixtures/templates/a.md.hbs"></sl>a.md <sl line="1" col="5" file="test/fixtures/templates/a.md.hbs"></sl><sl line="1" col="0" partial="eins" file="test/fixtures/testPartials1/eins.hbs"></sl>testPartials1/eins <sl line="1" col="19" partial="eins" file="test/fixtures/testPartials1/eins.hbs"></sl>->one<-',
        'b.md':
          '<sl line="1" col="0" file="test/fixtures/templates/b.md.hbs"></sl>b.md <sl line="1" col="5" file="test/fixtures/templates/b.md.hbs"></sl><sl line="1" col="0" partial="zwei" file="test/fixtures/testPartials1/zwei.hbs"></sl>testPartials1/zwei <sl line="1" col="19" partial="zwei" file="test/fixtures/testPartials1/zwei.hbs"></sl>->two<-<sl line="1" col="14" file="test/fixtures/templates/b.md.hbs"></sl> <sl line="1" col="15" file="test/fixtures/templates/b.md.hbs"></sl>helper1(->two<-)'
      }
    })
  })

  it('should provide the name of the output-file as `options.targetFile` to helpers', function() {
    const hb2 = emptyEngine.merge({
      handlebars: {
        helpers: 'test/fixtures/helpers.js',
        templates: 'test/fixtures/templates-targetFile'
      }
    })
    return expect(hb2.run()).to.eventually.deep.equal({
      handlebars: {
        'a.md': 'targetFile: a.md',
        'subdir/b.md': 'targetFile: subdir/b.md'
      }
    })
  })

  it('should not pollute the input object with enumerable properties', function() {
    const hb2 = emptyEngine.merge({
      handlebars: {
        templates: 'test/fixtures/templates-cleanInput',
        data: {
          a: 'b'
        }
      }
    })
    return expect(hb2.run()).to.eventually.deep.equal({
      handlebars: {
        'a.md': 'a=b'
      }
    })
  })
})
