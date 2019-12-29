var fs = require('fs-extra')
var util = require('util')
var glob = util.promisify(require('glob'))
var path = require('path')

module.exports = {
  /**
   * Collect all credit-files concatenated them
   * and as a list return them
   *
   * @returns {*}
   */
  credits: async function(options) {
    const creditFiles = await glob('**/credits.md.hbs', {
      ignore: '**/(node_modules|.git)'
    })
    return await Promise.all(
      creditFiles.map(async creditFilePath => compileCreditFile(creditFilePath, options.customize.engine))
    )
  }
}

async function compileCreditFile(creditFilePath, handlebars) {
  const creditFileContents = await fs.readFile(creditFilePath, 'utf8')
  const creditFileTemplate = handlebars.compile(creditFileContents)
  return creditFileTemplate({
    __dirname: path.dirname(creditFilePath),
    __filename: creditFilePath
  })
}
