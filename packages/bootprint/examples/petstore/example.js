const { Bootprint } = require('../../index')
const bootprintOpenApi = require('bootprint-openapi')

new Bootprint(bootprintOpenApi)
  .run('http://petstore.swagger.io/v2/swagger.json', 'target')
  .then(console.log, console.error)
