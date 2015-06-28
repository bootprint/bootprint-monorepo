/*!
 * customize-engine-handlebars <https://github.com/nknapp/customize-engine-handlebars>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

var Handlebars = require('handlebars')
var _ = require('lodash')
var files = require('customize/helpers-io').files

module.exports = {
  /**
   * The default configuration for the handlebars engine
   */
  defaultConfig: {
    partials: {}, helpers: {}, templates: {}, data: {}, preprocessor: _.identity
  },

  /**
   *
   * @param {Promise<object>} config the input configuration that is written by the user
   * @return {Promise<object>} the configuration that is used passed into the merging process
   *    later expected as parameter to the main function of the engine
   */
  preprocessConfig: function preprocessConfig (config) {
    return config.then(function (config) {
      return {
        partials: files(config.partials),
        helpers: config.helpers,
        templates: files(config.templates),
        data: config.data
      }
    })
  },

  run: function run (config) {
    var hbs = Handlebars.create()
    hbs.registerPartial(_.mapKeys(config.partials, stripHandlebarsExt))
    hbs.registerHelper(config.helpers)

    var templates = _.mapKeys(config.templates, stripHandlebarsExt)

    return _.mapValues(templates, function (template) {
      var fn = hbs.compile(template)
      return fn(config.data)
    })
  }
}

/**
 * Use in mapkeys to remove the hbs extension
 * @param {*} value ignored
 * @param {string} key the original filename
 * @returns {string} the filename without .hbs
 */
function stripHandlebarsExt (value, key) {
  return key.replace(/\.(handlebars|hbs)$/, '')
}
