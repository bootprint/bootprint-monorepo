/*!
 * bootprint <https://github.com/nknapp/bootprint>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

const path = require('path')

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-as-promised'))
const expect = chai.expect
const { Bootprint } = require('../')
const { DevTool } = require('../lib/dev-mode')
const tmpDir = path.join(__dirname, 'tmp', 'dev-mode')
const targetDir = path.join(tmpDir, 'dev-target')

const fs = require('fs-extra')
const got = require('got')
const childProcess = require('./lib/child-process-for-testing')
const nock = require('nock')

/**
 * Function to sync-read files from the targetDir.
 * @function
 * @param {string} file the path of the file relative to the target directory.
 * @returns {string} the file contents as string
 */
function readResult(file) {
  return fs.readFileSync(path.join(targetDir, file), 'utf-8').trim()
}

function writeInput(file, contents) {
  return fs.writeFile(path.join(tmpDir, file), contents)
}

/**
 * Return the path of a file within the copied template
 * @param {string} file the path relative to the template root
 * @returns {string} the absolute path
 */
function tmp(file) {
  return path.join(tmpDir, file)
}

function relax(millis) {
  return new Promise((resolve, reject) => setTimeout(resolve, millis || 1000))
}
describe('The dev-mode interface', function() {
  this.timeout(5000)
  let devTool
  beforeEach(function() {
    return Promise.resolve()
      .then(() => fs.remove(tmpDir))
      .then(() => fs.mkdirp(tmpDir))
      .then(() => fs.copy('./test/fixtures/dev-mode-template', tmpDir))
  })

  afterEach(function() {
    if (devTool) {
      devTool.stop().then(() => {
        devTool = null
      })
    }
  })

  /**
   * Run the dev-tool for the test
   * @param input
   * @returns {*}
   */
  function runDevTool(input) {
    devTool = new DevTool(new Bootprint(a => a, require(`${tmpDir}/config`)))
    return devTool.watch(input, targetDir)
  }

  it('should watch for changed files', function() {
    return runDevTool(tmp('input.json'))
      .then(() => writeInput('less/main.less', "@abc: '#cde'; body { background: @abc; }"))
      .then(() => relax())
      .then(() =>
        expect(readResult('main.css')).to.equal("body{background:'#cde'}/*# sourceMappingURL=main.css.map */")
      )
  })

  it('should watch for a changed input file', function() {
    return runDevTool(tmp('input.json'))
      .then(() =>
        writeInput(
          'input.json',
          JSON.stringify({
            eins: 'un',
            zwei: 'deux',
            drei: 'trois'
          })
        )
      )
      .then(() => relax())
      .then(() => expect(readResult('index.html')).to.equal('eins=un zwei=deux drei=trois'))
  })

  it('should start a web-server', function() {
    return runDevTool(tmp('input.json'))
      .then(() => writeInput('less/main.less', "@abc: '#cdf'; body { background: @abc; }"))
      .then(() => relax())
      .then(() => got('http://localhost:8181/main.css'))
      .then(response => expect(response.body).to.equal("body{background:'#cdf'}/*# sourceMappingURL=main.css.map */"))
  })

  it('should not attempt to watch http-urls', function() {
    const mockInput = nock('http://example.com')
      .get('/swagger.json')
      .reply(200, { eins: 'un', zwei: 'deux', drei: 'trois' })
    return runDevTool('http://example.com/swagger.json')
      .then(() => relax())
      .then(() => {
        // If we got this far, everything is ok. The test should just not throw an error
        expect(mockInput.isDone()).to.be.true()
      })
  })
})

describe('The dev-mode cli option', function() {
  this.timeout(10000)
  let child
  beforeEach(function() {
    return Promise.resolve()
      .then(() => fs.remove(tmpDir))
      .then(() => fs.mkdirp(tmpDir))
      .then(() => fs.copy('./test/fixtures/dev-mode-template', tmpDir))
      .then(() => {
        child = childProcess.spawn(
          'bin/bootprint.js',
          ['-d', '-f', tmp('config.js'), 'test-module', tmp('input.json'), targetDir],
          {
            encoding: 'utf-8',
            stdio: 'inherit'
          }
        )
      })
      .then(() => relax())
  })

  afterEach(function() {
    return child.kill()
  })

  it('should watch for a changed input file', function() {
    return Promise.resolve()
      .then(() =>
        writeInput(
          'input.json',
          JSON.stringify({
            eins: 'un',
            zwei: 'deux',
            drei: 'trois'
          })
        )
      )
      .then(() => relax(2000))
      .then(() => expect(readResult('index.html')).to.equal('eins=un zwei=deux drei=trois'))
  })
})
