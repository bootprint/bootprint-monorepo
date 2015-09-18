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
      console.warn('References must start with "#" (but was ' + reference + ')')
      return {}
    }
    var components = reference.split('#')
    var url = components[0]
    var hash = components[1]
    var hashParts = hash.split('/')
    // TODO : Download remote json from url if url not empty
    var current = options.data.root
    hashParts.forEach(function (hashPart) {
      // Traverse schema from root along the path
      if (hashPart.trim().length > 0) {
        if (typeof current==='undefined') {
          return undefined;
        }
        current = current[hashPart]
      }
    })
    console.log(current)
    return current
  }
}

/**
 * Returns a descriptive string for a datatype
 * @param value
 * @returns {String} a string like <code>string[]</code> or <code>object[][]</code>
 */
function dataType (value) {
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
