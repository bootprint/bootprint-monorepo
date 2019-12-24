/*!
 * ride-over <https://github.com/nknapp/ride-over>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/**
 * Wrap a function so that if it overrides another function, that function will
 * be available as `this.parent`
 * @param fn
 */
module.exports = function withParent(fn) {
  if (fn == null) {
    return fn
  }
  const result = cloneFunction(fn)
  result._customize_custom_overrider = function(a, b) {
    return b.bind({
      parent: a
    })
  }
  return result
}

// https://gist.github.com/Sykkro/7490193#file-clone-js-L1
function cloneFunction(fn) {
  const temp = function temporary() {
    return fn.apply(this, arguments)
  }
  for (const key in fn) {
    temp[key] = fn[key]
  }
  return temp
}
