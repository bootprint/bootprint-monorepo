/*!
 * customize-write-files <https://github.com/nknapp/customize-write-files>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

var fs = require('fs')
var Q = require('q')
var qfs = require('q-io/fs')
var path = require('path')
var debug = require('debug')('customize-write-files:index')

module.exports = write

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
    return customizeWriteFiles(customizeResult, targetDir)
  }
}

/**
 * Writes the results of a customize run into a directory in the local file-system
 * @param customizeResultls
 * @param targetDir
 * @private
 */
function customizeWriteFiles (customizeResult, targetDir) {
  // Merge files from different engine's results
  var mergedFiles = {}
  Object.keys(customizeResult).forEach(function (engineName) {
    var files = customizeResult[engineName]
    Object.keys(files).forEach(function (filename) {
      if (mergedFiles[filename]) {
        throw new Error('File "' + filename + '" occurs in two engines: "' +
          mergedFiles[filename].engine +
          '" and "' + engineName + '"')
      }
      mergedFiles[filename] = {
        engine: engineName,
        contents: files[filename]
      }
    })
  })

  return Q
    .all(Object.keys(mergedFiles).map(function (filename) {
      // write contents to disc
      var fullPath = path.join(targetDir, filename)
      return qfs.makeTree(path.dirname(fullPath))
        .then(function () {
          return writePromised(fullPath, mergedFiles[filename].contents)
        })
    }))
    .then(function (filenames) {
      debug('Written files ', filenames)
      return filenames
    })
}
/**
 * Write a stream, buffer or string to a file and return a promised for the finished operation
 *
 * @param filename
 * @param {Buffer|string|Stream.Readable} contents
 * @returns {*}
 * @private
 */

function writePromised (filename, contents) {
  // Ignore undefined contents
  if (contents == null) {
    return
  }
  if (typeof contents === 'string' || Buffer.isBuffer(contents)) {
    return writeBufferOrString(filename, contents)
  } else if (typeof contents.pipe === 'function') {
    return writeStream(filename, contents)
  } else {
    throw new Error('Invalid data type for contents of file "' + filename + '": ' + contents)
  }
}

/**
 * Writes a buffer or a string to a file and returns a promise for the completed operation
 * @param filename
 * @returns {*}
 * @private
 */
function writeBufferOrString (filename, contents) {
  // qfs.write has issues in node 4.1.0, so we create a simple wrapper using
  // Q.defer() and fs.writeFile()
  var defer = Q.defer()

  fs.writeFile(filename, contents, defer.makeNodeResolver())
  return defer.promise.then(function () {
    return filename
  })
}

/**
 * Write a Readable to a file and
 * @param filename
 * @param contents
 * @private
 * @returns {*}
 */
function writeStream (filename, contents) {
  var defer = Q.defer()
  contents.pipe(fs.createWriteStream(filename))
    .on('finish', function () {
      defer.resolve(filename)
    })
    .on('error', function (err) {
      defer.reject(err)
    })
  return defer.promise
}
