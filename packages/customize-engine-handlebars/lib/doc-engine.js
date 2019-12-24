const { files } = require('customize/helpers-io')
const { augment, hierarchy } = require('./partial-details')
const _ = require('./utils')

/**
 * This customize-engine takes the same configuration schema as
 * `customize-engine-handlebars`, but it performs different
 * merges. It's goal is to create a configuration that
 * can be rendered as documentation with a Handlebars template.
 *
 *
 * "partials" and "templates" use the `files`-helper of customize, "data" and "hbsOptions" are merged like objects.
 * "partialWrapper","helpers" and "preprocessor" are collected in an array.
 *
 * For helpers and preprocessors that are directly defined in the configuration (not as path to a javascript-module),
 * a `null` will be inserted into the list of loaded helper files. This allows the documentation-template to add a
 * warning to the output. if no helpers are defined, no new entry (not even `null`) will be added.
 */
module.exports = {
  defaultConfig: {
    // Merged options
    partials: {},
    templates: {},
    data: {},
    hbsOptions: {},
    // Collected options
    partialWrapper: [],
    helpers: [],
    preprocessor: []
  },

  preprocessConfig(config) {
    return {
      partials: files(config.partials),
      partialWrapper: config.partialWrapper && [config.partialWrapper.toString()],
      helpers: config.helpers && [onlyIfString(config.helpers)],
      templates: files(config.templates),
      data: config.data,
      preprocessor: config.preprocessor && [onlyIfString(config.preprocessor)],
      hbsOptions: config.hbsOptions,
      addSourceLocators: config.addSourceLocators
    }
  },

  run(config) {
    // Remove .hbs from partial and template names
    config.templates = _.mapKeys(config.templates, _.stripHandlebarsExt)
    config.partials = _.mapKeys(config.partials, _.stripHandlebarsExt)
    return Object.assign(
      config,
      // Augmented partials and templates
      augment(config),
      {
        callHierarchy: hierarchy(config)
      }
    )
  }
}

/**
 * Returns a string if the parameter is a string
 * and null, if it is anything else
 * @param {string|function} stringOrFunction the input parameter
 * @return {string|null} a string or null
 */
function onlyIfString(stringOrFunction) {
  return typeof stringOrFunction === 'string' ? stringOrFunction : null
}
