
module.exports = {
    "json-schema--datatype": dataType
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


