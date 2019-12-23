module.exports = {
  shout
}

/**
 * Make a string louder uppercase
 *
 * @param {string} text the string
 * @returns {string} the string in uppercase
 * @api public
 */
function shout (text) {
  return text && text.toUpperCase()
}
