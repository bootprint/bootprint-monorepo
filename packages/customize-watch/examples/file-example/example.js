var customize = require('../../')

// Load files from one directory and merge with second
customize()
  .registerEngine('files', require('./engine-concat-files'))
  .merge({
    files: 'dir1'
  })
  .merge({
    files: 'dir2'
  })
  .watch()
  .on('update', function (result) {
    console.log('result', result.files)
  })
