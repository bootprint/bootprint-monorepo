var customize = require('customize')
customize()
  .registerEngine('handlebars', require('../'))
  .load(require('./config-module.js'))
  .merge({
    handlebars: {
      partials: 'partials2',
      partialWrapper: function (contents, name) {
        return '[BEGIN ' + name + ']\n' + contents + '[END ' + name + ']'
      }
    }
  })
  .run()
  .then(console.log)
