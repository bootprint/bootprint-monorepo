/*!
 * thought-plugin-bootprint <https://github.com/nknapp/thought-plugin-bootprint>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */

const path = require('path')

/**
 * Describe your module here
 * @public
 */
module.exports = function thoughtPluginBootprint (customize) {
  return customize
    .load(require('thought-plugin-jsdoc'))
    .merge({
      handlebars: {
        helpers: require.resolve('./helpers.js'),
        partials: path.join(__dirname, 'partials'),
        templates: path.join(__dirname, 'templates')
      }
    })
}

module.exports.package = require('../package')
