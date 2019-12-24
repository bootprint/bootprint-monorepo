const customize = require('customize')
customize()
  .registerEngine('handlebars', require('../').docEngine)
  .load(require('./config-module.js'))
  .merge({
    handlebars: {
      partials: 'partials2'
    }
  })
  .run()
  .then(console.log)
