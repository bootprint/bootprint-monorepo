var files = require('../../helpers-io').files

module.exports = {
  // Initial configuration when registering the engine.
  defaultConfig: null,

  // This function is called for any `.merge` input.
  // It converts the input into its mergable form
  preprocessConfig: function (config) {
    return files(config)
  },

  // Runs the engine with a resolved configuration.
  // The config contains no Promises anymore.
  run: function (config) {
    var result = ''
    for (var filename in config) {
      if (config.hasOwnProperty(filename)) {
        result += config[filename].contents + '\n'
      }
    }
    return result
  }
}
