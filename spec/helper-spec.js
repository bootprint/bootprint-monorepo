/* global describe */
/* global it */
/* global expect */
var helpers = require("../handlebars/helpers.js");
describe("the 'htmlId'-helper'", function() {
    it("should replace illegal characters with '-'", function() {
        expect(helpers.htmlId(";/abc")).toBe("--abc");
    })
})
