// For the examples, make sure that the output is stable
var consoleLog = console.log
var stringify = require('json-stable-stringify')

console.log = function () {
  consoleLog.apply(this, Array.prototype.map.call(
    arguments, (arg) => JSON.parse(stringify(arg, { space: 2 }))
  ))
}


