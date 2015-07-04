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
var customize = require('customize')
var Q = require('q')
var deep = require('q-deep')
var debug = require('debug')('customize-engine-handlebars:index')
var path = require('path')

var contents = function (partials) {
  return _(partials).mapKeys(stripHandlebarsExt).mapValues(_.property('contents')).value()
}
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
  preprocessConfig: function preprocessConfig (config) {
    return config.then(function (config) {
      var helpers = config.helpers
      try {
        // If this is a string, treat if as module to be required
        helpers = _.isString(helpers) ? require(path.resolve(helpers)) : helpers
      } catch (e) {
        console.log('Ignoring missing hb-helpers module: ' + helpers)
        helpers = undefined
      }
      // The helpers file may export an object or a promise for an object.
      // Or a function returning and object or a promise for an object.
      // If it's a function, use the result instead.
      helpers = _.isFunction(helpers) ? helpers() : helpers

      /**
       * @type {string|function}
       */
      var preprocessor = config.preprocessor
      try {
        // If this is a string, treat if as module to be required
        preprocessor = _.isString(preprocessor) ? require(path.resolve(preprocessor)) : preprocessor
      } catch (e) {
        console.log('Ignoring missing hb-preprocessor module: ' + preprocessor)
        preprocessor = undefined
      }
      return {
        partials: files(config.partials),
        helpers: helpers,
        templates: files(config.templates),
        data: config.data,
        preprocessor: preprocessor && customize.withParent(preprocessor),
        hbsOptions: config.hbsOptions
      }
    })

  },

  /**
   * Runs the handlebars-engine. The engine is
   * @param config
   */
  run: function run (config) {
    return Q(config.preprocessor ? config.preprocessor(config.data) : config.data)
      // Resolve any new promises
      .then(deep)
      .then(function (data) {
        var hbs = Handlebars.create()

        var partials = contents(config.partials)
        hbs.registerPartial(partials)
        hbs.registerHelper(config.helpers)
        var templates = contents(config.templates)

        return _.mapValues(templates, function (template) {
          var fn = hbs.compile(template, config.hbsOptions)
          debug('hbs-data', data)
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
function stripHandlebarsExt (value, key) {
  return key.replace(/\.(handlebars|hbs)$/, '')
}
