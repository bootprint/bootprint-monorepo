/*!
 * customize-engine-less <https://github.com/nknapp/customize-engine-handlebars>
 *
 * Copyright (c) 2016 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
// /* global xdescribe */
/* global it */

'use strict'

var customize = require('customize')
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

var expect = chai.expect

describe('customize-engine-handlebars', function () {
  it('should load less-files and specify inlude paths', function () {
    var result = customize()
      .registerEngine('less', require('../'))
      .merge({
        less: {
          main: './test/fixtures/main.less',
          paths: './test/fixtures/include'
        }
      })
      .run()

    return expect(result).to.eventually.deep.equal({
      less: {
        'main.css': 'body{color:#f00;font:sans}/*# sourceMappingURL=main.css.map */',
        'main.css.map': '{"version":3,"sources":["test/fixtures/include/lib1.less"],"names":[],"mappings":"AAAA,KACE,UAAA,CACA","sourcesContent":["body {\\n  color: @bgcolor;\\n  font: @font;\\n}"]}'
      }
    })
  })

  it('should load override definitions from merged less-files', function () {
    var result = customize()
      .registerEngine('less', require('../'))
      .merge({
        less: {
          main: './test/fixtures/main.less',
          paths: './test/fixtures/include'
        }
      })
      .merge({
        less: {
          main: './test/fixtures/main2.less'
        }
      })
      .run()

    return expect(result).to.eventually.deep.equal({
      less: {
        'main.css': 'body{color:#0a0;font:sans}/*# sourceMappingURL=main.css.map */',
        'main.css.map': '{"version":3,"sources":["test/fixtures/include/lib1.less"],"names":[],"mappings":"AAAA,KACE,UAAA,CACA","sourcesContent":["body {\\n  color: @bgcolor;\\n  font: @font;\\n}"]}'
      }
    })
  })
})
