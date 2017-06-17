/*!
 * thought-plugin-bootprint <https://github.com/bootprint/thought-plugin-bootprint>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const helpers = require('../src/helpers')
const hbs = require('customize-engine-handlebars')
const deep = require('deep-aplus')(Promise)

function run (template, data) {
  return hbs.run({
    partials: {},
    partialWrapper: a => a,
    helpers: helpers,
    templates: {
      main: {
        path: 'dummy-template.hbs',
        contents: template
      }
    },
    data: data,
    preprocessor: a => a,
    hbsOptions: {}
  })
    .then(deep)
    .then((output) => output.main)
}

describe('the handlebars-helpers:', function () {
  describe('the codeblock-helper', function () {
    it('should wrap the block with at least three backticks', function () {
      return run('{{#codeBlock}}abc\n{{/codeBlock}}')
        .then((result) => expect(result).to.equal('```\nabc\n```'))
    })

    it('should should use more backticks, if three backticks appear in the block', function () {
      return run('{{#codeBlock}}abc```\n{{/codeBlock}}')
        .then((result) => expect(result).to.equal('````\nabc```\n````'))
    })

    it('should should work with multiple backticked fences in the block', function () {
      return run('{{#codeBlock}}\n`abc`\n{{/codeBlock}}')
        .then((result) => expect(result).to.equal('```\n`abc`\n```'))
    })
  })
})
