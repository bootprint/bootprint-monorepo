const files = require('../helpers-io').files
const leaf = require('../').leaf
const withParent = require('../').withParent
const mapValues = require('../lib/util').mapValues

module.exports = {
  defaultConfig: {
    files: {},
    objects: {},
    leafs: {},
    array: []
  },

  /**
   *
   * @param {Promise<object>} config the input configuration that is written by the user
   * @return {Promise<object>} the configuration that is used passed into the merging process
   *    later expected as parameter to the main function of the engine
   */
  preprocessConfig: function(config) {
    return {
      files: files(config.files),
      objects: config.objects,
      leafs: mapValues(config.leafs, leaf),
      array: config.array,
      withParent: withParent(config.withParent)
    }
  },

  schema: {
    type: 'object',
    properties: {
      files: {
        type: 'string'
      },
      objects: {
        type: 'object'
      },
      leafs: {
        type: 'object'
      },
      array: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      withParent: {
        type: 'function'
      }
    }
  },

  watched: function(config) {
    return [
      // The config itself is the directory-path
      config.files
    ]
  },

  /**
   * Just return the config
   * @param config
   * @returns {*}
   */
  run: function testEngine(config) {
    return Promise.resolve(config)
  }
}
