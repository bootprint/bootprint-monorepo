var customize = require('customize')

// Load files from one directory and merge with second
customize()
  .registerEngine('less', require('../'))
  // Add one less file
  .merge({
    less: {
      main: require.resolve('./main.less')
    }
  })
  // Add another less file overriding some variables
  .merge({
    less: {
      main: require.resolve('./override.less')
    }
  })
  .run()
  .then(console.log)
