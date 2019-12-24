const mergeWith = require('lodash.mergewith')

const files = require('../helpers-io').files
const readFiles = require('../helpers-io').readFiles
const deep = require('deep-aplus')(Promise)
const overrider = require('../').overrider
const expect = require('chai').expect
const stream = require('stream')
const toString = require('stream-to-string')
const TestPromise = require('./testPromise')

/* eslint-env mocha */
describe('the files-function', function() {
  before(() => TestPromise.inject())
  after(() => TestPromise.restore())

  it('should resolve to the contents of all contained files', function() {
    return files('test/fixtures/testPartials1')
      .then(deep)
      .then(function(result) {
        return expect(result).to.deep.equal({
          'eins.hbs': {
            path: 'test/fixtures/testPartials1/eins.hbs',
            contents: 'testPartials1/eins {{eins}}'
          },
          'zwei.hbs': {
            path: 'test/fixtures/testPartials1/zwei.hbs',
            contents: 'testPartials1/zwei {{zwei}}'
          }
        })
      })
  })

  it('should not return and read directories', function() {
    return files('test/fixtures/recursiveFiles')
      .then(deep)
      .then(function(result) {
        return expect(result).to.deep.equal({
          'file1.txt': {
            contents: 'file1\n',
            path: 'test/fixtures/recursiveFiles/file1.txt'
          },
          'subdir/file2.txt': {
            contents: 'file2\n',
            path: 'test/fixtures/recursiveFiles/subdir/file2.txt'
          }
        })
      })
  })

  it('should create mergeable files', async function() {
    const x = files('test/fixtures/testPartials1')
    const result = await deep(mergeWith({ dir: x }, { dir: files('test/fixtures/testPartials2') }, overrider))

    const valueX = await x

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

    // Should be resolved (this file is actually displayed)
    expect(valueX['eins.hbs'].state).to.equal('resolved')

    // zwei.hbs is taken from 'testPartials2' and should not be loaded from 'testPartials1'
    expect(valueX['zwei.hbs'].state).to.equal('pending')
  })

  it('should work correctly with globs', function() {
    const x = files('test/fixtures/testPartials1', { glob: '*ei.hbs' })
    return deep(
      mergeWith({ dir: x }, { dir: files('test/fixtures/testPartials2', { glob: '*ei.hbs' }) }, overrider)
    ).then(function(result) {
      return expect(result).to.eql({
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

  it('should return "undefined" if the path is undefined', function() {
    return expect(files(undefined)).to.equal(undefined)
  })
})

describe('the readFiles-function', function() {
  before(() => TestPromise.inject())
  after(() => TestPromise.restore())

  it('should resolve to the contents of all contained files', function() {
    const x = readFiles('test/fixtures/testPartials1', { encoding: 'utf-8' })
    return Promise.all([x, deep(mergeWith({ dir: x }, { dir: files('test/fixtures/testPartials2') }, overrider))]).then(
      function([_x, result]) {
        // Do this before the promise is resolved
        expect(_x['eins.hbs'].state).to.equal('resolved')
        // zwei.hbs is taken from 'testPartials2' and should not be loaded from 'testPartials1'
        expect(_x['zwei.hbs'].state).to.equal('pending')
        return expect(result).to.eql({
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
      }
    )
  })

  it('should work correctly with globs', function() {
    return deep(
      mergeWith(
        { dir: readFiles('test/fixtures/testPartials1', { glob: '*ei.hbs', encoding: 'utf-8' }) },
        { dir: readFiles('test/fixtures/testPartials2', { glob: '*ei.hbs', encoding: 'utf-8' }) },
        overrider
      )
    ).then(function(result) {
      return expect(result).to.deep.equal({
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

  it('should return a string for each file, if an encoding is set', function() {
    return deep(readFiles('test/fixtures/testPartials1', { encoding: 'utf-8' })).then(function(result) {
      return expect(result).to.deep.equal({
        'eins.hbs': {
          contents: 'testPartials1/eins {{eins}}',
          path: 'test/fixtures/testPartials1/eins.hbs'
        },
        'zwei.hbs': {
          contents: 'testPartials1/zwei {{zwei}}',
          path: 'test/fixtures/testPartials1/zwei.hbs'
        }
      })
    })
  })

  it('should return a Buffer for each file, if no encoding is set', function() {
    return deep(readFiles('test/fixtures/testPartials1')).then(function(result) {
      return expect(result).to.deep.equal({
        'eins.hbs': {
          contents: Buffer.from('testPartials1/eins {{eins}}', 'utf-8'),
          path: 'test/fixtures/testPartials1/eins.hbs'
        },
        'zwei.hbs': {
          contents: Buffer.from('testPartials1/zwei {{zwei}}', 'utf-8'),
          path: 'test/fixtures/testPartials1/zwei.hbs'
        }
      })
    })
  })

  it('should return a stream, if the "stream"-option is set to true', function() {
    return deep(readFiles('test/fixtures/testPartials1', { stream: true }))
      .then(function(result) {
        changeContentsStreamToString(result['eins.hbs'], Buffer)
        changeContentsStreamToString(result['zwei.hbs'], Buffer)
        return deep(result)
      })
      .then(function(result) {
        return expect(result).to.deep.equal({
          'eins.hbs': {
            contents: 'testPartials1/eins {{eins}}',
            path: 'test/fixtures/testPartials1/eins.hbs'
          },
          'zwei.hbs': {
            contents: 'testPartials1/zwei {{zwei}}',
            path: 'test/fixtures/testPartials1/zwei.hbs'
          }
        })
      })
  })

  it('should return a stream with encoding, if the "stream"-option and the "encoding" option are set', function() {
    return deep(readFiles('test/fixtures/testPartials1', { stream: true, encoding: 'utf-8' }))
      .then(function(result) {
        changeContentsStreamToString(result['eins.hbs'], 'string')
        changeContentsStreamToString(result['zwei.hbs'], 'string')
        return deep(result)
      })
      .then(function(result) {
        expect(result).to.deep.equal({
          'eins.hbs': {
            contents: 'testPartials1/eins {{eins}}',
            path: 'test/fixtures/testPartials1/eins.hbs'
          },
          'zwei.hbs': {
            contents: 'testPartials1/zwei {{zwei}}',
            path: 'test/fixtures/testPartials1/zwei.hbs'
          }
        })
      })
  })

  it('should return "undefined" if the path is undefined', function() {
    return expect(readFiles(undefined)).to.equal(undefined)
  })
})

/**
 * Verify the type of data passed in the "contents"-stream and change it into a promise for the resulting string
 * @param file
 * @param {stream.Readable} file.contents the stream
 * @param type the type to check the data against
 */
function changeContentsStreamToString(file, type) {
  expect(file.contents).to.be.an.instanceof(stream.Readable)
  file.contents.on('data', function(data) {
    if (typeof type === 'string') {
      expect(data).to.be.a(type)
    } else {
      expect(data).to.be.an.instanceof(type)
    }
  })
  file.contents = toString(file.contents)
}
