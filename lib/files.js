var _ = require("lodash");

var Q = require("q");
require("q-lazy");
var qfs = require("q-io/fs");

var path = require("path");
var deep = require("q-deep");
var rideOver = require("../");
var debug = require("debug")("rideover:files");

/**
 * An overridable directory which resolves to the contents of all its files (recursively).
 * Returns an undefined value if the directory path is undefined.
 * @param {string} directoryPath the path to the directory
 * @param {object} options
 * @param {string} options.glob an optional glob pattern for filtering files
 * @return {Promise<object<string,Promise<string>>>} an object containing the file-path as key and the file-contents as value
 */
function files(directoryPath, options) {
  if (_.isUndefined(directoryPath)) {
    return undefined;
  }
  var options = options || {};
  var result = qfs.listTree(directoryPath, isFileMatching(directoryPath, options.glob))
    .then(function (filePaths) {
      return _(filePaths).map(function (filePath) {
        return [
          path.relative(directoryPath, filePath),
          rideOver.leaf(Q.lazy(function () {
            console.log("reading", filePath);
            return qfs.read(filePath)
          }))
        ]
      }).zipObject().value();
    });
  result.watch = directoryPath
  return result;
}

/**
 * Returns a guard function for list tree, that checks whether a file is a real file (not a directory)
 * and whether the path relative to a root-dir matches a glob pattern
 * @param glob
 * @param rootDir
 * @returns {Function}
 */
function isFileMatching(rootDir, glob) {
  var mm = null;
  if (glob) {
    // Save minimatch class, if glob is provided
    var Minimatch = require("minimatch").Minimatch;
    mm = new Minimatch(glob);
  }
  return function (filePath, stat) {
    if (!stat.isFile()) {
      return false;
    }

    // Must match the glob, if provided
    return !mm || mm.match(path.relative(rootDir, filePath));
  };
}

module.exports = files;
