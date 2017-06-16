var {Bootprint} = require('bootprint')

module.exports = {
  moduleConfig,
  runBootprint,
  codeBlock,
  abbrev
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
 * {{#codeBlock lang='hbs'}}
 * Some markdown hbs template
 * {{/codeBlock}}
 */
function codeBlock (options) {
  var lang = (options.hash && options.hash.lang) || ''
  return Promise.resolve(options.fn(this))
    .then(contents => {
      // Get all backticks (like ['```','`````','`'])
      var backticks = contents.match(/`+/g) || []
      var maxNrTicks = backticks
        .map((ticks) => ticks.length)
        .reduce(Math.max, 0)
      // Minimum of three ticks, but more than the ticks in contents
      var maxTicks = '`'.repeat(Math.max(maxNrTicks + 1, 3))

      // Prefix content with newline if nesseary
      contents = contents.replace(/^\n?/, '\n')

      return `${maxTicks}${lang}${contents}${maxTicks}`
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
  let lessDocEngine = Object.assign(
    {},
    require('customize-engine-less'),
    {
      run: function (config) {
        return config
      }
    })
  return require('customize')()
    .registerEngine('handlebars', require('customize-engine-handlebars').docEngine)
    .registerEngine('less', lessDocEngine)
    .load(plugin)
    .run()
    .then((config) => {
      return options.fn(config)
    })
}

/**
 * Abbreviate a text to be no longer than a given limit.
 * @param {string} text the text
 * @param {number} limit the maximum length (excluding the '...' that is added if the text was limited)
 */
function abbrev (text, limit) {
  if (!text) {
    return ''
  }
  if (text.length < limit) {
    return text
  }
  return text.substr(0, limit) + '...'
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
