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
var streamEqual = require('stream-equal')

/**
 * Functions for comparing contents with the current filesystem
 * @type {{stream: (Stream):Promise<void>, buffer: function(Buffer):Promise<void>, string: function(string):Promise<void> }}
 */
module.exports = {
  stream: compareStream,
  buffer: compareBuffer,
  string: compareString
}

/**
 * Return true (i.e. changed) on ENOENT, rethrow otherwise
 * @param err
 * @returns {boolean}
 */
function handleError (err) {
  if (err.code === 'ENOENT') {
    return true
  }
  throw err
}

/**
 * Compares a string with a file contents. Returns true, if they differ or the file does not exist.
 * @param {string} filename the file name
 * @param {string} contents the file contents
 * @returns {Promise<boolean>|boolean}
 * @private
 */
function compareString (filename, contents) {
  return qfs.read(filename)
    .then(function (fileContents) {
      return fileContents !== contents
    }, handleError)
}

/**
 * Compares a buffer with a file contents. Returns true, if they differ or the file does not exist.
 *
 * @param {string} filename the file name
 * @param {Buffer} contents the file contents
 * @returns {Promise<boolean>|boolean}
 * @private
 */
function compareBuffer (filename, contents) {
  return qfs.read(filename, 'b')
    .then(function (fileContents) {
      if (Buffer.prototype.equals) {
        return !contents.equals(fileContents)
      } else {
        // http://stackoverflow.com/questions/30701220/how-to-compare-buffer-objects-in-nodejs
        // Compatibility node 0.10
        var areBuffersEqual = function (bufA, bufB) {
          var len = bufA.length
          if (len !== bufB.length) {
            return false
          }
          for (var i = 0; i < len; i++) {
            if (bufA.readUInt8(i) !== bufB.readUInt8(i)) {
              return false
            }
          }
          return true
        }
        return !areBuffersEqual(contents, fileContents)
      }
    }, handleError)
}

/**
 * Compares a readable stream with a file contents. Returns true, if they differ or the file does not exist.
 * @param {string} filename the file name
 * @param {Buffer} contents the file contents
 * @returns {Promise<boolean>|boolean}
 * @private
 */
function compareStream (filename, contents) {
  return Q.nfcall(streamEqual, contents, fs.createReadStream(filename))
    .then(function (result) {
      return !result
    }, handleError)
}
