/*!
 * customize <https://github.com/nknapp/ride-over>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

/**
 * The file helper resolves the directory filename to the contents of the included files (promised).
 *
 *
 * @type {function(string,object=): Promise<object<Promise<string>>>}
 * @param {string} baseDir the name of the directory
 * @return {Promise<object<Promise<string>>>} an object, containing one entry for each file.
 * The key of each entry is the path to the file (relative to the baseDir). The value is
 * a promise that resolves to the file-contents when the `.then()` method is called.
 *
 * @function
 * @api public
 */
module.exports.files = require('./lib/files')
