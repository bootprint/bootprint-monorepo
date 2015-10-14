module.exports = function (data) {
  var url = 'https://api.github.com/users/' + data.name
  console.log(url)
  return {
    name: data.name,
    city: data.city,
    github: require('get-promise')('https://api.github.com/users/nknapp', {
      headers: {
        'User-Agent': 'Node'
      }
    }).get('data').then(JSON.parse)
  }
}
