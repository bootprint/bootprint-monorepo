/*!
 * ride-over <https://github.com/nknapp/ride-over>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */
var Q = require('q')

/**
 * Create a promise that is regarded as leaf in the configuration tree.
 * That means, that the overrider of ride-over is no resolving this promise when overriding values.
 * @param {*} promiseOrValue a promise or a valude that represents the leaf
 * @returns {Promise}
 */
module.exports = function leaf (promiseOrValue) {
  var result = Q(promiseOrValue)
  result._customize_custom_overrider = function (a, b) {
    // Leafs are overridden completely by the newer version
    return b
  }
  return result
}
