/*!
 * customize-engine-less <https://github.com/nknapp/customize-engine-handlebars>
 *
 * Copyright (c) 2016 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

const customize = require('customize')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const expect = chai.expect

describe('customize-engine-handlebars', function() {
  it('should load less-files and specify inlude paths', function() {
    const result = customize()
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
        'main.css.map':
          '{"version":3,"sources":["test/fixtures/include/lib1.less"],"names":[],"mappings":"AAAA,KACE,UAAA,CACA","sourcesContent":["body {\\n  color: @bgcolor;\\n  font: @font;\\n}"]}'
      }
    })
  })

  it('should load override definitions from merged less-files', function() {
    const result = customize()
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
        'main.css.map':
          '{"version":3,"sources":["test/fixtures/include/lib1.less"],"names":[],"mappings":"AAAA,KACE,UAAA,CACA","sourcesContent":["body {\\n  color: @bgcolor;\\n  font: @font;\\n}"]}'
      }
    })
  })

  it('should be able to load css-files', function() {
    const result = customize()
      .registerEngine('less', require('../'))
      .merge({
        less: {
          main: './test/fixtures/main3.css'
        }
      })
      .run()

    return expect(result).to.eventually.deep.equal({
      less: {
        'main.css': 'body {\n  color: red;\n  background: black;\n}/*# sourceMappingURL=main.css.map */',
        'main.css.map':
          '{"version":3,"sources":["./test/fixtures/main3.css"],"names":[],"mappings":"AAAA;AACA;AACA;AACA","sourcesContent":["body {\\n  color: red;\\n  background: black;\\n}"]}'
      }
    })
  })
})
