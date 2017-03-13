var customize = require('customize')
customize()
  .registerEngine('handlebars', require('../'))
  .load(require('./config-module.js'))
  .merge({
    handlebars: {
      partials: 'partials2',
      addSourceLocators: true
    }
  })
  .run()
  .done(console.log)
