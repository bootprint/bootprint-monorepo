module.exports = function (data) {
  var url = 'http://api.openweathermap.org/data/2.5/weather?q=' +
    data.city +
    '&units=metric'
  return {
    name: data.name,
    city: data.city,
    weather: require('get-promise')(url).get('data').then(JSON.parse)
  }
}
