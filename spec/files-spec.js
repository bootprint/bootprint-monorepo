var _ = require("lodash");

var directory = require("../lib/files.js")
var deep = require("q-deep");
var Q = require("q");
var overrider = require("../").overrider;


describe("the directory-function", function () {
  it("should resolve to the contents of all contained files", function (next) {
    deep(_.merge(
      {dir: directory("spec/fixtures/testPartials1")},
      {dir: directory("spec/fixtures/testPartials2")},
      {dir: directory("spec/fixtures/testPartialsA")},
      overrider
    )).then(console.log).done(next)
  })
});
