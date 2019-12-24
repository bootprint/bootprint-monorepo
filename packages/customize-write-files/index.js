/*!
 * customize-write-files <https://github.com/nknapp/customize-write-files>
 *
 * Copyright (c) 2019 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

const path = require('path')
const util = require('util')
const deep = require('deep-aplus')(Promise)

module.exports = write
module.exports.changed = changed

/**
 * Creates a function that writes the result of the `customize#run()` method to a
 * local target directory.
 *
 * @function
 * @param {string} targetDir path to the target directory
 * @returns {function(object):Promise<string[]>} return a function that writes a customize-result to the targetDir.
 *  The function takes a customize-result as first parameter and returns a promise for a list of filenames.
 *  (i.e. the files that were actually written)
 * @public
 */
function write(targetDir) {
  return async function writeResult(customizeResult) {
    const result = await mapFiles(customizeResult, targetDir, require('./lib/write'))
    return values(result)
  }
}

/**
 * Creates a function that asserts that the result of the `customize#run()` method to produces the same
 * contents as found on the disk. The returned promise is rejected, if this is not the case.s
 *
 * @function
 * @param {string} targetDir path to the target directory
 * @returns {function(object):Promise<{unchanged:boolean, files: string[]}>} return a function that writes a customize-result to the targetDir.
 *  The function takes a customize-result as first parameter and returns a promise for a list of filenames.
 *  (i.e. the files that were checked)
 * @public
 */
function changed(targetDir) {
  return async function changeTester(customizeResult) {
    const result = await deep(mapFiles(customizeResult, targetDir, require('./lib/changed')))
    return {
      changed: values(result).indexOf(true) >= 0,
      files: result
    }
  }
}

/**
 * Map the merged files in the customize-result onto a function a promised object of values.
 *
 * The type T is the return value of the callback (promised)
 *
 * @param {object<object<string|Buffer|Readable|undefined>>} customizeResult
 * @param {function(fullpath: string, contents: (string|Buffer|Readable|undefined)):Promise<T>} callback functions that is called for each file
 * @return {Promise<object<T>>}
 */
async function mapFiles(customizeResult, targetDir, callback) {
  const files = mergeEngineResults(customizeResult)
  const results = mapValues(files, (file, filename) => {
    // Write each file
    const fullpath = path.join(targetDir, filename)
    return callback(fullpath, file.contents)
  })
  return deep(results)
}

/**
 * Apply a function to each value of an object and return the result
 * @param {object<any>} obj
 * @param {function(any, string): any} fn
 * @returns {object<any>}
 * @private
 */
function mapValues(obj, fn) {
  return Object.keys(obj).reduce(function(subresult, key) {
    subresult[key] = fn(obj[key], key)
    return subresult
  }, {})
}

/**
 * Return the values of an object
 * @param {object<any>} obj
 * @returns {Array<any>}
 * @private
 */
function values(obj) {
  return Object.keys(obj).map(function(key) {
    return obj[key]
  })
}

/**
 * Merge the per-engine structure (`{engine1: { file1: contents1 }, {engine2: { file2: contents2 } }`
 * into a single object
 *
 * ```js
 * {
 *   file1: { engine: 'engine1', contents: contents1 },
 *   file2: { engine: 'engine2', contents: contents2 }`
 * }
 * @param {object<object<string|Buffer|Readable|undefined>>} customizeResult
 * @return {object<{engine: string, contents: (string|Buffer|Readable|undefined)}>}
 * @private
 */
function mergeEngineResults(customizeResult) {
  const result = {}
  Object.keys(customizeResult).forEach(function(engineName) {
    const files = customizeResult[engineName]
    if (files) {
      Object.keys(files).forEach(function(filename) {
        // Existing file in different engine
        const existingFile = result[filename]
        if (existingFile) {
          throw new Error(
            util.format('File "%s" occurs in two engines: "%s" and "%s"', filename, existingFile.engine, engineName)
          )
        }
        result[filename] = { engine: engineName, contents: files[filename] }
      })
    }
  })
  return result
}
