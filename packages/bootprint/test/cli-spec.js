/*!
 * bootprint <https://github.com/nknapp/bootprint>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

const path = require('path')
const fs = require('fs')
const childProcess = require('./lib/child-process-for-testing')
const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-as-promised'))
const expect = chai.expect
const pify = require('pify')
const makeTree = pify(require('mkdirp'))
const removeTree = pify(require('rimraf'))

describe('The CLI interface', function() {
  const tmpDir = path.join(__dirname, 'tmp')
  const targetDir = path.resolve(tmpDir, 'cli-target')

  beforeEach(function() {
    return removeTree(tmpDir).then(function() {
      return makeTree(tmpDir)
    })
  })

  /**
   * Execute a command, but never throw an error. If an error is set,
   * return it in the result, so that the tests can verify it.
   * @returns {Promise}
   */
  function execBootprint(...args) {
    return childProcess.execFile('bin/bootprint.js', args)
  }

  function outputFile(filename) {
    return fs.readFileSync(path.join(targetDir, filename), { encoding: 'utf-8' }).trim()
  }

  it('should run without errors if the correct number of parameters is provided', function() {
    return execBootprint('test-module', './test/fixtures/input.yaml', targetDir).then(function(result) {
      expect(result.err).to.be.null()
      expect(outputFile('index.html'), 'Checking index.html').to.equal(
        'bootprint-test-module eins=ichi zwei=ni drei=san'
      )
      expect(outputFile('main.css'), 'Checking main.css').to.equal(
        "body{background-color:'#000'}/*# sourceMappingURL=main.css.map */"
      )
      expect(outputFile('main.css.map'), 'Source map main.css.map must exist').to.be.ok()
    })
  })

  it('should load a config file, if requested', function() {
    return execBootprint(
      '-f',
      './test/fixtures/config-file.js',
      'test-module',
      './test/fixtures/input.yaml',
      targetDir
    ).then(function(result) {
      expect(result.err).to.be.null()
      expect(outputFile('index.html'), 'Checking index.html').to.equal('eins=ichi zwei=ni drei=san')
      expect(outputFile('main.css'), 'Checking main.css').to.equal(
        "body{background-color:'#abc'}/*# sourceMappingURL=main.css.map */"
      )
      expect(outputFile('main.css.map'), 'Source map main.css.map must exist').to.be.ok()
    })
  })

  it('should show an error if the module could not be loaded correctly', function() {
    return execBootprint('./test/fixtures/test-module-error.js', './test/fixtures/input.yaml', targetDir).then(function(
      result
    ) {
      console.log(result.err)
      expect(result.err).to.match(/at.*Bootprint\.run/)
    })
  })

  it('should return with a non-zero exit-code and an error message if too few parameters are given', function() {
    return execBootprint('./test/fixtures/input.yaml ', targetDir).then(function(result) {
      expect(result.err).not.to.be.null()
      expect(result.stderr, 'Checking stderr-output').to.match(/Usage:*/)
      expect(result.status === 1, 'Checking exit-code')
    })
  })

  it('should return with a non-zero exit-code and without stack-trace if the source file could not be found', function() {
    return execBootprint('./test/fixtures/test-module.js', './test/fixtures/non-existing-file.yaml', targetDir).then(
      function(result) {
        expect(result.stderr.trim(), 'Checking stderr-output').to.equal(
          "Error: ENOENT: no such file or directory, open './test/fixtures/non-existing-file.yaml'"
        )
        expect(result.stderr, 'stderr should not contain a stack-trace').not.to.match(/at /)
        expect(result.error).not.to.be.null()
      }
    )
  })

  it('should return with a non-zero exit-code and an error with stack-trace for unexpected errors', function() {
    return execBootprint('./test/fixtures/test-module-error.js', './test/fixtures/input.yaml', targetDir).then(function(
      result
    ) {
      expect(result.stderr, 'stderr should contain a stack-trace').to.match(/throw new Error/)
      expect(result.error).not.to.be.null()
    })
  })

  it('should return with a non-zero exit-code and an error with stack-trace for unexpected errors (async errors)', function() {
    return execBootprint('./test/fixtures/test-module-async-error.js', './test/fixtures/input.yaml', targetDir).then(
      function(result) {
        expect(result.stderr, 'stderr should contain a stack-trace').to.match(/at Object.preprocessor/)
        expect(result.error).not.to.be.null()
      }
    )
  })
})
