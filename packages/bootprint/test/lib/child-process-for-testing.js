const cp = require('child_process')
const debug = require('debug')('bootprint:child-process-for-testing')

module.exports = { execFile, spawn }

/**
 * Execute a command, but never throw an error. If an error is set,
 * return it in the result, so that the tests can verify it.
 * @param jsFile the javascript-file
 * @param args the command line arguments passed to the process
 * @param options default: `{ encoding: 'utf-8'}`
 * @returns {Promise}
 */
function execFile(jsFile, args, options) {
  options = Object.assign({ encoding: 'utf-8' }, options)
  const cmd = process.argv[0]
  const jsFileAndArgs = [jsFile, ...args]
  debug('execFile $> ', commandlineAsString(cmd, jsFileAndArgs), options)
  return new Promise(resolve => {
    cp.execFile(cmd, jsFileAndArgs, options, (err, stdout, stderr) => resolve({ err, stdout, stderr }))
  })
}

function spawn(jsFile, args, options) {
  const cmd = process.argv[0]
  const jsFileAndArgs = [jsFile, ...args]
  debug('spawn $> ', commandlineAsString(cmd, jsFileAndArgs), options)
  return cp.spawn(cmd, jsFileAndArgs, options)
}

function commandlineAsString(cmd, argv) {
  return `${cmd} ${argv.map(arg => `'${arg.replace(/'/g, "\\'")}'`).join(' ')}`
}
