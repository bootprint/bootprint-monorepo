/*!
 * customize <https://github.com/nknapp/customize>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */

module.exports = {
  mapValues,
  identity,
  isString,
  constant,
  asPromise
}

/**
 * Create a new object with a same keys and the function applied to each value.
 * If fnOrProperty is a string, `v => v[fnOrProperty]` will be applied to each value
 * If fnOrProperty is undefined, The identity-function will be used, which makes
 * it for objects equivalent to _.clone
 * @param obj
 * @param fnOrProperty
 */
function mapValues(obj, fnOrProperty) {
  if (obj == null) {
    return obj
  }
  let fn = null
  if (fnOrProperty == null) {
    fn = identity
  } else if (fnOrProperty instanceof Function) {
    fn = fnOrProperty
  } else if (typeof fnOrProperty === 'string') {
    fn = function(v) {
      return v[fnOrProperty]
    }
  } else {
    throw new Error('fnOrProperty must either be undefined, a function or a string')
  }

  return Object.keys(obj).reduce(function(result, key) {
    result[key] = fn(obj[key], key)
    return result
  }, {})
}

function identity(a) {
  return a
}

/**
 * Return a function producing a constant value
 * @param a
 * @returns {Function}
 */
function constant(a) {
  return function() {
    return a
  }
}

function isString(str) {
  return typeof str === 'string'
}

/**
 * Return a promise for a functon with node-style callback
 * Usage:
 *
 * ```
 * asPromise((callback) => fs.readFile('name', callback))
 * ``
 * `
 * @param {function(callback:function(Error, any))} fn the function to generate the promise from
 * @returns {Promise<any>}
 */
function asPromise(fn) {
  return new Promise((resolve, reject) => {
    fn((err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}
