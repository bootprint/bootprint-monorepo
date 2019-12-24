var _ = require('lodash')
var files = require('../helpers-io').files
var leaf = require('../').leaf
var Q = require('q')

module.exports = {
  defaultConfig: {
    files: {},
    objects: {},
    leafs: {},
    array: []
  },

  defaultWatched: [],

  // This function is called to determine the files and directories
  // to watch in developmentMode
  watched: function(config) {
    return [config.files]
  },

  /**
   *
   * @param {Promise<object>} config the input configuration that is written by the user
   * @return {Promise<object>} the configuration that is used passed into the merging process
   *    later expected as parameter to the main function of the engine
   */
  preprocessConfig: function(config) {
    return {
      files: files(config.files),
      objects: config.objects,
      leafs: _.mapValues(config.leafs, leaf),
      array: config.array
    }
  },

  /**
   * Just return the config
   * @param config
   * @returns {*}
   */
  run: function testEngine(config) {
    return Q(config)
  }
}
