function identity (a) { return a }

/**
 *
 * @param {object} obj the input object
 * @param {function(object,string):string} keyFn a function `(value,key) => newKey`
 * @param {function(object,string):object} valueFn a function `(value,key) => newValue`
 * @returns the resulting object
 */
function mapObject (obj, keyFn, valueFn) {
  return Object.keys(obj).reduce(function (result, key) {
    const newKey = keyFn(obj[key], key)
    const newValue = valueFn(obj[key], key)
    result[newKey] = newValue
    return result
  }, {})
}

/**
 * Replacement for lodash's mapValue
 * @param {object} obj
 * @param {function} iteratee
 * @returns {object}
 */
function mapValues (obj, iteratee) {
  return mapObject(obj, (value, key) => key, iteratee)
}

/**
 * Replacement for lodash's mapValue
 * @param {object} obj
 * @param {function} iteratee
 * @returns {object}
 */
function mapKeys (obj, iteratee) {
  return mapObject(obj, iteratee, identity)
}

function isString (str) {
  return typeof str === 'string'
}

function isFunction (fn) {
  return typeof fn === 'function'
}

function flatten (array) {
  return [].concat(array)
}

module.exports = {
  isFunction,
  isString,
  mapKeys,
  mapValues,
  mapObject,
  flatten,
  identity
}
