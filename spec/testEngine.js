var _ = require('lodash')
var files = require('../lib/files')
var leaf = require('../lib/leaf')
var Q = require('q')

module.exports = {
  defaultConfig: {
    files: {},
    objects: {},
    leafs: {},
    array: []
  },

  /**
   *
   * @param {Promise<object>} config the input configuration that is written by the user
   * @return {Promise<object>} the configuration that is used passed into the merging process
   *    later expected as parameter to the main function of the engine
   */
  preprocessConfig: function (config) {
    return config.then(function (config) {
      return {
        files: files(config.files),
        objects: config.objects,
        leafs: _.mapValues(config.leafs, leaf),
        array: config.array
      }
    })
  },

  /**
   * Just return the config
   * @param config
   * @returns {*}
   */
  run: function testEngine (config) {
    return Q(config)
  }
}
