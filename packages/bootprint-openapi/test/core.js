const bootprintUnitTesting = require('bootprint-unit-testing')
/**
 * Run bootprint with a fixture and return a cheerio wrapper for the index.html
 * @param fixture
 * @param context the test context to store cheerio in
 * @returns {*}
 */
function run(swaggerDefinition, dir, context) {
  // TODO: remove this and using bootprint-unittesting directly everywhere
  return bootprintUnitTesting(require('../'), dir).run(swaggerDefinition, context)
}

module.exports = {
  run
}
