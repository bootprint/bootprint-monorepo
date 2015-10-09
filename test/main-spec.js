/*!
 * customize-write-files <https://github.com/nknapp/customize-write-files>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
/* global after */
/* global before */
// /* global xdescribe */
// /* global xit */

'use strict'
var path = require('path')
// var Buffer = require('buffer')
var stream = require('stream')
var fs = require('fs')
var expect = require('chai').expect

describe('customize-write-files:', function () {
  var customizeWriteFiles = require('../')
  var outputDir

  function read (filename) {
    var fullPath = path.join(outputDir,filename)
    return fs.readFileSync(fullPath, { encoding: 'utf-8' })
  }

  // Run file-writer
  before(function () {
    outputDir = path.join(__dirname, '..', 'test-output', Date.now().toString())

    // From: http://stackoverflow.com/questions/12755997/how-to-create-streams-from-string-in-node-js
    var s = new stream.Readable()
    s._read = function noop () {}; // redundant? see update below
    s.push('abc')
    s.push(null)

    // Call the module and return the promise for finishing the operation,
    // so that mocha waits until all files have been written
    return customizeWriteFiles({
      'engine1': {
        'stream.txt': s,
        'buffer.txt': new Buffer('abc', 'utf8'),
        'string.txt': 'abc'
      }
    }, outputDir)
  })

  // Clean up
  after(function () {
    if (outputDir) {
      //    return qfs.removeTree(outputDir)
    }
  })

  it('should write a stream correctly', function () {
    expect(read('stream.txt')).to.equal('abc')
  })
  it('should write a buffer correctly', function () {
    expect(read('buffer.txt')).to.equal('abc')
  })
  it('should write a string correctly', function () {
    expect(read('string.txt')).to.equal('abc')
  })
})
