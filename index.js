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
var promisedHandlebars = require('promised-handlebars')

var contents = function (partials) {
  return _(partials).mapKeys(stripHandlebarsExt).mapValues(_.property('contents')).value()
}

/**
 * @typedef {object} CustomizeHandlebarsConfig
 * The default configuration for the handlebars engine
 * @property {string} partials path to a partials directory. Each `.hbs`-file in the directory (or in the tree)
 *   is registered as partial by its name (or relative path), without the `.hbs`-extension.
 * @property {string|object|function} helpers if this is an object it is assumed to be a list of helper functions,
 *   if this is function it is assumed to return an object of helper functions, if this is a string,
 *   it is assumed to be the path to a module returning either an object of a function as above.
 * @property {string} templates path to a directory containing templates. Handlebars is called with each `.hbs`-file
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

/**
 * @typedef {object} InternalHbsConfig the internal configuration object that
 *   is passed into the merge function.
 * @property {object<{path:string,contents:string}>} partials the Handlebars partials that should be registered
 * @property {object<function> helpers the Handlebars helpers that should be registered
 * @property {object<{path:string,contents:string}>} templates
 * @property {object} data the data object to render with Handlebars
 * @property {function(object): (object|Promise<object>)} preprocessor
 *    preprocessor for the handlebars data
 * @property {object} hbsOptions options to pass to `Handlebars.compile`.
 * @private
 */

/**
 * The export of this module is the customize-engine-handlebars
 */
module.exports = {

  defaultConfig: {
    partials: {},
    helpers: {},
    templates: {},
    data: {},
    preprocessor: _.identity,
    hbsOptions: {}
  },

  /**
   *
   * @param {Promise<CustomizeHandlebarsConfig>} config the input configuration that is written by the user
   * @return {Promise<InternalHbsConfig>} the configuration that is passed into the merging process
   *    later expected as parameter to the main function of the engine
   */
  preprocessConfig: function preprocessConfig (config) {
    var helpers = config.helpers
    // If this is a string, treat if as module to be required
    try {
      if (_.isString(helpers)) {
        // Attempt to find module without resolving the contents
        // If there is an error, the module does not exist (which
        // is ignored at the moment)
        // If there is no error, the module should be loaded and error while loading
        // the module should be reported
        require.resolve(path.resolve(helpers));
      }
    } catch(e) {
      debug('Ignoring missing hb-helpers module: ' + helpers)
      helpers = undefined;
    }

    // Require module if needed
    helpers =  _.isString(helpers) ? require(path.resolve(helpers)) : helpers

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
   * Runs Handlebars with the data object
   * @param {InternalHbsConfig} config the configuration
   */
  run: function run (config) {
    // Run the preprocessor
    return Q(config.preprocessor(config.data))
      // Resolve any new promises
      .then(deep)
      // Process the result with Handlebars
      .then(function (data) {
        debug('Data after preprocessing:', data)
        // We use the `promised-handlebars` module to
        // support helpers returning promises
        var hbs = promisedHandlebars(Handlebars)

        var partials = contents(config.partials)
        hbs.registerPartial(partials)
        hbs.registerHelper(config.helpers)
        var templates = contents(config.templates)

        return _.mapValues(templates, function (template) {
          var fn = hbs.compile(template, config.hbsOptions)
          debug('hbs-data', data)
          var result = fn(data)
          debug('fn(data) =' + data)
          return result
        })
      })
  }
}

/**
 * Use in mapkeys to remove the hbs extension
 * @param {*} value ignored
 * @param {string} key the original filename
 * @returns {string} the filename without .hbs
 * @private
 */
function stripHandlebarsExt (value, key) {
  return key.replace(/\.(handlebars|hbs)$/, '')
}
