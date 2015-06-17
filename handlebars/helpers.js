var Handlebars = require("handlebars");
var marked = require("marked");
var cheerio = require("cheerio");
var highlight = require('highlight.js');


highlight.configure({
    "useBR": true
});

marked.setOptions({
    highlight: function (code, name) {

        var highlighted;
        if (name) {
            highlighted = highlight.highlight(name, code).value;
        } else {
            highlighted = highlight.highlightAuto(code).value;
        }
        return highlight.fixMarkup(highlighted);
    }
});

module.exports = {
    /**
     * Converts a string to uppercase
     * @name toUpperCase
     * @param {string} value the input string
     * @returns {string} the uppercase string
     * @api public
     */
    'toUpperCase': function(value) {
        return value ? value.toUpperCase() : '';
    },
    /**
     * This block-helper can be used to iterate objects sorted by key. It behaves like the built-in
     * `{{#each ...}}`-helper except that it can only be used for objects and the output is in a
     * deterministic order (i.e. sorted).
     *
     * Example template:
     *
     * ```handlebars
     * {{#eachSorted obj}}
     *    {{@index}} of {{@length}}: {{@key}}={{.}}
     * {{/eachSorted}}
     * ```
     *
     * With the data `{ b: 'another one', a: 'first' }`, ignoring newlines and indents, this will output
     *
     * ```text
     * 1 of 2: a=first
     * 2 of 2: b=another one
     * ```
     *
     * The helper will set the following @-values according to the Handlebars documentation:
     * `@first`, `@index`, `@key`, `@last`, `@length`
     * @name eachSorted
     * @returns {string}
     * @api public
     */
    'eachSorted': function (context, options) {
        var ret = "";
        var data;
        if (typeof context !== "object") {
            return ret;
        }
        var keys = Object.keys(context);
        keys.sort().forEach(function (key,index) {
            if (options.data) {
                data = Handlebars.createFrame(options.data || {});
                data.index = index;
                data.key = key;
                data.length = keys.length;
                data.first = index === 0;
                data.last = index === keys.length-1;

            }
            ret = ret + options.fn(context[key], { data: data})
        });
        return ret
    },
    /**
     * Render a markdown-formatted text as HTML.
     * @param {string} `value` the markdown-formatted text
     * @param {boolean} `strip` the marked-md-renderer wraps generated HTML in a <p>-tag by default.
     *      If this options is set to true, the <p>-tag is stripped.
     * @returns {Handlebars.SafeString} a Handlebars-SafeString containing the provieded
     *      markdown, rendered as HTML.
     */
    'md': function (value, strip) {
        if (!value) {
            return value;
        }
        var $ = cheerio.load(marked(value));
        return new Handlebars.SafeString(strip ? $("p").html() : $.html());
    },

    /**
     * Block helper that compares to values. The body is executed if both value equal.
     * Example:
     *
     * ```hbs
     * {#ifeq value 10}
     *    Value is 10
     * {else}
     *    Value is not 10
     * {/ifeq}
     * ```
     *
     * @param {object} `v1` the first value
     * @param {object} `v2` the second value
     */
    "ifeq": function (v1, v2, options) {
        // http://stackoverflow.com/questions/8853396/logical-operator-in-a-handlebars-js-if-conditional
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    "json": function (value) {
        if (!value) {
            return "";
        }
        var schemaString = require("json-stable-stringify")(value, {space: 4});

        var $ = cheerio.load(marked("```json\r\n" + schemaString + "\n```"));
        var definitions = $('span:not(:has(span)):contains("#/definitions/")');
        definitions.each(function (index, item) {
            var ref = $(item).html();
            // TODO: This should be done in a template
            $(item).html("<a href=" + ref.replace(/&quot;/g, "") + ">" + ref + "</a>");
        });

        return new Handlebars.SafeString($.html());
    },
    "ifcontains": function (array, object, options) {
        if (array && array.indexOf(object) >= 0) {
            return options.fn(this);
        }
        return options.inverse(this);
    },

    /**
     * Replace all characters that may not be used in HTML id-attributes by '-'.
     * There is still the restriction that IDs may only start with letters, which
     * is not addressed by this helper.
     */
    "htmlId": function(value) {
        return value.replace(/[^A-Za-z0-9-_:.]/g,"-");
    }
};

