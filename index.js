/*!
 * customize-engine-less <https://github.com/nknapp/customize-engine-less>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */
'use strict'

var _ = require('lodash')
var less = require('less')
var Q = require('q')

module.exports = {
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

  run: function (config) {
    var lessSource = config.main.map(function (file) {
      return '@import "' + file + '";'
    }).join('\n')
    return less.render(lessSource, {
      paths: config.paths,
      sourceMap: {},
      filename: 'main.less',
      compress: true
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
    return [ objOrArray ];
  }
  return objOrArray;

}
