
var path = require("path");
var files = require("../../../lib/files.js")

module.exports = function(rideover) {
  return rideover.merge({
    handlebars: {
      partials: path.join(__dirname,"handlebars","partials")
    }
  });
}

module.exports.package = {
  name: 'testmodule',
  version: '0.0.0'
}
