/*!
 * customize-write-files <https://github.com/nknapp/customize-write-files>
 *
 * Copyright (c) 2019 Nils Knappmeier.
 * Released under the MIT license.
 */
const fs = require('fs-extra')
const streamCompare = require('stream-compare')

/**
 * Compares a file to the given contents. Return true, if the files differ
 * @param {string} fullPath the full path to the target file
 * @param {Readable|Buffer|string=} contents the contents to compare the file against
 */
module.exports = async function differsContent(fullPath, contents) {
  if (contents == null) {
    // null contents is viewed as "non-differing" because the file would not be overwritten by "./write"
    return false
  }

  if (typeof contents === 'string') {
    return compareString(fullPath, contents)
  } else if (Buffer.isBuffer(contents)) {
    return compareBuffer(fullPath, contents)
  } else if (typeof contents.pipe === 'function') {
    return compareStream(fullPath, contents)
  } else {
    throw new Error('Invalid data type for contents of file "' + fullPath + '": ' + contents)
  }
}

/**
 * Return true (i.e. changed) on ENOENT, rethrow otherwise
 * @param err
 * @returns {boolean}
 */
function handleError(err) {
  if (err.code === 'ENOENT') {
    return true
  }
  throw err
}

/**
 * Compares a string with a file contents. Returns true, if they differ or the file does not exist.
 * @param {string} filename the file name
 * @param {string} expectedContents the file contents
 * @returns {Promise<boolean>|boolean}
 * @private
 */
async function compareString(filename, expectedContents) {
  try {
    const actualContents = await fs.readFile(filename, { encoding: 'utf8' })
    return actualContents !== expectedContents
  } catch (err) {
    return handleError(err)
  }
}

/**
 * Compares a buffer with a file contents. Returns true, if they differ or the file does not exist.
 *
 * @param {string} filename the file name
 * @param {Buffer} expectedContents the file contents
 * @returns {Promise<boolean>|boolean}
 * @private
 */
async function compareBuffer(filename, expectedContents) {
  try {
    const actualContents = await fs.readFile(filename)
    return !expectedContents.equals(actualContents)
  } catch (err) {
    return handleError(err)
  }
}

/**
 * Compares a readable stream with a file contents. Returns true, if they differ or the file does not exist.
 * @param {string} filename the file name
 * @param {Stream} expectedContents the file contents
 * @returns {Promise<boolean>|boolean}
 * @private
 */
async function compareStream(filename, expectedContents) {
  try {
    const actualStream = fs.createReadStream(filename)
    const result = await streamCompare(expectedContents, actualStream, {
      abortOnError: true,
      compare: (a, b) => {
        return Buffer.compare(a.data, b.data) !== 0
      }
    })
    return result
  } catch (err) {
    return handleError(err)
  }
}
