/**
 * Returns a JSON-Schema for the configuration object.
 */
module.exports = {
  description: 'The configuration schema of the "customize-engine-less"',
  definitions: {
    'stringArray': {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  properties: {
    'less': {
      type: 'object',
      properties: {
        'main': {
          description: 'A list of imported {less}-files',
          anyOf: [
            {type: 'string'},
            {$ref: '#/definitions/stringArray'}
          ]
        },
        'paths': {
          description: 'A list of directories to be used as {less}-include paths',
          anyOf: [
            {type: 'string'},
            {$ref: '#/definitions/stringArray'}
          ]
        }
      }
    }
  }
}
