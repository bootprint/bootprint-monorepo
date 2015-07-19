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
   * @typedef {object} CustomizeHandlebarsConfig
   * The default configuration for the handlebars engine
   * @property {string} partials path to a partials directory. Each `.hbs`-file in the directory (or in the tree)
   *   is registered as partial by its name (or relative path), without the `.hbs`-extension.
   * @property {string|object|function} if this is an object it is assumed to be a list of helper functions,
   *   if this is function it is assumed to return an object of helper functions, if this is a string,
   *   it is assumed to be the path to a module returning either an object of a function as above.
   * @property {string} template path to a directory containing templates. Handlebars is called with each `.hbs`-file
   *   as template. The result of the engine consists of an object with a property for each template and the
   *   Handlebars result for this template as value.
   * @property {object} data a javascript-object to use as input for handlebars
   * @property {function|string} preprocessor a function that takes the input data as first parameter and
   *   transforms it into another object or the promise for an object. It the input data is a promise itself,
   *   is resolved before calling this function. If the preprocessor is overridden, the parent
   *   preprocessor is available with `this.parent(data)`
   * @property {object} hbsOptions options to pass to `Handlebars.compile`.
   * @api public
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
    var helpers = config.helpers
    try {
      // If this is a string, treat if as module to be required
      helpers = _.isString(helpers) ? require(path.resolve(helpers)) : helpers
    } catch (e) {
      debug('Ignoring missing hb-helpers module: ' + helpers)
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
      debug('Ignoring missing hb-preprocessor module: ' + preprocessor)
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
        debug('Data after preprocessing:', data)
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
