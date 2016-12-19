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

var tmpDir = path.join(__dirname, '..', 'test-output')

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
  s._read = function noop () {}
  s.push(contents)
  s.push(null)
  return s
}

/**
 * Read the contents of a file in the tmpDir
 * @param filename
 */
function read (filename) {
  var fullPath = path.join(tmpDir, filename)
  return fs.readFileSync(fullPath, {encoding: 'utf-8'})
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
  it('should write a stream correctly', function () {
    return run('stream.txt', createStream('abc'))
      .then(function () {
        expect(read('stream.txt')).to.equal('abc')
      })
  })

  it('should write a buffer correctly', function () {
    return run('buffer.txt', createStream('abc'))
      .then(function () {
        expect(read('buffer.txt')).to.equal('abc')
      })
  })

  it('should write a string correctly', function () {
    return run('string.txt', 'abc')
      .then(function () {
        expect(read('string.txt')).to.equal('abc')
      })
  })

  it('should create subdirectories as needed', function () {
    return run('subdir/string.txt', 'abc')
      .then(function () {
        expect(read('subdir/string.txt')).to.equal('abc')
      })
  })
})
