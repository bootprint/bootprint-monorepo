/*!
 * customize-engine-less <https://github.com/nknapp/customize-engine-less>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */
'use strict'

var _ = require('lodash')
var less = require('less')

/**
 * @typedef {object} CustomizeLessConfig
 * Configuration for the customize less-engine
 * @property {string|string[]} main absolute path to a lesscss-file or a list of absolute paths to less files
 * @property {string|string[]} path absolute path (or a list of those) to paths to use as import path
 * @api public
 */

module.exports = {
  schema: require('./schema.js'),

  defaultConfig: {
    main: [],
    paths: []
  },

  preprocessConfig: function (config) {
    return {
      main: coerceToArray(config.main),
      paths: coerceToArray(config.paths)
    }
  },

  watched: function (config) {
    return coerceToArray(config.main).concat(coerceToArray(config.paths))
  },

  /**
   * Compute the raw CSS from the input files and store them as "main.css" and the source-map
   * as "main.css.map"
   * @param config
   */
  run: function (config) {
    var lessSource = config.main.map(function (file) {
      return '@import "' + file + '";'
    }).join('\n')
    return less.render(lessSource, {
      paths: config.paths,
      sourceMap: {},
      filename: 'customize-bundle.less',
      compress: true
    }).then(function (lessResult) {
      return {
        'main.css': lessResult.css,
        'main.css.map': lessResult.map
      }
    })
  }
}

/**
 * If `objOrArray` exists and is a non-array, it is replaced by
 * an array with the property as single object.
 * @param {object} objOrArray the object or an array
 * @return objOrArray, if it is an array or an array containing `objOrArray` (if it is no array)
 */
function coerceToArray (objOrArray) {
  if (!_.isUndefined(objOrArray) && !_.isArray(objOrArray)) {
    return [ objOrArray ]
  }
  return objOrArray
}
