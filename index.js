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
// var debug = require('debug')('customize')
var Q = require('q')
var deep = require('q-deep')
var _ = require('lodash')

/**
 *
 * @param config
 * @param parentConfig
 * @param {object<function>} engines
 * @constructor
 */
function Customize (config, parentConfig, engines) {
  var _config = _.merge({}, parentConfig, config, customOverrider)

  /**
   * Register an engine with a default config
   * @param {string} id the identifier of the engine (also within the config)
   * @param {function} engine
   */
  this.registerEngine = function (id, engine) {
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
   * Creates a new instance of RideOver. The config of the current RideOver
   * are used as default values and are overridden by the config provided as parameter.
   * @param {object} config config overriding the config of this builder
   * @return {Customize} new Builder instance
   */
  this.merge = function (config) {
    if (_.isUndefined(config)) {
      throw new Error("Cannot merge undefined 'config'")
    }

    // Assert that for each key in the other configuration, there is an engine present
    // Apply engine preprocessor to each config
    var preprocessedConfig = _.mapValues(config, function (value, key) {
      var engine = engines[key]
      if (_.isUndefined(engine)) {
        throw new Error("Engine '" + key + "' not found. Refusing to store configuration")
      }
      // Load preprocessor with identity as default
      var preprocessor = engine.preprocessConfig || _.identity
      return preprocessor(Q(value)).then(function (config) {
        return config
      })
    })
    return new Customize(preprocessedConfig, _config, engines)
  }

  /**
   * Inherit configuration config from another module.
   * `require("rideover-modulename")` usually return a function(builder)
   * and this functions needs to be passed in here.
   * A new RideOver will be returned that overrides the current config
   * with config from the builderFunction's result.
   * @param {function} builderFunction  that receives a RideOver as paramater
   *  and returns a RideOver with changed configuration.
   * @return {Customize} the result of the builderFunction
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
   */
  this.build = function () {
    return deep(_config)
  }

  /**
   * Run each engine with its part of the config.
   */
  this.run = function () {
    return this.build().then(function (resolvedConfig) {
      return deep(_.mapValues(engines, function (engine, key) {
        return engine.run(resolvedConfig[key])
      }))
    })
  }

}

/**
 * Create a new RideOver object with
 * @returns {Customize}
 */
module.exports = function () {
  return new Customize({}, {}, {})
}

/**
 * @readonly
 */
module.exports.withParent = require('./lib/withParent')

/**
 * @readonly
 */
module.exports.leaf = require('./lib/leaf')

/**
 * RideOver has predefined override rules for merging configs.
 *
 * * If the overriding object has a `_ro_custom_overrider` function-property,
 *   it is called to perform the merger.
 * * Arrays are concatenated
 * * Promises are resolved and the results are merged
 *
 *
 * @param a
 * @param b
 * @param propertyName
 * @returns {*}
 */
function customOverrider (a, b, propertyName) {
  if (_.isUndefined(b)) {
    return a
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
  if (Q.isPromiseAlike(a) && Q.isPromiseAlike(b) && !a.leaf && !b.leaf) {
    return Q.all([a, b]).spread(function (_a, _b) {
      // Merge the promise results
      return _.merge({}, {x: _a}, {x: _b}, customOverrider).x
    })
  }

}

/**
 * @readonly
 * @type {customOverrider}
 */
module.exports.overrider = customOverrider
