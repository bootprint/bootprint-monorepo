// For the examples, make sure that the output is stable
const consoleLog = console.log
const stringify = require('json-stable-stringify')

require('loud-rejection/register')
setupStableConsole()

function setupStableConsole() {
  console.log = function() {
    consoleLog.apply(
      this,
      Array.prototype.map.call(arguments, arg => stringify(arg, { space: 2 }))
    )
  }
}
