const path = require('path')

module.exports = function loader (customize) {
  return customize.merge({
    handlebars: {
      templates: path.join(__dirname, 'handlebars', 'templates'),
      partials: path.join(__dirname, 'handlebars', 'partials')
    },
    less: {
      main: path.join(__dirname, 'less', 'main.less'),
      paths: path.join(__dirname, 'less', 'imports')
    }
  })
}
