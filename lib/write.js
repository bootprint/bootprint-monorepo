/*!
 * customize-write-files <https://github.com/nknapp/customize-write-files>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

var fs = require('fs')
var Q = require('q')
var qfs = require('m-io/fs')
var path = require('path')

/**
 * Functions for actually writing different types of contents
 * @type {{stream: (Stream):Promise<void>, buffer: function(Buffer):Promise<void>, string: function(string):Promise<void> }}
 */
module.exports = {
  stream: writeStream,
  buffer: writeBufferOrString,
  string: writeBufferOrString
}

/**
 * Writes a buffer or a string to a file and returns a promise for the completed operation
 * @param {string} filename the file name
 * @param {string|Buffer} contents the file contents
 * @returns {Promise<string>}
 * @private
 */
function writeBufferOrString (filename, contents) {
  return qfs.makeTree(path.dirname(filename))
    .then(function () {
      return qfs.write(filename, contents)
    })
    .then(function () {
      return filename
    })
}

/**
 * Write a Readable to a file and
 * @param {string} filename
 * @param {stream.Readable} contents
 * @private
 * @returns {Promise<string>} a promise for the filename
 */
function writeStream (filename, contents) {
  return qfs.makeTree(path.dirname(filename))
    .then(function () {
      var defer = Q.defer()
      contents.pipe(fs.createWriteStream(filename))
        .on('finish', function () {
          defer.resolve(filename)
        })
        .on('error', /* istanbul ignore next */ function (err) {
          defer.reject(err)
        })
      return defer.promise
    })
}
