const lernaJson = require("../lerna");

module.exports = {
  subProjects: function() {
    return lernaJson.packages.map(pkgDir => {
      return {
        directory: pkgDir,
        packageJson: require(`../${pkgDir}/package.json`)
      };
    });
  }
};
