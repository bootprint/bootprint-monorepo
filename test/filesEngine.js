var files = require('../helpers-io').files
var Q = require('q')

module.exports = {
  defaultConfig: {
    files: {}
  },

  defaultWatched: [],

  // This function is called to determine the files and directories
  // to watch in developmentMode
  watched: function (config) {
    return [ config.files ]
  },

  /**
   *
   * @param {Promise<object>} config the input configuration that is written by the user
   * @return {Promise<object>} the configuration that is used passed into the merging process
   *    later expected as parameter to the main function of the engine
   */
  preprocessConfig: function (config) {
    return {
      files: files(config.files)
    }
  },

  /**
   * Just return the config
   * @param config
   * @returns {*}
   */
  run: function filesEngine (config) {
    return Q(config)
  }
}
