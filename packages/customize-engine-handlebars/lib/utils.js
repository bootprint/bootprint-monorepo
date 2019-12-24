function identity(a) {
  return a
}

/**
 *
 * @param {object} obj the input object
 * @param {function(object,string):string} keyFn a function `(value,key) => newKey`
 * @param {function(object,string):object} valueFn a function `(value,key) => newValue`
 * @returns the resulting object
 */
function mapObject(obj, keyFn, valueFn) {
  return Object.keys(obj).reduce(function(result, key) {
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
function mapValues(obj, iteratee) {
  return mapObject(obj, (value, key) => key, iteratee)
}

/**
 * Replacement for lodash's mapValue
 * @param {object} obj
 * @param {function} iteratee
 * @returns {object}
 */
function mapKeys(obj, iteratee) {
  return mapObject(obj, iteratee, identity)
}

/**
 * Call the iteratee for all values of the object
 *
 */
function forEachValue(obj, iteratee) {
  Object.keys(obj).forEach(key => iteratee(obj[key], key, obj))
}

function isString(str) {
  return typeof str === 'string'
}

function isFunction(fn) {
  return typeof fn === 'function'
}

function flatten(array) {
  return [].concat(array)
}

/**
 * Used in _.mapKeys to remove the hbs extension
 * @param {*} value ignored
 * @param {string} key the original filename
 * @returns {string} the filename without .hbs
 * @access private
 */
function stripHandlebarsExt(value, key) {
  return key.replace(/\.(handlebars|hbs)$/, '')
}

module.exports = {
  isFunction,
  isString,
  mapKeys,
  mapValues,
  mapObject,
  flatten,
  identity,
  forEachValue,
  stripHandlebarsExt
}
