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
const debug = require('debug')('customize:base')
const debugState = require('debug')('customize:state')
const debugVersions = require('debug')('customize:versions')
const deep = require('deep-aplus')(Promise)
const mergeWith = require('lodash.mergewith')

const util = require('./lib/util')
const mapValues = util.mapValues
const isString = util.isString
const constant = util.constant

/**
 * The configuration file is defined (and validated) by a JSON-schema
 * (see [the config-schema file](./config-schema.js)) for details.
 * We use the `jsonschema` module for validation, and add the
 * function-validator of `jsonschema-extra` because configurations
 * usually include functions
 *  from https://gitlab.com/jksdua/jsonschema-extra/blob/master/types.js#L16
 * @private
 */
const jsonschema = require('jsonschema')
const validator = new jsonschema.Validator()
validator.types = Object.create(validator.types)
validator.types.function = function testFunction(fn) {
  return typeof fn === 'function'
}

/**
 * Create a new Customize object with an empty configuration
 *
 * @module customize
 */
module.exports = customize

/**
 * For coverage testing: Expose the debugState object so it can be enabled an disabled in testcases
 */
module.exports.debugState = debugState

/**
 * For coverage testing: Expose the debug object so it can be enabled an disabled in testcases
 */
module.exports.debug = debug

/**
 * Exposes the constructor of the `customize` object
 * @type {customize}
 */
module.exports.Customize = Customize

/**
 * Custom overrider-function (that is used as `customizer` in (lodash#merge)[https://lodash.com/docs#merge]
 * @type {customOverrider}
 */
module.exports.overrider = customOverrider

/**
 * @returns {Customize}
 * @api public
 */
function customize() {
  return new Customize({}, {}, {})
}

/**
 * This class does the actual work. When calling
 * `require('customize')()` a new instance of this
 * class is returned with an empty configuration, so
 * `new Customize(...)` should never be called outside
 * this module
 * `config` and `parentConfig` are of the form
 *
 * ```js
 * { engine: { config: ..., watched: [ ... ] } }
 * ```
 *
 * @constructor
 */
function Customize(config, parentConfig, engines) {
  const _config = mergeWith({}, parentConfig, config, customOverrider)

  // Debug logging
  if (debugState.enabled) {
    deep(_config).then(
      function(config) {
        debugState('New configuration', config)
      } /* istanbul ignore next */,
      function(e) {
        console.error('Error while debug-logging the built configuration ' + e.stack) // eslint-disable-line no-console
      }
    )
  }

  /**
   * Register an engine
   * @param {string} id the identifier of the engine. This identifier is also used
   *  within the config as key within the configuration object to identify the
   *  sub-configuration stored for this engine.
   * @param {object} engine  a customize engine that is registered
   * @param {object=} engine.defaultConfig the default configuration of the engine
   * @param {function(object):object=} engine.preprocessConfig a preprocessor to convert a merge-configuration to the internal format of the engine
   * @param {function(object):object} engine.run the execution function of the engine (the merged config is passed as parameter
   * @param {function(object):object} engine.run the execution function of the engine (the merged config is passed as parameter)
   * @param {object=} engine.schema a JSON-schema to validate the merge-configurations against.
   *
   * @public
   */
  this.registerEngine = function(id, engine) {
    debug("Registering engine '" + id + "'")
    if (typeof id !== 'string') {
      throw new Error('Engine-id must be a string, but is ' + id)
    }
    if (id.substr(0, 1) === '_') {
      throw new Error('Engine-id may not start with an underscore ("_"), but is ' + id)
    }
    if (engine.run == null) {
      throw new Error('Engine ' + id + ' needs a run method')
    }

    // This is only allowed if no engine with the same id exists.
    if (engines[id] != null || _config[id] != null) {
      const error = new Error("Engine '" + id + "' already registered.", 'ERR_ENGINE_EXISTS')
      error.engine = engines[id]
      error.config = _config[id]
      throw error
    }

    const _engines = mapValues(engines) // clone
    _engines[id] = engine
    const _defaultConfig = {}
    _defaultConfig[id] = {
      config: engine.defaultConfig || {},
      watched: engine.defaultWatched || []
    }
    return new Customize(_defaultConfig, _config, _engines)
  }

  /**
   * Returns the JSON-schema that configuration objects must match for this
   * configuration. The schema does not contain main description property
   */
  this.configSchema = function() {
    return {
      id: 'http://json-schema.org/draft-04/schema#',
      $schema: 'http://json-schema.org/draft-04/schema#',
      type: 'object',
      properties: mapValues(engines, function(engine) {
        return (
          engine.schema || {
            type: 'object',
            description: 'No expicit schema has been provided for this engine'
          }
        )
      })
    }
  }

  /**
   * Creates a new instance of Customize. The configuration values of the current Customize
   * are used as default values and are overridden by the configuration provided as parameter.
   * @param {object} config configuration overriding the current configuration
   * @return {Customize} the new Customize instance
   * @api public
   */
  this.merge = function(config) {
    if (config == null) {
      throw new Error("Cannot merge undefined 'config'")
    }

    debug('Calling merge', config)

    // Assert that for each key in the other configuration, there is an engine present
    // Apply engine preprocessor to each config
    const preprocessedConfig = mapValues(config, function(engineConf, engineName) {
      const engine = engines[engineName]
      if (engine == null) {
        throw new Error("Engine '" + engineName + "' not found. Refusing to store configuration")
      }
      // Load preprocessor with identity as default
      const preprocessor =
        engine.preprocessConfig ||
        function(a) {
          return a
        }
      // Watch no files by default (constant [])
      const watched = engine.watched || constant([])

      return Promise.resolve(engineConf)
        .then(function(engineConf) {
          if (engine.schema) {
            debug('Validating schema for ', engineName)
            /**
             * The overriding configuration must validate against the [JSON-schema for configurations](./config-schema.html)
             * Otherwise we refuse to proceed.
             */
            const validationErrors = validator.validate(engineConf, engine.schema).errors
            if (validationErrors.length > 0) {
              debug("Error while validating config for engine '" + engineName + "': ", engineConf)
              debug('Errors: ', validationErrors.map(String).join('\n'))
              const error = new Error('Error while validating Customize configuration')
              error.validationErrors = validationErrors
              throw error
            }
          }

          return {
            config: preprocessor(engineConf),
            watched: watched(engineConf).filter(isString)
          }
        })
        .then(function(config) {
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
  this.load = function(customizeModule) {
    // Container for configuration metadata (e.g. versions of loaded modules)
    const _metadata = {
      config: {
        modules: []
      }
    }
    if (customizeModule.package) {
      debugVersions('Loading', customizeModule.package.name, customizeModule.package.version)
      _metadata.config.modules.push(customizeModule.package)
    }

    return customizeModule(new Customize({ _metadata: _metadata }, _config, engines))
  }

  /**
   * Return a promise for the merged configuration.
   * This functions is only needed to inspect intermediate configuration results
   * (i.e. for testing and documentation purposes)
   * @return {Promise<object>} a promise for the whole configuration
   * @public
   */
  this.buildConfig = function() {
    return deep(_config)
      .then(function(config) {
        return mapValues(config, 'config')
      })
      .then(function(config) {
        debug('Building', config)
        return config
      })
  }

  /**
   * Return a promise for the files needing to be watched in watch-mode,
   * indexed by engine.
   * @return {Promise<object<string[]>>} a promise for the files to be watched.
   *
   * @public
   */
  this.watched = function() {
    return deep(_config)
      .then(function(config) {
        return mapValues(config, 'watched')
      })
      .then(function(watchedFiles) {
        debug('Watched files', watchedFiles)
        return watchedFiles
      })
  }

  /**
   * Run each engine with its part of the config.
   *
   * @param {object=} options optional paramters
   * @param {string=} options.onlyEngine the name of an engine if only a single engine should
   *  be executed
   * @return {Promise<object>} an object containing on property per registered engine
   *  (the key is the engine-id) containing the result of each engine
   * @public
   */
  this.run = function(options) {
    const onlyEngine = options && options.onlyEngine
    return this.buildConfig().then(function(resolvedConfig) {
      const result = mapValues(engines, function(engine, key) {
        // if "onlyEngine" is set to a value, execute on the engine with the same name
        if (!onlyEngine || onlyEngine === key) {
          return engine.run(resolvedConfig[key])
        }
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
function customOverrider(a, b, propertyName) {
  if (b == null) {
    return a
  }

  if (a == null) {
    // Invoke default overrider
    return undefined
  }

  // Some objects have custom overriders
  if (b._customize_custom_overrider && b._customize_custom_overrider instanceof Function) {
    return b._customize_custom_overrider(a, b, propertyName)
  }

  // Arrays should be concatenated
  if (Array.isArray(a)) {
    return a.concat(b)
  }

  // Merge values resolving promises, if they are not leaf-promises
  if (isPromiseAlike(a) || isPromiseAlike(b)) {
    return Promise.all([a, b]).then(function([_a, _b]) {
      // Merge the promise results
      return mergeWith({}, { x: _a }, { x: _b }, customOverrider).x
    })
  }
  // None of these options apply. Implicit "undefined" return value to invoke default overrider.
}

/**
 * Check if this is something like a promise (taken from the Q-module)
 * @param {*} obj the object to check for being a promise
 * @returns {boolean} true, if the object is a promise
 * @private
 */
function isPromiseAlike(obj) {
  return obj === Object(obj) && typeof obj.then === 'function'
}
