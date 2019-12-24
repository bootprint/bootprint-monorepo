var customize = require('../../')

// Load files from one directory
customize()
  .registerEngine('files', require('./engine-concat-files'))
  .merge({
    files: 'dir1'
  })
  .run()
  .then(result => console.log(result.files))
