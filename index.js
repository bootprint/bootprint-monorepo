var path = require("path");


module.exports = function(builder) {

    var bootstrapLess = require.resolve("bootstrap/less/bootstrap.less");

    return builder.merge({
        template: require.resolve("./template/template.hbs"),
        partials: path.resolve(__dirname,"template"),
        helpers: require("./src/handlebars-helper.js"),
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
        preprocessor: function(obj) { return obj; }
    })
};
