/*!
 * customize <https://github.com/nknapp/ride-over>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

/*
 * Use the `debug`-module to provide debug output if needed
 */
var debug = require('debug')('customize:base')
var debugState = require('debug')('customize:state')
var Q = require('q')
var deep = require('q-deep')
var _ = require('lodash')

/**
 * Create a new Customize object with an empty configuration
 *
 * @module customize
 */
module.exports = customize

/**
 * @returns {Customize}
 * @api public
 */
function customize () {
  return new Customize({}, {}, {})
}

/**
 * This class does the actual work. When calling
 * `require('customize')()` a new instance of this
 * class is returned with an empty configuration, so
 * `new Customize(...)` should never be called outside
 * this module
 *
 * @constructor
 */
function Customize (config, parentConfig, engines) {
  var _config = _.merge({}, parentConfig, config, customOverrider)
  deep(_config).done(function (config) {
    debugState('New configuration', config)
  })

  /**
   * Register an engine an engine
   * @param {string} id the identifier of the engine. This identifier is also used
   *  within the config as key within the configuration object to identify the
   *  sub-configuration stored for this engine.
   * @param {{defaultConfig: object, preprocessConfig: function, run: function}} engine
   *  a customize engine that is registered
   * @public
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
   * Creates a new instance of Customize. The configuration values of the current Customize
   * are used as default values and are overridden by the configuration provided as parameter.
   * @param {object} config configuration overriding the current configuration
   * @return {Customize} the new Customize instance
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
      return Q(value).then(preprocessor).then(function (config) {
        debug('Merging preprocessed config', config)
        return config
      })
    })
    return new Customize(preprocessedConfig, _config, engines)
  }

  /**
   * Inherit configuration config from another module.
   * a Customizer-module usually exports a `function(Customize):Customize`
   * which in tern calls `Customize.merge` to create a new Customize instance.
   * This function needs to be passed in here.
   *
   * A new Customize will be returned that overrides the current configuration
   * with the configuration of the module.
   * @param {function(Customize):Customize} customizeModule  that receives a Customize as paramater
   *  and returns a Customize with changed configuration.
   * @return {Customize} the Customize instance returned by the module
   * @public
   */
  this.load = function (customizeModule) {
    if (customizeModule.package) {
      console.log('Loading', customizeModule.package.name, customizeModule.package.version)
    }
    return customizeModule(this)
  }

  /**
   * Return a promise for the merged configuration.
   * This functions is only needed to inspect intermediate configuration results
   * (i.e. for testing and documentation purposes)
   * @return {Promise<object>} a promise for the whole configuration
   * @public
   */
  this.build = function () {
    return deep(_config).then(function (config) {
      debug('Building', config)
      return config
    })
  }

  /**
   * Run each engine with its part of the config.
   *
   * @return {Promise<object>} an object containing on property per registered engine
   *  (the key is the engine-id) containing the result of each engine
   * @public
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
 * That means, that the overrider is not resolving this promise when overriding values.
 * Promised object values will not be merged but replaced.
 * @param {*} promiseOrValue a promise or a valude that represents the leaf
 * @returns {Promise}
 * @public
 * @readonly
 */
module.exports.leaf = require('./lib/leaf')

/**
 * Customize has predefined override rules for merging configs.
 *
 * * If the overriding object has a `_customize_custom_overrider` function-property,
 *   it isk called to perform the merger.
 * * Arrays are concatenated
 * * Promises are resolved and the results are merged
 *
 *
 * @param a the overridden value
 * @param b the overriding value
 * @param propertyName the property name
 * @returns {*} the merged value
 * @private
 * @readonly
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
