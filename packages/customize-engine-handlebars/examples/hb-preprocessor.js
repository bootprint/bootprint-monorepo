const got = require('got')

module.exports = async function(data) {
  return {
    name: data.name,
    city: data.city,
    github: got('https://api.github.com/users/nknapp').json()
  }
}
