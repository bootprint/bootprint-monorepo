var customize = require('customize')

// Load files from one directory and merge with second
customize()
  .registerEngine('less', require('../'))
  .merge({
    less: {
      main: require.resolve('./main.less'),
      paths: __dirname
    }
  })
  .run()
  .done(console.log)
