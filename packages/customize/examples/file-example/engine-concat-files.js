var files = require('../../helpers-io').files

module.exports = {
  // Optional input schema for engine-configurations
  // If this is present, the JSON will be validated before being passed into "preprocessConfig"
  schema: {
    description: 'Path to a directory containing files',
    type: 'string'
  },

  // Initial configuration when registering the engine.
  defaultConfig: null,

  // Files/Dirs to-be-watched with the default configuration
  defaultWatched: [],

  // This function is called for any `.merge` input.
  // It converts the input into its mergable form
  preprocessConfig: function (config) {
    return files(config)
  },

  // This function is called to determine the files and directories
  // to watch in developmentMode
  watched: function (config) {
    return [
      // The config itself is the directory-path
      config
    ]
  },

  // Runs the engine with a resolved configuration.
  // The config contains no Promises anymore.
  // The function returns an object
  //
  // {
  //    "filename.txt": "file-contents"
  // }
  //
  run: function (config) {
    var result = ''
    Object.keys(config).forEach(filename => {
      result += config[filename].contents + '\n'
    })
    return {
      // Return a file called "concat.txt"
      'concat.txt': result
    }
  }
}
