var customize = require('customize')
var write = require('../')

// Load files from one directory and merge with second
customize()
  .registerEngine('less', require('customize-engine-less'))
  // Add one less file
  .merge({
    less: {
      main: require.resolve('./main.less')
    }
  })
  .run()
  // Write contents to the "target"-directory
  .then(write('target'))
  // Output the names of the files being written
  .done(console.log)
