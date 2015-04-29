var path = require("path");

// Export function to create new config (builder is passed in from outside)
module.exports = function (builder) {

    var bootstrapLess = require.resolve("bootstrap/less/bootstrap.less");

    return builder.merge({
        template: require.resolve("./handlebars/template.hbs"),
        partials: path.resolve(__dirname, "handlebars", "partials"),
        helpers: require.resolve("./handlebars/helpers.js"),
        less: {
            main: [
                bootstrapLess,
                require.resolve("./less/main.less")
            ],
            paths: [
                path.dirname(bootstrapLess)
            ]
        },
        /**
         * A preprocessor that may return a modified json before entering the rendering process.
         * Access the inherited preprocessor is possible via <code>this.previous(json)</code>
         * @param obj the input object
         * @return a modified object or a promise for a modified object.
         */
        preprocessor: function (obj) {
            return obj;
        }
    })
};

// Add "package" to be used by bootprint-doc-generator
module.exports.package = require("./package");
