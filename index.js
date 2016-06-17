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
 * @property {function(string, string):(string|Promise<string>)} partialWrapper a function that can modify partials
 *   just before they are registered with the Handlebars engine. It receives the partial contents as
 *   first parameter and the partial name as second parameter and must return the new content (or a promise for
 *   the content. The parameter was introduced mainly for debugging purposes (i.e. to surround each
 *   partial with a string containing the name of the partial). When this function is overridden, the
 *   parent function is available throught `this.parent`.
 * @property {string|object|function} helpers if this is an object it is assumed to be a list of helper functions,
 *   if this is function it is assumed to return an object of helper functions, if this is a string,
 *   it is assumed to be the path to a module returning either an object of a function as above.
 * @property {string} templates path to a directory containing templates. Handlebars is called with each `.hbs`-file
 *   as template. The result of the engine consists of an object with a property for each template and the
 *   Handlebars result for this template as value.
 * @property {string|object|function} data a javascript-object to use as input for handlebars. Same as with the `helpers`,
 *   it is also acceptable to specify the path to a module exporting the data and a function computing
 *   the data.
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
 * @property {function(string,string): (string|Promise<string>)} partialWrapper the partial wrapper function.
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
  schema: require('./schema.js'),

  defaultConfig: {
    partials: {},
    partialWrapper: function (contents, name) { return contents },
    helpers: {},
    templates: {},
    data: {},
    preprocessor: _.identity,
    hbsOptions: {}
  },

  /**
   *
   * @param {CustomizeHandlebarsConfig} config the input configuration that is written by the user
   * @return {InternalHbsConfig} the configuration that is passed into the merging process
   *    later expected as parameter to the main function of the engine
   */
  preprocessConfig: function preprocessConfig (config) {
    var helpers = moduleIfString(config.helpers, 'helpers')
    // The helpers file may export an object or a promise for an object.
    // Or a function returning an object or a promise for an object.
    // If it's a function, use the result instead.
    helpers = _.isFunction(helpers) ? helpers() : helpers

    var preprocessor = moduleIfString(config.preprocessor, 'preprocessor')

    // The `data` is handled just like the helpers.
    var data = moduleIfString(config.data, 'data')
    data = _.isFunction(data) ? data() : data

    return {
      partials: files(config.partials),
      partialWrapper: config.partialWrapper && customize.withParent(config.partialWrapper),
      helpers: helpers,
      templates: files(config.templates),
      data: data,
      preprocessor: preprocessor && customize.withParent(preprocessor),
      hbsOptions: config.hbsOptions
    }
  },

  /**
   * Return the files that must be watched (i.e. the files and directories
   * that may alter the output). (This is currently just the template and partials directory)
   * @param config
   * @returns {string[]}
   */
  watched: function (config) {
    return _.flatten([
      config.partials,
      config.templates,
      // The data (in case it's a string)
      config.data,
      // The data.watch-files (in case `data` is a function)
      _.isFunction(config.data) && config.data.watch,
      // The helpers file (in case it's a string)
      config.helpers,
      // The helpers.watch-files (in case `helpers` is a function)
      _.isFunction(config.helpers) && config.helpers.watch,
      // The preprocessor (in case it's a string)
      config.preprocessor
    ]).filter(_.isString)
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

        var partials = _.mapValues(contents(config.partials), config.partialWrapper)
        hbs.registerPartial(partials)
        hbs.registerHelper(addEngine(config.helpers, hbs, config))
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
 * Used in _.mapKeys to remove the hbs extension
 * @param {*} value ignored
 * @param {string} key the original filename
 * @returns {string} the filename without .hbs
 * @private
 */
function stripHandlebarsExt (value, key) {
  return key.replace(/\.(handlebars|hbs)$/, '')
}

/**
 * Internal function that returns `require`s a module if the parameter is a string.
 *
 * If parameter is a string (path) and a file with that path exists, load it as module
 * If the parameter is not a string, juet return it.
 * If the parameter is a string, but the file does not exist, return `undefined`
 *
 *
 * @param {string|*} pathOrObject path to the file or configuration
 * @param {string} type additional information that can displayed in case the module is not found.
 * @returns {*}
 * @private
 */
function moduleIfString (pathOrObject, type) {
  // If this is a string, treat if as module to be required
  try {
    if (_.isString(pathOrObject)) {
      // Attempt to find module without resolving the contents
      // If there is an error, the module does not exist (which
      // is ignored at the moment)
      // If there is no error, the module should be loaded and error while loading
      // the module should be reported
      require.resolve(path.resolve(pathOrObject))
    }
  } catch (e) {
    debug('Ignoring missing ' + type + ' module: ' + pathOrObject)
    pathOrObject = undefined
  }

  // Require module if needed
  if (_.isString(pathOrObject)) {
    var absPath = path.resolve(pathOrObject)
    delete require.cache[absPath]
    pathOrObject = require(absPath)
  }
  return pathOrObject
}

/**
 * Wraps helpers with a function that provides
 * and object {engine, config} as additional parameter
 * @param {object<function>} helpers the helpers object
 * @param {Handlebars} hbs the current handlebars engine
 * @param {object} hbsOptions the options of the Handlebars engine
 */
function addEngine (helpers, hbs, hbsOptions) {
  hbs.logger.level = 0
  // Provide the engine as last parameter to all helpers in order to
  // enable things like calling partials from a helper.
  hbs.registerHelper(_.mapValues(helpers, function (helper) {
    return _.partialRight(helper, {
      engine: hbs,
      config: hbsOptions
    })
  }))
}
