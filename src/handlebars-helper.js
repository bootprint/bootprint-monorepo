
module.exports = {
    "json-schema--datatype": dataType,
    /**
     * Extract then name of a subschema from a $ref property
     * @param url
     * @returns {*}
     */
    "json-schema--subschema-name": function(url) {
        return url.replace("#/definitions/","");
    }
};


/**
 * Returns a descriptive string for a datatype
 * @param value
 * @returns {String} a string like <code>string[]</code> or <code>object[][]</code>
 */
function dataType(value) {
    if (value['anyOf'] || value['allOf'] || value['oneOf']) {
        return "";
    }
    if (!value.type) {
        return "object";
    }
    if (value.type === "array") {
        if (!value.items) {
            return "array";
        }
        if (value.items.type) {
            return dataType(value.items) + "[]";
        } else {
            return "object[]";
        }
    }
    return value.type;
}


