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
var customize = require("customize");
var Q = require("q");
var deep = require("q-deep");
var qfs = require("q-io/fs");

module.exports = {
  /**
   * The default configuration for the handlebars engine
   */
  defaultConfig: {
    partials: {},
    helpers: undefined,
    templates: {},
    data: {},
    preprocessor: _.identity,
    hbsOptions: {}
  },

  /**
   *
   * @param {Promise<object>} config the input configuration that is written by the user
   * @return {Promise<object>} the configuration that is passed into the merging process
   *    later expected as parameter to the main function of the engine
   */
  preprocessConfig: function preprocessConfig(config) {
    return config.then(function (config) {
        var helpers = qfs.exists(config.helpers)
          .then(function (exists) {
            if (exists) {
              var helpers = require(config.helpers);
              // The helpers file may export an object or a promise for an object.
              // Or a function returning and object or a promise for an object.
              // If it's a function, use the result instead.
              return _.isFunction(helpers) ? helpers() : helpers;
            }
          });
        return {
          partials: files(config.partials),
          helpers: helpers,
          templates: files(config.templates),
          data: config.data,
          preprocessor: config.preprocessor && customize.withParent(config.preprocessor),
          hbsOptions: config.hbsOptions
        }
      }
    )
  },

  /**
   * Runs the handlebars-engine. The engine is
   * @param config
   */
  run: function run(config) {
    return Q(config.preprocessor(config.data))
      // Resolve any new promises
      .then(deep)
      .then(function (data) {
        var hbs = Handlebars.create()
        hbs.registerPartial(_.mapKeys(config.partials, stripHandlebarsExt))
        hbs.registerHelper(config.helpers)
        var templates = _.mapKeys(config.templates, stripHandlebarsExt)

        return _.mapValues(templates, function (template) {
          var fn = hbs.compile(template, config.hbsOptions)
          return fn(data)
        })
      })
  }
}

/**
 * Use in mapkeys to remove the hbs extension
 * @param {*} value ignored
 * @param {string} key the original filename
 * @returns {string} the filename without .hbs
 */
function stripHandlebarsExt(value, key) {
  return key.replace(/\.(handlebars|hbs)$/, '')
}
