/*!
 * ride-over <https://github.com/nknapp/ride-over>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */
var _ = require('lodash')

/**
 * Wrap a function so that if it overrides another function, that function will
 * be available as `this.parent`
 * @param fn
 */
module.exports = function withParent (fn) {
  if (_.isUndefined(fn)) {
    return fn
  }
  var result = _.partial(fn)
  // Misuse of `_.partial` so that we have dedicated function object on which we can set properties
  result._customize_custom_overrider = function (a, b) {
    return b.bind({
      parent: a
    })
  }
  return result
}
