/*!
 * customize-write-files <https://github.com/nknapp/customize-write-files>
 *
 * Copyright (c) 2019 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */
const path = require('path')
const stream = require('stream')
const fs = require('fs-extra')
const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-as-promised'))
const expect = chai.expect
const customizeWriteFiles = require('../')

const tmpDir = 'test-output'

beforeEach(async function() {
  await fs.remove(tmpDir)
  await fs.mkdirp(tmpDir)
})

/**
 * From: http://stackoverflow.com/questions/12755997/how-to-create-streams-from-string-in-node-js
 * Call the module and return the promise for finishing the operation,
 * so that mocha waits until all files have been written
 */
function createStream(contents) {
  const s = new stream.Readable()
  s._read = function noop() {
    // no operation
  }
  s.push(contents)
  s.push(null)
  return s
}

function createBuffer(contents) {
  return Buffer.from(contents)
}

/**
 * Read the contents of a file in the tmpDir
 * @param filename
 */
function read(filename) {
  const fullPath = path.join(tmpDir, filename)
  return fs.readFileSync(fullPath, { encoding: 'utf-8' })
}

/**
 * Run the module with a single file
 */
function run(filename, contents) {
  const files = {}
  files[filename] = contents
  return customizeWriteFiles(tmpDir)({
    engine1: files
  })
}

describe('customize-write-files:', function() {
  describe('The main function (module.exports)', function() {
    it('must return a rejected promise, if two engine each have a file of the same name', async function() {
      await expect(
        customizeWriteFiles(tmpDir)({
          engine1: { 'buffer.txt': createBuffer('buffer-test\n') },
          engine2: { 'buffer.txt': createBuffer('buffer-test\n') }
        })
      ).to.be.rejectedWith(/buffer\.txt.*engine1.*engine2/)
    })

    it('must return a rejected promise, if a files contents is not a string, buffer or readable stream', async function() {
      await expect(
        customizeWriteFiles(tmpDir)({
          engine1: {
            'buffer.txt': {}
          }
        })
      ).to.be.rejectedWith(/test-output\/buffer\.txt/)
    })

    it('should ignore undefined file contents ', async function() {
      const result = await run('stream.txt', undefined)
      expect(result).to.deep.equal([undefined])
      expect(fs.existsSync('test-output/stream.txt')).to.be.false()
    })

    it('should ignore undefined file-lists ', async function() {
      const result = await customizeWriteFiles(tmpDir)({
        engine1: { 'string.txt': 'abc' },
        engine2: undefined
      })
      expect(result).to.deep.equal(['test-output/string.txt'])
      expect(fs.readdirSync('test-output')).to.deep.equal(['string.txt'])
    })

    it('should write a stream correctly', async function() {
      const result = await run('stream.txt', createStream('abc'))
      expect(result).to.deep.equal(['test-output/stream.txt'])
      expect(read('stream.txt')).to.equal('abc')
    })

    it('should write a buffer correctly', async function() {
      const result = await run('buffer.txt', createBuffer('abc'))
      expect(result).to.deep.equal(['test-output/buffer.txt'])
      expect(read('buffer.txt')).to.equal('abc')
    })

    it('should write a string correctly', async function() {
      const result = await run('string.txt', 'abc')
      expect(result).to.deep.equal(['test-output/string.txt'])
      expect(read('string.txt')).to.equal('abc')
    })

    it('should create subdirectories as needed', async function() {
      const result = await run('subdir/string.txt', 'abc')
      expect(result).to.deep.equal(['test-output/subdir/string.txt'])
      expect(read('subdir/string.txt')).to.equal('abc')
    })
  })

  describe('The .changed-function', function() {
    it('should return a resolved promise with "false" for all files, if the contents matches all files', async function() {
      const result = await customizeWriteFiles.changed('test/fixtures/compare')({
        engine1: {
          'buffer.txt': createBuffer('buffer-test\n'),
          'stream.txt': createStream('stream-test\n')
        },
        engine2: {
          'string.txt': 'string-test\n'
        }
      })
      expect(result).to.deep.equal({
        changed: false,
        files: { 'buffer.txt': false, 'stream.txt': false, 'string.txt': false }
      })
    })

    describe('should return true for any changed file, if ', function() {
      it('a buffer-contents does not match', async function() {
        const result = await customizeWriteFiles.changed('test/fixtures/compare')({
          engine1: {
            'buffer.txt': createBuffer('bad buffer-test\n')
          }
        })
        expect(result).to.deep.equal({
          changed: true,
          files: { 'buffer.txt': true }
        })
      })

      it('a stream-contents does not match', async function() {
        const result = await customizeWriteFiles.changed('test/fixtures/compare')({
          engine1: {
            'stream.txt': createStream('bad stream-test\n')
          }
        })
        expect(result).to.deep.equal({
          changed: true,
          files: { 'stream.txt': true }
        })
      })

      it('a file does not exist', async function() {
        const result = await customizeWriteFiles.changed('test/fixtures/compare')({
          engine1: {
            'does-not-exist1.txt': createStream('abc'),
            'does-not-exist2.txt': createBuffer('abc'),
            'does-not-exist3.txt': 'abc'
          }
        })
        expect(result).to.deep.equal({
          changed: true,
          files: {
            'does-not-exist1.txt': true,
            'does-not-exist2.txt': true,
            'does-not-exist3.txt': true
          }
        })
      })

      it('a string-contents does not match', async function() {
        const result = await customizeWriteFiles.changed('test/fixtures/compare')({
          engine1: {
            'string.txt': 'bad string-test'
          }
        })
        return expect(result).to.deep.equal({
          changed: true,
          files: { 'string.txt': true }
        })
      })

      it('if one of multiple files does not match', async function() {
        const result = await customizeWriteFiles.changed('test/fixtures/compare')({
          engine1: {
            'buffer.txt': createBuffer('bad buffer-test\n'),
            'stream.txt': createStream('stream-test\n')
          },
          engine2: {
            'string.txt': 'string-test\n'
          }
        })
        expect(result).to.deep.equal({
          changed: true,
          files: { 'buffer.txt': true, 'stream.txt': false, 'string.txt': false }
        })
      })

      it('multiple files do not match', async function() {
        const result = await customizeWriteFiles.changed('test/fixtures/compare')({
          engine1: {
            'buffer.txt': createBuffer('bad buffer-test\n'),
            'stream.txt': createStream('stream-test\n')
          },
          engine2: {
            'string.txt': 'bad string-test\n'
          }
        })
        expect(result).to.deep.equal({
          changed: true,
          files: { 'buffer.txt': true, 'stream.txt': false, 'string.txt': true }
        })
      })

      it('a buffer has the same size but different contents than the file (coverage)', async function() {
        const result = await customizeWriteFiles.changed('test/fixtures/compare')({
          engine1: {
            'buffer.txt': createBuffer('badfer-test\n')
          }
        })
        expect(result).to.deep.equal({
          changed: true,
          files: { 'buffer.txt': true }
        })
      })
    })

    it('should return a rejected promise, there was another error than a missing file', async function() {
      await fs.mkdirp('test-output/tmpdir')
      await expect(
        customizeWriteFiles.changed('test-output')({
          engine1: {
            // Directory prohibits file read
            tmpdir: 'abc'
          }
        })
      ).to.be.rejectedWith(/EISDIR/)
    })

    it('should return false, if the provided contents is undefined or null', async function() {
      const result = await customizeWriteFiles.changed('test/fixtures/compare')({
        engine1: {
          'buffer.txt': null
        }
      })
      expect(result).to.deep.equal({
        changed: false,
        files: { 'buffer.txt': false }
      })
    })

    it('must return a rejected promise, if a files contents is not a string, buffer or readable stream', async function() {
      await expect(
        customizeWriteFiles.changed(tmpDir)({
          engine1: {
            'buffer.txt': {}
          }
        })
      ).to.be.rejectedWith(/test-output\/buffer\.txt/)
    })
  })
})
