/*!
 * customize <https://github.com/nknapp/ride-over>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

/**
 * Use the `debug`-module to provide debug output if needed
 */
var debug = require('debug')('customize:base')
var debugState = require('debug')('customize:state')
var Q = require('q')
var deep = require('q-deep')
var _ = require('lodash')

/**
 * Create a new Customize object with an empty configuration
 * @returns {Customize}
 * @api public
 */
module.exports = function () {
  return new Customize({}, {}, {})
}

/**
 * The main class. The heart of Customize
 *
 *
 * @param config
 * @param parentConfig
 * @param {object<function>} engines
 * @constructor
 * @api private
 */
function Customize (config, parentConfig, engines) {
  var _config = _.merge({}, parentConfig, config, customOverrider)
  deep(_config).done(function (config) {
    debugState('New configuration', config)
  })

  /**
   * Register an engine with a default config
   * @param {string} id the identifier of the engine (also within the config)
   * @param {function} engine
   * @api public
   */
  this.registerEngine = function (id, engine) {
    debug("Registering engine '" + id + "'")
    if (!_.isString(id)) {
      throw new Error('Engine-id must be a string, but is ' + id)
    }
    if (id.substr(0, 1) === '_') {
      throw new Error("Engine-id may not start with an underscore ('_')")
    }
    if (_.isUndefined(engine['run'])) {
      throw new Error('Engine needs a run method')
    }

    // This is only allowed if now engine with the same id exists.
    if (!(_.isUndefined(engines[id]) && _.isUndefined(_config[id]))) {
      var error = new Error("Engine '" + id + "' already registered.", 'ERR_ENGINE_EXISTS')
      error.engine = engines[id]
      error.config = _config[id]
      throw error
    }

    var _engines = _.clone(engines)
    _engines[id] = engine
    var _defaultConfig = {}
    _defaultConfig[id] = engine.defaultConfig
    return new Customize(_defaultConfig, _config, _engines)

  }

  /**
   * Creates a new instance of Customize. The config of the current Customize
   * are used as default values and are overridden by the config provided as parameter.
   * @param {object} config config overriding the config of this builder
   * @return {Customize} new Builder instance
   * @api public
   */
  this.merge = function (config) {
    if (_.isUndefined(config)) {
      throw new Error("Cannot merge undefined 'config'")
    }

    debug('Calling merge', config)

    // Assert that for each key in the other configuration, there is an engine present
    // Apply engine preprocessor to each config
    var preprocessedConfig = _.mapValues(config, function (value, key) {
      var engine = engines[key]
      if (_.isUndefined(engine)) {
        throw new Error("Engine '" + key + "' not found. Refusing to store configuration")
      }
      // Load preprocessor with identity as default
      var preprocessor = engine.preprocessConfig || _.identity
      return Q(preprocessor(Q(value))).then(function (config) {
        debug('Merging preprocessed config', config)
        return config
      })
    })
    return new Customize(preprocessedConfig, _config, engines)
  }

  /**
   * Inherit configuration config from another module.
   * `require("Customize-modulename")` usually return a function(builder)
   * and this functions needs to be passed in here.
   * A new Customize will be returned that overrides the current config
   * with config from the builderFunction's result.
   * @param {function} builderFunction  that receives a Customize as paramater
   *  and returns a Customize with changed configuration.
   * @return {Customize} the result of the builderFunction
   * @api public
   */
  this.load = function (builderFunction) {
    if (builderFunction.package) {
      console.log('Loading', builderFunction.package.name, builderFunction.package.version)
    }
    return builderFunction(this)
  }

  /**
   * Build the configured Bootprint-instance.
   * @return {Promise<object>} a promise for the whole configuration
   * @api public
   */
  this.build = function () {
    return deep(_config).then(function (config) {
      debug('Building', config)
      return config
    })
  }

  /**
   * Run each engine with its part of the config.
   * @api public
   */
  this.run = function () {
    return this.build().then(function (resolvedConfig) {
      var result = _.mapValues(engines, function (engine, key) {
        return engine.run(resolvedConfig[key])
      })
      return deep(result)
    })
  }

}

/**
 * Wrap a function so that if it overrides another function, that function will
 * be available as `this.parent`
 * @param fn
 * @api public
 * @readonly
 */
module.exports.withParent = require('./lib/withParent')

/**
 * Create a promise that is regarded as leaf in the configuration tree.
 * That means, that the overrider of ride-over is no resolving this promise when overriding values.
 * @param {*} promiseOrValue a promise or a valude that represents the leaf
 * @returns {Promise}
 * @api public
 * @readonly
 */
module.exports.leaf = require('./lib/leaf')

/**
 * Customize has predefined override rules for merging configs.
 *
 * * If the overriding object has a `_customize_custom_overrider` function-property,
 *   it is called to perform the merger.
 * * Arrays are concatenated
 * * Promises are resolved and the results are merged
 *
 *
 * @param a the overridden value
 * @param b the overriding value
 * @param propertyName the property name
 * @returns {*} the merged value
 */
function customOverrider (a, b, propertyName) {
  if (_.isUndefined(b)) {
    return a
  }

  if (_.isUndefined(a)) {
    // Invoke default overrider
    return undefined
  }

  // Some objects have custom overriders
  if (_.isFunction(b._customize_custom_overrider)) {
    return b._customize_custom_overrider(a, b, propertyName)
  }

  // Arrays should be concatenated
  if (_.isArray(a)) {
    return a.concat(b)
  }

  // Merge values resolving promises, if they are not leaf-promises
  if (Q.isPromiseAlike(a) || Q.isPromiseAlike(b)) {
    return Q.all([a, b]).spread(function (_a, _b) {
      // Merge the promise results
      return _.merge({}, {x: _a}, {x: _b}, customOverrider).x
    })
  }

}

/**
 * The custom-overrider used by Customize
 * @readonly
 * @type {customOverrider}
 */
module.exports.overrider = customOverrider
