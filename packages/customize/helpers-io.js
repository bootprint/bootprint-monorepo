/*!
 * customize <https://github.com/bootprint/customize>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

const lazy = require('./lib/lazy')
const path = require('path')
const leaf = require('./lib/leaf')
const fs = require('fs')
const util = require('./lib/util')
const glob = require('glob')

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
function readFiles(directoryPath, options) {
  if (directoryPath == null) {
    return undefined
  }
  const _options = options || {}
  // Collect all files
  const result = util
    .asPromise(cb => glob(_options.glob || '**', { cwd: directoryPath, mark: true }, cb))
    .then(function(relativePaths) {
      const set = relativePaths
        // Ignore directories
        .filter(relativePath => !relativePath.match(/\/$/))
        // Convert to a set based on relative paths
        // (i.e. {'dir/file.txt': 'dir/file.txt'}
        .reduce((set, relativePath) => {
          set[relativePath] = relativePath
          return set
        }, {})

      // Create lazy promises (only resolve when .then() is called) acting
      // as leafs (do not dive inside when merging)
      return util.mapValues(set, relativePath => {
        const fullPath = path.resolve(directoryPath, relativePath)
        return leaf(
          lazy(() => {
            return {
              path: path.relative(process.cwd(), fullPath),
              contents: _options.stream
                ? fs.createReadStream(fullPath, { encoding: _options.encoding })
                : util.asPromise(cb => fs.readFile(fullPath, { encoding: _options.encoding }, cb))
            }
          })
        )
      })
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
function files(directoryPath, options) {
  return readFiles(directoryPath, {
    glob: options && options.glob,
    stream: false,
    encoding: 'utf-8'
  })
}
