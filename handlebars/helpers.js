var util = require('util')

module.exports = {
  'json-schema--datatype': dataType,
  /**
   * Extract then name of a subschema from a $ref property
   * @param url
   * @returns {*}
   */
  'json-schema--subschema-name': function (url) {
    return url.replace('#/definitions/', '')
  },

  /**
   * Resolve a (local) json-schema-
   * @param reference
   */
  'json-schema--resolve-ref': function (reference, options) {
    reference = reference.trim()
    if (reference.lastIndexOf('#', 0) < 0) {
      console.warn('Remote references not supported yet. Reference must start with "#" (but was ' + reference + ')')
      return {}
    }
    var components = reference.split('#')
    // var url = components[0]
    var hash = components[1]
    var hashParts = hash.split('/')
    // TODO : Download remote json from url if url not empty
    var current = options.data.root
    hashParts.forEach(function (hashPart) {
      // Traverse schema from root along the path
      if (hashPart.trim().length > 0) {
        if (typeof current === 'undefined') {
          throw new Error("Reference '" + reference + "' cannot be resolved. '" + hashPart + "' is undefined.")
        }
        current = current[hashPart]
      }
    })
    return current
  },
  /**
   *
   * @param range a json-schema object with minimum, maximum, exclusiveMinimum, exclusiveMaximum
   * @param {number} [range.minimum]
   * @param {number} [range.maximum]
   * @param {boolean} [range.minimumExclusive]
   * @param {boolean} [range.maximumExclusive]
   * @param {Handlebars} engine the current handlebars engine
   */
  'json-schema--range': function (range, options, bootprint) {
    var hasMinimum = range.minimum || range.minimum === 0
    var hasMaximum = range.maximum || range.maximum === 0

    if (!hasMinimum && !hasMaximum) {
      // There is no range
      return ''
    }

    var numberSet = ''
    if (range.type === 'integer') {
      numberSet = '\u2208 \u2124' // ELEMENT OF - DOUBLE-STRUCK CAPITAL Z
    } else if (range.type === 'number') {
      numberSet = '\u2208 \u211D' // ELEMENT OF - DOUBLE-STRUCK CAPITAL R
    }

    if (hasMinimum && !hasMaximum) {
      return util.format(', { x %s | x %s %d }',
        numberSet,
        range.minimumExclusive ? '>' : '\u2265',
        range.minimum)
    } else if (hasMaximum && !hasMinimum) {
      return util.format(', { x %s | x %s %d }',
        numberSet,
        range.maximumExclusive ? '<' : '\u2264',
        range.maximum)
    } else {
      // if (hasMaxmium && hasMinimum)
      return util.format(', { x %s | %d %s x %s %d }',
        numberSet,
        range.minimum,
        range.minimumExclusive ? '<' : '\u2264',
        range.maximumExclusive ? '<' : '\u2264',
        range.maximum)
    }
  }
}

/**
 * Returns a descriptive string for a datatype
 * @param value
 * @returns {String} a string like <code>string[]</code> or <code>object[][]</code>
 */
function dataType (value) {
  if (!value) return null
  if (value['anyOf'] || value['allOf'] || value['oneOf']) {
    return ''
  }
  if (!value.type) {
    return 'object'
  }
  if (value.type === 'array') {
    if (!value.items) {
      return 'array'
    }
    if (value.items.type) {
      return dataType(value.items) + '[]'
    } else {
      return 'object[]'
    }
  }
  return value.type
}
