var customize = require('customize')
customize()
  .registerEngine('handlebars', require('../'))
  .load(require('./config-module.js'))
  .merge({
    handlebars: {
      templates: 'templates',
      partials: 'partials-targetFile',
      helpers: {
        // Helper that returns the targetFile
        targetFile: function(options) {
          return options.customize.targetFile
        }
      }
    }
  })
  .run()
  .then(console.log)
