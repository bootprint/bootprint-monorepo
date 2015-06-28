var Handlebars = require('handlebars')
var _ = require('lodash')
var files = require('./files')

module.exports = function engineHandlebars (config) {
  var hbs = Handlebars.create()
  hbs.registerPartial(_.mapKeys(config.partials, stripHandlebarsExt))
  hbs.registerHelper(config.helpers)

  var templates = _.mapKeys(config.templates, stripHandlebarsExt)

  return _.mapValues(templates, function (template) {
    var fn = hbs.compile(template)
    return fn(config.data)
  })
}

/**
 *
 * @param {Promise<object>} config the input configuration that is written by the user
 * @return {Promise<object>} the configuration that is used passed into the merging process
 *    later expected as parameter to the main function of the engine
 */
module.exports.preprocessConfig = function (config) {
  return config.then(function (config) {
    return {
      partials: files(config.partials),
      helpers: config.helpers,
      templates: files(config.templates),
      data: config.data
    }
  })
}

module.exports.defaultConfig = {
  partials: {},
  helpers: {},
  templates: {},
  data: {}
}

/**
 * Use in mapkeys to remove the hbs extension
 * @param value
 * @param key
 * @returns {XML|void|string}
 */
function stripHandlebarsExt (value, key) {
  return key.replace(/\.(handlebars|hbs)$/, '')
}
