var path = require("path");

/**
 * This function is called by bootprint and a configuration-builder is passed in.
 * A new builder is created using the configuration of the old one as default values
 * that are overridden by values for this module.
 * @param builder
 * @returns {*}
 */
module.exports = function (builder) {
    return builder
        .load(require("bootprint-base"))
        .merge({
            "partials": path.join(__dirname, "template/"),
            "helpers": require("./src/handlebars-helper.js"),
            "less": {
                "main": [
                    require.resolve("./less/theme.less"),
                    require.resolve("./less/api.less")
                ]
            }
        });
};