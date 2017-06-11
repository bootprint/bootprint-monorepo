const path = require('path')

module.exports = function loader (customize) {
  return customize
    .merge({
      handlebars: {
        templates: path.join(__dirname, 'handlebars', 'templates'),
        partials: path.join(__dirname, 'handlebars', 'partials'),
        helpers: require.resolve('./handlebars/helpers.js')
      },
      less: {
        main: path.join(__dirname, 'less', 'main.less'),
        paths: path.join(__dirname, 'less', 'imports')
      }
    })
    .merge({
      handlebars: {
        helpers: {
          inlineHelper: function inlineHelper () {
            return 0
          }
        }
      }
    })
}
