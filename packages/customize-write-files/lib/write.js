/*!
 * customize-write-files <https://github.com/nknapp/customize-write-files>
 *
 * Copyright (c) 2019 Nils Knappmeier.
 * Released under the MIT license.
 */
const fs = require('fs-extra')
const path = require('path')

/**
 * Write a stream, buffer or string to a file.
 *
 * A rejected promise is returned if the "contents" is neither.
 *
 * @param {string} fullPath the full path to the target file
 * @param {Readable|Buffer|string=} contents the contents to write to the file
 * @return {Promise<string|undefined>} the name of the file that has been written or an undefined promise if no file is written
 */
module.exports = async function writeAnyContentsToFile(fullPath, contents) {
  if (contents == null) {
    return undefined
  }

  await fs.mkdirp(path.dirname(fullPath))

  if (typeof contents === 'string' || Buffer.isBuffer(contents)) {
    await fs.writeFile(fullPath, contents)
  } else if (typeof contents.pipe === 'function') {
    await writeStream(fullPath, contents)
  } else {
    throw new Error('Invalid data type for contents of file "' + fullPath + '": ' + contents)
  }
  return fullPath
}

/**
 * Write a Readable to a file and
 * @param {string} filename
 * @param {stream.Readable} contents
 * @private
 * @returns {Promise<string>} a promise for the filename
 */
async function writeStream(filename, contents) {
  await new Promise((resolve, reject) => {
    contents
      .pipe(fs.createWriteStream(filename))
      .on('finish', function() {
        resolve(filename)
      })
      .on(
        'error',
        /* istanbul ignore next */ function(err) {
          reject(err)
        }
      )
  })
  return filename
}
