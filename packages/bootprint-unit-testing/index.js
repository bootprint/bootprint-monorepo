/*!
 * bootprint-unit-testing <https://github.com/bootprint/bootprint-unit-testing>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */

const qfs = require('m-io/fs')
const cheerio = require('cheerio')
const path = require('path')

/**
 * Create a new tester-object for a given bootprint-module
 * @param bootprintModule
 * @param dir the directory(-name) from which this function is called
 * @returns {{run: runBootprint}}
 */
module.exports = function(bootprintModule, dir) {
  /**
   * Run bootprint with a fixture and return a cheerio wrapper for the index.html
   * @param inputFile the input (json or yaml) passed into bootprint
   * @param context the test context to store cheerio in
   * @returns {*}
   */
  function runBootprint(inputFile, context) {
    const targetDir = path.join('test-output', path.basename(dir))
    return require('bootprint')
      .load(bootprintModule)
      .build(inputFile, targetDir)
      .generate()
      .then(function() {
        return qfs.read(path.join(targetDir, 'index.html'))
      })
      .then(function(indexHtml) {
        context.$ = cheerio.load(indexHtml)
      })
  }

  return {
    run: runBootprint
  }
}
