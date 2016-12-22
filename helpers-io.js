/*!
 * customize <https://github.com/nknapp/ride-over>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

var _ = require('lodash')
var lazy = require('./lib/lazy')
var path = require('path')
var leaf = require('./lib/leaf')
var fs = require('fs')
var Q = require('q')
var qfs = require('m-io/fs')

module.exports = {
  files: files,
  readFiles: readFiles
}

/**
 * An overridable directory which resolves to the contents of all its files (recursively).
 * Returns an undefined value if the directory path is undefined.
 * @param {string|null|undefined} directoryPath the path to the directory
 * @param {object=} options
 * @param {string=} options.glob an optional glob pattern for filtering files
 * @param {boolean=} options.stream if set to true, the contents of a file will be a readable stream
 *   instead of the actual data.
 * @param {string=} options.encoding the file is expected to be encoded. This means that the
 *   instead of a Buffer, a string is returned. If the 'stream' option is set, the stream's encoding
 *   will be set via [readable.setEncoding(encoding)](https://nodejs.org/api/stream.html#stream_readable_setencoding_encoding)
 * @return {Promise<object<string,Promise<{path:string,contents:string}>>>} an object containing
 *    the relative file-path from the directoryPath as key and the file-path and the file-contents as value
 */
function readFiles (directoryPath, options) {
  if (_.isUndefined(directoryPath)) {
    return undefined
  }
  var _options = options || {}
  var result = qfs.listTree(directoryPath, isFileMatching(directoryPath, _options.glob))
    .then(function (filePaths) {
      return _(filePaths).map(function (filePath) {
        return [
          // key
          path.relative(directoryPath, filePath).split(path.sep).join('/'),
          // value
          leaf(lazy(function () {
            return {
              path: path.relative(process.cwd(), filePath),
              contents: _options.stream
                ? fs.createReadStream(filePath, { encoding: _options.encoding })
                : Q.ninvoke(fs, 'readFile', filePath, {encoding: _options.encoding})
            }
          }))
        ]
      }).zipObject().value()
    })
  result.watch = directoryPath
  return result
}

/**
 * An overridable directory which resolves to the contents of all its files (recursively).
 * Returns an undefined value if the directory path is undefined.
 * The contents of each file is a UTF-8 encoded string.
 * @param {string|null|undefined} directoryPath the path to the directory
 * @param {object=} options
 * @param {string=} options.glob an optional glob pattern for filtering files
 * @return {Promise<object<string,Promise<{path:string,contents:string}>>>} an object containing
 *    the relative file-path from the directoryPath as key and the file-path and the file-contents as value
 * @deprecated Use {@link #readFiles} instead
 */
function files (directoryPath, options) {
  return readFiles(directoryPath, {
    glob: options && options.glob,
    stream: false,
    encoding: 'utf-8'
  })
}

/**
 * Returns a guard function for list tree, that checks whether a file is a real file (not a directory)
 * and whether the path relative to a root-dir matches a glob pattern
 * @param glob
 * @param rootDir
 * @returns {Function}
 * @private
 */
function isFileMatching (rootDir, glob) {
  var mm = null
  if (glob) {
    // Save minimatch class, if glob is provided
    var Minimatch = require('minimatch').Minimatch
    mm = new Minimatch(glob)
  }
  return function (filePath, stat) {
    if (!stat.isFile()) {
      return false
    }

    // Must match the glob, if provided
    return !mm || mm.match(path.relative(rootDir, filePath))
  }
}
