/*!
 * customize-write-files <https://github.com/nknapp/customize-write-files>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

var Q = require('q')
var path = require('path')
var util = require('util')
var deep = require('deep-aplus')(Q.Promise)

module.exports = write
module.exports.changed = changed

/**
 * Creates a function that writes the result of the `customize#run()` method to a
 * local target directory.
 *
 * @function
 * @param {string} targetDir path to the target directory
 * @returns {function(object):string[]} return a function that writes a customize-result to the targetDir.
 *  The function takes a customize-result as first parameter and returns a promise for a list of filenames.
 *  (i.e. the files that were actually written)
 * @public
 */
function write (targetDir) {
  return function writer (customizeResult) {
    return runExecutors(customizeResult, targetDir, require('./lib/write'))
      .then(function (result) {
        return values(result)
      })
  }
}

/**
 * Creates a function that asserts that the result of the `customize#run()` method to produces the same
 * contents as found on the disk. The returned promise is rejected, if this is not the case.s
 *
 * @function
 * @param {string} targetDir path to the target directory
 * @returns {function(object):{unchanged:boolean, files: string[]}} return a function that writes a customize-result to the targetDir.
 *  The function takes a customize-result as first parameter and returns a promise for a list of filenames.
 *  (i.e. the files that were checked)
 * @public
 */
function changed (targetDir) {
  return function changeTester (customizeResult) {
    return runExecutors(customizeResult, targetDir, require('./lib/changed'))
      .then(function (result) {
        return {
          changed: values(result).indexOf(true) >= 0,
          files: result
        }
      })
  }
}

/**
 * Writes the results of a customize run into a directory in the local file-system
 * @param customizeResult
 * @param targetDir
 * @param executors
 * @private
 */
function runExecutors (customizeResult, targetDir, executors) {
  var files = mergeEngineResults(customizeResult)
  return deep(mapValues(files, function (file, filename) {
    var fullPath = path.join(targetDir, filename)
    return execute(fullPath, file.contents, executors)
  }))
}

/**
 * Return the values of an object
 * @param {object<any>} obj
 * @returns {Array<any>}
 * @private
 */
function values (obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key]
  })
}

/**
 * Apply a function to each value of an object and return the result
 * @param {object<any>} obj
 * @param {function(any, string): any} fn
 * @returns {object<any>}
 * @private
 */
function mapValues (obj, fn) {
  return Object.keys(obj).reduce(function (subresult, key) {
    subresult[key] = fn(obj[key], key)
    return subresult
  }, {})
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
 * @param {object<object<string>>} customizeResult
 * @return {object<{engine: string, contents: string}>}
 * @private
 */
function mergeEngineResults (customizeResult) {
  var result = {}
  Object.keys(customizeResult).forEach(function (engineName) {
    var files = customizeResult[engineName]
    Object.keys(files).forEach(function (filename) {
      // Existing file in different engine
      var existingFile = result[filename]
      if (existingFile) {
        throw new Error(
          util.format('File "%s" occurs in two engines: "%s" and "%s"', filename, existingFile.engine, engineName)
        )
      }
      result[filename] = { engine: engineName, contents: files[filename] }
    })
  })
  return result
}

/**
 * Write a stream, buffer or string to a file and return a promised for the finished operation
 *
 * @param {string} filename the filename
 * @param {Buffer|string|Stream.Readable} contents
 * @param executors
 * @returns {Promise<string|boolean>|undefined} a Promise for the filename
 * @private
 */
function execute (filename, contents, executors) {
  // Ignore undefined contents (intentional "double equals")
  if (contents == null) {
    return undefined
  }
  if (typeof contents === 'string') {
    return executors.string(filename, contents)
  } else if (Buffer.isBuffer(contents)) {
    return executors.buffer(filename, contents)
  } else if (typeof contents.pipe === 'function') {
    return executors.stream(filename, contents)
  } else {
    throw new Error('Invalid data type for contents of file "' + filename + '": ' + contents)
  }
}

