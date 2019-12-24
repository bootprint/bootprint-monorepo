const got = require('got').extend({
  json: true
})

module.exports = function(data) {
  return {
    name: data.name,
    city: data.city,
    github: got('https://api.github.com/users/nknapp').then(response => response.body)
  }
}
