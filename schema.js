/**
 * Returns a JSON-Schema for the configuration object.
 */
module.exports = {
  description: 'The configuration schema of the "customize-engine-handlebars"',
  definitions: {
    'stringArray': {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  properties: {
    'templates': {
      description: 'Path to a directory tree containing Handlebars-templates',
      type: 'string'
    },
    'partials': {
      description: 'Path to a directory tree containing Handlebars-partials',
      type: 'string'
    },
    'helpers': {
      anyOf: [
        {
          description: 'JavaScript-object with helpers (key=name, value=function)',
          additionalProperties: {
            type: 'function'
          }
        },
        {
          description: 'Function generating a JavaScript-object with helpers',
          type: 'function'
        },
        {
          description: 'Path to a CommonJS-module exporting either a JavaScript-object with helpers or a function generating an object with helpers',
          type: 'string'
        }
      ]
    },
    'preprocessor': {
      anyOf: [
        {
          type: 'function',
          description: 'A function that returns a new JSON for the input JSON.'
        },
        {
          type: 'string',
          description: 'Path to a CommonJS-module exporting a preprocessor-function'
        }
      ]
    },
    'data': {
      description: 'The data passed into the Handlebars'
    },
    'hbsOptions': {
      description: 'Options passed to Handlebars#compile()'
    }
  }
}
