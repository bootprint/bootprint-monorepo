/*!
 * customize-write-files <https://github.com/nknapp/customize-write-files>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
// /* global after */
/* global beforeEach */
// /* global xdescribe */
// /* global xit */

'use strict'
var path = require('path')
// var Buffer = require('buffer')
var stream = require('stream')
var fs = require('fs')
var expect = require('chai').expect
var qfs = require('m-io/fs')
var customizeWriteFiles = require('../')

var tmpDir = 'test-output'

beforeEach(function () {
  return qfs.removeTree(tmpDir)
    .then(function () {
      return qfs.makeTree(tmpDir)
    })
})

/**
 * From: http://stackoverflow.com/questions/12755997/how-to-create-streams-from-string-in-node-js
 * Call the module and return the promise for finishing the operation,
 * so that mocha waits until all files have been written
 */
function createStream (contents) {
  var s = new stream.Readable()
  s._read = function noop () {
    // no operation
  }
  s.push(contents)
  s.push(null)
  return s
}

function createBuffer (contents) {
  return Buffer.from ? Buffer.from(contents) : new Buffer(contents)
}

/**
 * Read the contents of a file in the tmpDir
 * @param filename
 */
function read (filename) {
  var fullPath = path.join(tmpDir, filename)
  return fs.readFileSync(fullPath, { encoding: 'utf-8' })
}

/**
 * Run the module with a single file
 */
function run (filename, contents) {
  var files = {}
  files[filename] = contents
  return customizeWriteFiles(tmpDir)({
    'engine1': files
  })
}

describe('customize-write-files:', function () {
  describe('The main function (module.exports)', function () {
    it('should write a stream correctly', function () {
      return run('stream.txt', createStream('abc'))
        .then(function (result) {
          expect(result).to.deep.equal(['test-output/stream.txt'])
          expect(read('stream.txt')).to.equal('abc')
        })
    })

    it('should write a buffer correctly', function () {
      return run('buffer.txt', createBuffer('abc'))
        .then(function (result) {
          expect(result).to.deep.equal(['test-output/buffer.txt'])
          expect(read('buffer.txt')).to.equal('abc')
        })
    })

    it('should write a string correctly', function () {
      return run('string.txt', 'abc')
        .then(function (result) {
          expect(result).to.deep.equal(['test-output/string.txt'])
          expect(read('string.txt')).to.equal('abc')
        })
    })

    it('should create subdirectories as needed', function () {
      return run('subdir/string.txt', 'abc')
        .then(function (result) {
          expect(result).to.deep.equal(['test-output/subdir/string.txt'])
          expect(read('subdir/string.txt')).to.equal('abc')
        })
    })
  })

  describe('The .unchanged-function', function () {
    it('should return a resolved promise with "false" for all files, if the contents matches all files', function () {
      return customizeWriteFiles.changed('test/fixtures/compare')({
        engine1: {
          'buffer.txt': createBuffer('buffer-test\n'),
          'stream.txt': createStream('stream-test\n')
        },
        engine2: {
          'string.txt': 'string-test\n'
        }
      })
        .then(function (result) {
          return expect(result).to.deep.equal({
            changed: false,
            files: { 'buffer.txt': false, 'stream.txt': false, 'string.txt': false }
          })
        })
    })

    describe('should return true for any changed file, if ', function () {
      it('a buffer-contents does not match', function () {
        return customizeWriteFiles.changed('test/fixtures/compare')({
          engine1: {
            'buffer.txt': createBuffer('bad buffer-test\n')
          }
        }).then(function (result) {
          console.log(result)
          return expect(result).to.deep.equal({
            changed: true,
            files: { 'buffer.txt': true }
          })
        })
      })

      it('a stream-contents does not match', function () {
        return customizeWriteFiles.changed('test/fixtures/compare')({
          engine1: {
            'stream.txt': createStream('bad stream-test\n')
          }
        }).then(function (result) {
          expect(result).to.deep.equal({
            changed: true,
            files: { 'stream.txt': true }
          })
        })
      })

      it('a file does not exist', function () {
        return customizeWriteFiles.changed('test/fixtures/compare')({
          engine1: {
            'does-not-exist1.txt': createStream('abc'),
            'does-not-exist2.txt': createBuffer('abc'),
            'does-not-exist3.txt': 'abc'
          }
        }).then(function (result) {
          expect(result).to.deep.equal({
            changed: true,
            files: {
              'does-not-exist1.txt': true,
              'does-not-exist2.txt': true,
              'does-not-exist3.txt': true
            }
          })
        })
      })

      it('a string-contents does not match', function () {
        return customizeWriteFiles.changed('test/fixtures/compare')({
          engine1: {
            'string.txt': 'bad string-test'
          }
        }).then(function (result) {
          expect(result).to.deep.equal({
            changed: true,
            files: { 'string.txt': true }
          })
        })
      })

      it('if one of multiple files does not match', function () {
        return customizeWriteFiles.changed('test/fixtures/compare')({
          engine1: {
            'buffer.txt': createBuffer('bad buffer-test\n'),
            'stream.txt': createStream('stream-test\n')
          },
          engine2: {
            'string.txt': 'string-test\n'
          }
        }).then(function (result) {
          console.log(result)
          return expect(result).to.deep.equal({
            changed: true,
            files: { 'buffer.txt': true, 'stream.txt': false, 'string.txt': false }
          })
        })
      })

      it('multiple files do not match', function () {
        return customizeWriteFiles.changed('test/fixtures/compare')({
          engine1: {
            'buffer.txt': createBuffer('bad buffer-test\n'),
            'stream.txt': createStream('stream-test\n')
          },
          engine2: {
            'string.txt': 'bad string-test\n'
          }
        }).then(function (result) {
          expect(result).to.deep.equal({
            changed: true,
            files: { 'buffer.txt': true, 'stream.txt': false, 'string.txt': true }
          })
        })
      })
    })
  })
})
