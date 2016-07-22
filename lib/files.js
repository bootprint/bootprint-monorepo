var _ = require('lodash')

var lazy = require('./lazy')
var path = require('path')
var leaf = require('./leaf.js')
var fs = require('fs')
var Q = require('q')

/**
 * An overridable directory which resolves to the contents of all its files (recursively).
 * Returns an undefined value if the directory path is undefined.
 * @param {string} directoryPath the path to the directory
 * @param {object} options
 * @param {string} options.glob an optional glob pattern for filtering files
 * @return {Promise<object<string,Promise<{path:string,contents:string}>>>} an object containing
 *    the relative file-path from the directoryPath as key and the file-path and the file-contents as value
 */
function files (directoryPath, options) {
  if (_.isUndefined(directoryPath)) {
    return undefined
  }
  var _options = options || {}
  var result = listTree(directoryPath, isFileMatching(directoryPath, _options.glob))
    .then(function (filePaths) {
      return _(filePaths).map(function (filePath) {
        return [
          // key
          path.relative(directoryPath, filePath).split(path.sep).join('/'),
          // value
          leaf(lazy(function () {
            return {
              path: path.relative(process.cwd(), filePath),
              contents: Q.ninvoke(fs, 'readFile', filePath, { encoding: 'utf-8' })
            }
          }))
        ]
      }).zipObject().value()
    })
  result.watch = directoryPath
  return result
}

/**
 * Custom implementation of [q-io/fs#listTree](http://documentup.com/kriskowal/q-io#listtreepath-guardpath-stat)
 * to avoid dependency on q-io
 * @param {string} directoryPath the base path
 * @param {function(string,fs.Stats):boolean} filter a function that returns true, false or null to show that a file
 *  should be included or ignored and that a directory should be ignored completely (null)
 * @returns {Promise<string[]>} a promise for the collector, that is fulfilled after traversal
 */
function listTree (directoryPath, filter) {
  return walk(directoryPath, filter, [])
}

/**
 * Walk a directory tree, collect paths of files in an Array and return a Promise for the fulfilled action
 * @param {string} directoryPath the base path
 * @param {function(string,fs.Stats):boolean} filter a function that returns true, false or null to show that a file
 *  should be included or ignored and that a directory should be ignored completely (null)
 * @param {string[]} collector array to collect the filenames into
 * @returns {Promise<string[]>} a promise for the collector, that is fulfilled after traversal
 */
function walk (directoryPath, filter, collector) {
  var defer = Q.defer()
  fs.stat(directoryPath, function (err, stat) {
    if (err) {
      return defer.reject(err)
    }
    var filterResult = filter(directoryPath, stat)
    if (filterResult) {
      collector.push(directoryPath)
    }
    if (stat.isDirectory()) {
      // false/true => iterate directory
      if (filterResult !== null) {
        fs.readdir(directoryPath, function (err, filenames) {
          if (err) {
            return defer.reject(err)
          }
          var paths = filenames.map(function (name) {
            return path.join(directoryPath, name)
          })
          // Walk all files/subdirs
          Q.all(paths.map(function (filepath) {
            return walk(filepath, filter, collector)
          }))
            .then(function () {
              defer.fulfill(collector)
            })
        })
      }
    } else {
      // No recursive call with a file
      defer.fulfill(collector)
    }
  })
  return defer.promise
}

/**
 * Returns a guard function for list tree, that checks whether a file is a real file (not a directory)
 * and whether the path relative to a root-dir matches a glob pattern
 * @param glob
 * @param rootDir
 * @returns {Function}
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

module.exports = files
