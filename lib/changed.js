/*!
 * customize-write-files <https://github.com/nknapp/customize-write-files>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

var fs = require('fs')
var pify = require('pify')
var streamEqual = pify(require('stream-equal'))
var readFile = pify(fs.readFile)

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
  return readFile(filename, {encoding: 'utf8'})
    .then(
      fileContents => fileContents !== contents,
      handleError
    )
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
  return readFile(filename)
    .then(
      (fileContents) => !contents.equals(fileContents),
      handleError
    )
}

/**
 * Compares a readable stream with a file contents. Returns true, if they differ or the file does not exist.
 * @param {string} filename the file name
 * @param {Buffer} contents the file contents
 * @returns {Promise<boolean>|boolean}
 * @private
 */
function compareStream (filename, contents) {
  return streamEqual(contents, fs.createReadStream(filename))
    .then(
      result => !result,
      handleError
    )
}
