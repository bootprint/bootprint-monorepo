var {Bootprint} = require('bootprint')

module.exports = {
  moduleConfig,
  runBootprint,
  codeBlock
}

/**
 * Create a [markdown code-block](http://daringfireball.net/projects/markdown/syntax#code) with enough backticks
 *
 * The surrounding fences of a code-block must have more backticks than the maximum number of
 * consecutive backticks in the contents (escaping backticks https://github.com/github/markup/issues/363).
 * This block-helper creates enough and at least three.
 *
 * @return {Promise<string>} the string containing the
 * @example
 * {{#codeBlock}}hbs
 * Some markdown hbs template
 * {{/codeBlock}}
 */
function codeBlock (options) {
  return Promise.resolve(options.fn(this))
    .then(contents => {
      var backticks = contents.match(/`+/g) || []
      // Minimum of three ticks, but more than the ticks in contents
      var maxTicks = backticks.reduce((max, next) => max.length > next.length ? max : '`' + next, '```')
      return `${maxTicks}${contents}${maxTicks}`
    })
}

/**
 * Continue with the thought-configuration of the current plugin
 *
 * The helper loads the thought-configuration from the plugin in the current
 * working directory and passed the resulting JSON as context to
 * the content-block.
 * @param options
 * @returns {Promise}
 * @access public
 */
function moduleConfig (options) {
  // Load from current working directsory. The cwd should be
  // the root-directory of the plugin
  var plugin = require(process.cwd())
  return require('customize')()
    .registerEngine('handlebars', require('customize-engine-handlebars'))
    .registerEngine('less', require('customize-engine-less'))
    .load(plugin)
    .buildConfig()
    .then((config) => {
      return options.fn(config)
    })
}

/**
 *
 * @param module
 * @param input
 * @param target
 * @returns {*}
 */
function runBootprint (module, input, target) {
  return new Bootprint(module, {})
    .run(input, target)
    .then((files) => {
      require('child_process').execFileSync('git', ['add'].concat(files))
      let tree = require('tree-from-paths').render(
        files,
        '',
        (parent, file, explicit) => `<a href='${parent}${file}'>${file}</a>`)
      return `<pre><code>${tree}</code></pre>`
    })
}
