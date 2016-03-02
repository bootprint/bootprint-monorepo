var path = require('path')

module.exports = function (customize) {
  return customize.merge({
    test: {
      files: path.join(__dirname, 'files'),
      objects: {
        b: {
          y: 'y2'
        }
      },
      leafs: {
        b: {
          y: 'y2'
        }
      },
      array: ['item2'],
      withParent: function(value) {
        return this.parent(value) * 2
      }
    }
  })
}

module.exports.package = {
  name: 'testmodule',
  version: '0.0.0'
}
