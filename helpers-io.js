/*!
 * customize <https://github.com/nknapp/ride-over>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

/**
 * The file helper resolves the directory filename to the contents of the included files (promised).
 * @type {function(string,object=): Promise<object<Promise<string>>>}
 * @api public
 */
module.exports.files = require('./lib/files')
