const cp = require('child_process')

module.exports = {
  /**
   * Execute a command and include the output in a fenced code-block.
   *
   * @param {string} command the command, passed to `child-process#execSync()`
   * @param {object} options optional arguments and Handlebars internal args.
   * @param {string} options.hash.lang the language tag that should be attached to the fence
   *    (like `js` or `bash`). If this is set to `raw`, the output is included as-is, without fences.
   * @param {string} options.hash.cwd the current working directory of the example process
   * @returns {string} the output of `execSync`, enclosed in fences.
   * @access public
   * @memberOf helpers
   */
  execNode(javascriptFile, options) {
    let { startFence, endFence } = computeFences(options)
    const setupModuleForExecNode = require.resolve('./setupExecNode.js')
    const command = `node -r '${setupModuleForExecNode}' example-merge.js`
    const output = cp.execSync(command, {
      encoding: 'utf8',
      cwd: options.hash && options.hash.cwd
    })
    return startFence + output.trim() + endFence
  }
}

function computeFences(options) {
  const lang = options.hash && options.hash.lang
  switch (lang) {
    case 'raw':
      return { startFence: '', endFence: '' }
    case 'inline':
      return { startFence: '`', endFence: '`' }
    default:
      const fenceLanguage = lang || ''
      return {
        startFence: '```' + fenceLanguage + '\n',
        endFence: '\n```'
      }
  }
}
