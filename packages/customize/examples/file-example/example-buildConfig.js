var customize = require('../../')

// Load files from one directory and merge with second
customize()
  .registerEngine('files', require('./engine-concat-files'))
  .merge({
    files: 'dir1'
  })
  .buildConfig()
  .then((result) => console.log(result.files))
