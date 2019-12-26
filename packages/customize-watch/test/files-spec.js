const _ = require('lodash')

const files = require('../helpers-io').files
const deep = require('deep-aplus')(require('q').Promise)
const overrider = require('../').overrider
const expect = require('chai').expect
const sinon = require('sinon')
const fs = require('fs')
const path = require('path')

describe('the files-function', function() {
  afterEach(function() {
    sinon.restore()
  })

  it('should resolve to the contents of all contained files', function() {
    const readFileSpy = sinon.spy(fs, 'readFile')

    const filesPromise = files('test/fixtures/testPartials1')
    return deep(_.merge({ dir: filesPromise }, { dir: files('test/fixtures/testPartials2') }, overrider)).then(function(
      result
    ) {
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

      const filesRead = readFileSpy.args.map(args => args[0]).map(asRelativePosixPath)

      // Do this before the promise is resolved
      expect(filesRead).to.contain('test/fixtures/testPartials1/eins.hbs')
      // zwei.hbs is taken from 'testPartials2' and should not be loaded from 'testPartials1'
      expect(filesRead).not.to.contain('test/fixtures/testPartials1/zwei.hbs')
    })

    function asRelativePosixPath(filePath) {
      if (filePath == null) {
        throw new Error('FilePath must be non-null')
      }
      let relativePath = path.relative(process.cwd(), filePath);
      return relativePath.replace(/\\/g, '/')
    }
  })

  it('should work correctly with globs', function() {
    const x = files('test/fixtures/testPartials1', { glob: '*ei.hbs' })
    return deep(
      _.merge({ dir: x }, { dir: files('test/fixtures/testPartials2', { glob: '*ei.hbs' }) }, overrider)
    ).then(function(result) {
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
})
