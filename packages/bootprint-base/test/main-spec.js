/*!
 * bootprint-base <https://github.com/bootprint/bootprint-base>
 *
 * Copyright (c) 2016 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
/* global before */

var chai = require('chai')
chai.use(require('dirty-chai'))
var expect = chai.expect
var path = require('path')
var qfs = require('m-io/fs')
var fs = require('fs')

var tmpDir = path.join(__dirname, '..', 'test-output')

before(function () {
  return qfs.removeTree(tmpDir)
        .then(function () {
          return qfs.makeTree(tmpDir)
        })
})

function outputFile (filename) {
  return fs.readFileSync(path.join(tmpDir, filename), {encoding: 'utf-8'}).trim()
}

describe('The bootprint-base module', function () {
  this.timeout(20000)

  it('should include the bootstrap javascript in the output', function () {
    return require('bootprint')
            .load(require('../'))
            .merge({
              handlebars: {
                partials: path.resolve(__dirname, 'fixtures', 'handlebars', 'partials')
              }
            })
            .build({
              tabs: [
                    {title: 'one', contents: 'tab one'},
                    {title: 'two', contents: 'tab two', active: true},
                    {title: 'three', contents: 'tab three'}
              ]
            }, path.join(tmpDir, 'tabs'))
            .generate()
            .then(function () {
              var bundle = outputFile('tabs/bundle.js')
              expect(bundle).to.match(/jQuery JavaScript Library/)
              expect(bundle).to.match(/http:\/\/getbootstrap\.com/)

              var jqueryIndex = bundle.indexOf('jQuery requires a window with a document')
              var bootstrapIndex = bundle.indexOf("Bootstrap's JavaScript requires jQuery")
              expect(jqueryIndex < bootstrapIndex, 'jQuery must be included before Bootstrap').to.be.true()
            })
  })
})
