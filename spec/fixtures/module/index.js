var path = require("path");
var files = require("../../../lib/files.js")

module.exports = function (custmoize) {
  return customize.merge({
    test: {
      files: path.join(__dirname, "files"),
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
      array: ['item2']
    }
  });
}

module.exports.package = {
  name: 'testmodule',
  version: '0.0.0'
}
