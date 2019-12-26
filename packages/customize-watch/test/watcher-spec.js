const customize = require('../')
const expect = require('chai').expect
const fs = require('fs-extra')
const debug = require('debug')('customize-watch:test')

/* global describe */
/* global before */
/* global it */
// /* global xit */

describe('the watcher', function() {
  this.timeout(5000)
  let customizeInstance = null
  before(async function() {
    await fs.remove('test-tmp')
    await fs.mkdirp('test-tmp')
    await fs.copy('test/fixtures', 'test-tmp')
    customizeInstance = customize()
      .registerEngine('test', require('./filesEngine.js'))
      .merge({
        test: {
          files: 'test-tmp/testPartials1'
        }
      })
      .merge({
        test: {
          files: 'test-tmp/testPartials2'
        }
      })
  })

  it('prerequisite check for expected result in normal run', function() {
    return customizeInstance.run().then(function(result) {
      expect(result).to.deep.equal({
        test: {
          files: {
            'drei.hbs': {
              contents: 'testPartials2/drei {{drei}}',
              path: 'test-tmp/testPartials2/drei.hbs'
            },
            'eins.hbs': {
              contents: 'testPartials1/eins {{eins}}',
              path: 'test-tmp/testPartials1/eins.hbs'
            },
            'zwei.hbs': {
              contents: 'testPartials2/zwei {{zwei}}',
              path: 'test-tmp/testPartials2/zwei.hbs'
            }
          }
        }
      })
    })
  })

  it('should watch files for changes and run customize every time', async function() {
    const customizeWatcher = customizeInstance.watch()
    try {
      await verifyInitialUpdate(customizeWatcher)
      await verifyUpdateAfterFirstChange(customizeWatcher)
      await verifyUpdateAfterSecondChange(customizeWatcher)
      await verifyUpdateAfterThirdChange(customizeWatcher)
    } finally {
      await customizeWatcher.stopWatching()
    }
  })

  async function verifyInitialUpdate(customizeWatcher) {
    debug('verifyInitialUpdate')
    const resultAfterInitialUpdate = await waitForUpdateWhile(customizeWatcher, () => Promise.resolve())
    expect(resultAfterInitialUpdate).to.deep.equal({
      test: {
        files: {
          'eins.hbs': {
            contents: 'testPartials1/eins {{eins}}',
            path: 'test-tmp/testPartials1/eins.hbs'
          },
          'zwei.hbs': {
            contents: 'testPartials2/zwei {{zwei}}',
            path: 'test-tmp/testPartials2/zwei.hbs'
          },
          'drei.hbs': {
            contents: 'testPartials2/drei {{drei}}',
            path: 'test-tmp/testPartials2/drei.hbs'
          }
        }
      }
    })
  }

  async function verifyUpdateAfterFirstChange(customizeWatcher) {
    debug('verifyUpdateAfterFirstChange')
    const resultAfterFirstUpdate = await waitForUpdateWhile(customizeWatcher,
      () => fs.writeFile('test-tmp/testPartials1/eins.hbs', 'overwritten value eins')
    )
    expect(resultAfterFirstUpdate).to.deep.equal({
      test: {
        files: {
          'eins.hbs': {
            contents: 'overwritten value eins',
            path: 'test-tmp/testPartials1/eins.hbs'
          },
          'zwei.hbs': {
            contents: 'testPartials2/zwei {{zwei}}',
            path: 'test-tmp/testPartials2/zwei.hbs'
          },
          'drei.hbs': {
            contents: 'testPartials2/drei {{drei}}',
            path: 'test-tmp/testPartials2/drei.hbs'
          }
        }
      }
    })
  }

  async function verifyUpdateAfterSecondChange(customizeWatcher) {
    debug('verifyUpdateAfterSecondChange')
    const resultAfterSecondUpdate = await waitForUpdateWhile(customizeWatcher, () =>
      fs.writeFile('test-tmp/testPartials2/zwei.hbs', 'overwritten value zwei')
    )
    expect(resultAfterSecondUpdate).to.deep.equal({
      test: {
        files: {
          'eins.hbs': {
            contents: 'overwritten value eins',
            path: 'test-tmp/testPartials1/eins.hbs'
          },
          'zwei.hbs': {
            contents: 'overwritten value zwei',
            path: 'test-tmp/testPartials2/zwei.hbs'
          },
          'drei.hbs': {
            contents: 'testPartials2/drei {{drei}}',
            path: 'test-tmp/testPartials2/drei.hbs'
          }
        }
      }
    })
  }

  async function verifyUpdateAfterThirdChange(customizeWatcher) {
    debug('verifyUpdateAfterThirdChange')
    const resultAfterThirdUpdate = await waitForUpdateWhile(customizeWatcher, () =>
      fs.writeFile('test-tmp/testPartials2/eins.hbs', 'newly created file in overriding directory')
    )

    expect(resultAfterThirdUpdate).to.deep.equal({
      test: {
        files: {
          'eins.hbs': {
            contents: 'newly created file in overriding directory',
            path: 'test-tmp/testPartials2/eins.hbs'
          },
          'zwei.hbs': {
            contents: 'overwritten value zwei',
            path: 'test-tmp/testPartials2/zwei.hbs'
          },
          'drei.hbs': {
            contents: 'testPartials2/drei {{drei}}',
            path: 'test-tmp/testPartials2/drei.hbs'
          }
        }
      }
    })
  }

  async function waitForUpdateWhile(customizeWatcher, action) {
    return new Promise((resolve, reject) => {
      debug("waitForUpdateWhile:add-listener")
      customizeWatcher.once('update', result => {
        const jsonResult = JSON.stringify(result)
        debug('waitForUpdateWhile:result=', jsonResult)
        resolve(JSON.parse(jsonResult))
      })
      debug("run-action", action.toString())
      action().catch(reject)
    })
  }
})
