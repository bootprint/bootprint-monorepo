var _ = require('lodash')

var files = require('../helpers-io').files
var readFiles = require('../helpers-io').readFiles
var deep = require('deep-aplus')(require('q').Promise)
var overrider = require('../').overrider
var expect = require('chai').expect
var stream = require('stream')

var toString = require('stream-to-string')

/* global describe */
/* global it */
// /* global xit */

describe('the files-function', function () {
  var x

  it('should resolve to the contents of all contained files', function () {
    files('test/fixtures/testPartials1')
      .then(function (result) {
        expect(result).to.deep.equal({
          'eins.hbs': {
            path: 'test/fixtures/testPartials1/eins.hbs',
            contents: 'testPartials1/eins {{eins}}'
          },
          'zwei.hbs': {
            path: 'test/fixtures/testPartials2/zwei.hbs',
            contents: 'testPartials2/zwei {{zwei}}'
          }
        })
      })
  })

  it('should create mergeable filesfiles', function () {
    var x = files('test/fixtures/testPartials1')
    return deep(
      _.mergeWith(
        { dir: x },
        { dir: files('test/fixtures/testPartials2') },
        overrider)
    )
      .then(function (result) {
        expect(result).to.deep.equal({
          dir: {
            'eins.hbs': {
              path: 'test/fixtures/testPartials1/eins.hbs',
              contents: 'testPartials1/eins {{eins}}'
            },
            'zwei.hbs': {
              path: 'test/fixtures/testPartials2/zwei.hbs',
              contents: 'testPartials2/zwei {{zwei}}'
            },
            'drei.hbs': {
              path: 'test/fixtures/testPartials2/drei.hbs',
              contents: 'testPartials2/drei {{drei}}'
            }
          }
        })

        // Do this before the promise is resolved
        expect(x.valueOf()['eins.hbs'].inspect().state).to.equal('fulfilled')
        // zwei.hbs is taken from 'testPartials2' and should not be loaded from 'testPartials1'
        expect(x.valueOf()['zwei.hbs'].inspect().state).to.equal('pending')
      })
  })

  it('should work correctly with globs', function () {
    x = files('test/fixtures/testPartials1', { glob: '*ei.hbs' })
    return deep(
      _.mergeWith(
        { dir: x },
        { dir: files('test/fixtures/testPartials2', { glob: '*ei.hbs' }) },
        overrider)
    )
      .then(function (result) {
        expect(result).to.eql({
          dir: {
            'zwei.hbs': {
              path: 'test/fixtures/testPartials2/zwei.hbs',
              contents: 'testPartials2/zwei {{zwei}}'
            },
            'drei.hbs': {
              path: 'test/fixtures/testPartials2/drei.hbs',
              contents: 'testPartials2/drei {{drei}}'
            }
          }
        })
      })
  })

  it('should return "undefined" if the path is undefined', function () {
    expect(files(undefined)).to.equal(undefined)
  })
})

describe('the readFiles-function', function () {
  var x

  it('should resolve to the contents of all contained files', function () {
    var x = readFiles('test/fixtures/testPartials1', { encoding: 'utf-8' })
    return deep(
      _.mergeWith(
        { dir: x },
        { dir: files('test/fixtures/testPartials2') },
        overrider)
    )
      .then(function (result) {
        expect(result).to.eql({
          dir: {
            'eins.hbs': {
              path: 'test/fixtures/testPartials1/eins.hbs',
              contents: 'testPartials1/eins {{eins}}'
            },
            'zwei.hbs': {
              path: 'test/fixtures/testPartials2/zwei.hbs',
              contents: 'testPartials2/zwei {{zwei}}'
            },
            'drei.hbs': {
              path: 'test/fixtures/testPartials2/drei.hbs',
              contents: 'testPartials2/drei {{drei}}'
            }
          }
        })

        // Do this before the promise is resolved
        expect(x.valueOf()['eins.hbs'].inspect().state).to.equal('fulfilled')
        // zwei.hbs is taken from 'testPartials2' and should not be loaded from 'testPartials1'
        expect(x.valueOf()['zwei.hbs'].inspect().state).to.equal('pending')
      })
  })

  it('should work correctly with globs', function () {
    x = readFiles('test/fixtures/testPartials1', { glob: '*ei.hbs', encoding: 'utf-8' })
    return deep(
      _.mergeWith(
        { dir: x },
        { dir: files('test/fixtures/testPartials2', { glob: '*ei.hbs', encoding: 'utf-8' }) },
        overrider)
    )
      .then(function (result) {
        expect(result).to.deep.equal({
          dir: {
            'zwei.hbs': {
              path: 'test/fixtures/testPartials2/zwei.hbs',
              contents: 'testPartials2/zwei {{zwei}}'
            },
            'drei.hbs': {
              path: 'test/fixtures/testPartials2/drei.hbs',
              contents: 'testPartials2/drei {{drei}}'
            }
          }
        })
      })
  })

  it('should return a string for each file, if an encoding is set', function () {
    return deep(readFiles('test/fixtures/testPartials1', { encoding: 'utf-8' }))
      .then(function (result) {
        return expect(result).to.deep.equal({
          'eins.hbs': {
            'contents': 'testPartials1/eins {{eins}}',
            'path': 'test/fixtures/testPartials1/eins.hbs'
          },
          'zwei.hbs': {
            'contents': 'testPartials1/zwei {{zwei}}',
            'path': 'test/fixtures/testPartials1/zwei.hbs'
          }
        })
      })
  })

  it('should return a Buffer for each file, if no encoding is set', function () {
    return deep(readFiles('test/fixtures/testPartials1'))
      .then(function (result) {
        return expect(result).to.deep.equal({
          'eins.hbs': {
            'contents': new Buffer('testPartials1/eins {{eins}}', 'utf-8'),
            'path': 'test/fixtures/testPartials1/eins.hbs'
          },
          'zwei.hbs': {
            'contents': new Buffer('testPartials1/zwei {{zwei}}', 'utf-8'),
            'path': 'test/fixtures/testPartials1/zwei.hbs'
          }
        })
      })
  })

  it('should return a stream, if the "stream"-option is set to true', function () {
    return deep(readFiles('test/fixtures/testPartials1', { stream: true }))
      .then(function (result) {
        changeContentsStreamToString(result['eins.hbs'], Buffer)
        changeContentsStreamToString(result['zwei.hbs'], Buffer)
        return deep(result)
      })
      .then(function (result) {
        expect(result).to.deep.equal({
          'eins.hbs': {
            'contents': 'testPartials1/eins {{eins}}',
            'path': 'test/fixtures/testPartials1/eins.hbs'
          },
          'zwei.hbs': {
            'contents': 'testPartials1/zwei {{zwei}}',
            'path': 'test/fixtures/testPartials1/zwei.hbs'
          }
        })
      })
  })

  it('should return a stream with encoding, if the "stream"-option and the "encoding" option are set', function () {
    return deep(readFiles('test/fixtures/testPartials1', { stream: true, encoding: 'utf-8' }))
      .then(function (result) {
        changeContentsStreamToString(result['eins.hbs'], 'string')
        changeContentsStreamToString(result['zwei.hbs'], 'string')
        return deep(result)
      })
      .then(function (result) {
        expect(result).to.deep.equal({
          'eins.hbs': {
            'contents': 'testPartials1/eins {{eins}}',
            'path': 'test/fixtures/testPartials1/eins.hbs'
          },
          'zwei.hbs': {
            'contents': 'testPartials1/zwei {{zwei}}',
            'path': 'test/fixtures/testPartials1/zwei.hbs'
          }
        })
      })
  })

  it('should return "undefined" if the path is undefined', function () {
    expect(readFiles(undefined)).to.equal(undefined)
  })
})

/**
 * Verify the type of data passed in the "contents"-stream and change it into a promise for the resulting string
 * @param file
 * @param {stream.Readable} file.contents the stream
 * @param type the type to check the data against
 */
function changeContentsStreamToString (file, type) {
  expect(file.contents).to.be.an.instanceof(stream.Readable)
  file.contents.on('data', function (data) {
    if (typeof type === 'string') {
      expect(data).to.be.a(type)
    } else {
      expect(data).to.be.an.instanceof(type)
    }
  })
  file.contents = toString(file.contents)
}

