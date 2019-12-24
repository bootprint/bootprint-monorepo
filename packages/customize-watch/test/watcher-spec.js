const customize = require('../')
const expect = require('chai').expect
const qfs = require('m-io/fs')

/* global describe */
/* global before */
/* global it */
// /* global xit */

describe('the watcher', function() {
  this.timeout(5000)
  let cu = null
  before(function() {
    return qfs
      .removeTree('test-tmp')
      .then(function() {
        return qfs.makeTree('test-tmp')
      })
      .then(function() {
        return qfs.copyTree('test/fixtures', 'test-tmp')
      })
      .then(function() {
        cu = customize()
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
  })

  it('prerequisite check for expected result in normal run', function() {
    return cu.run().then(function(result) {
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

  it('should watch files for changes and run customize every time', function(done) {
    const results = []
    const actions = [
      function modifyFileFromPartials1() {
        qfs.write('test-tmp/testPartials1/eins.hbs', 'abc')
      },
      function modifyFileFromPartials2() {
        qfs.write('test-tmp/testPartials2/zwei.hbs', 'abc')
      },
      function overrideFileInPartials2() {
        qfs.write('test-tmp/testPartials2/eins.hbs', 'cde')
      }
    ]

    // Run first action
    actions.shift()()
    const watcher = cu.watch()
    setTimeout(() => watcher.stopWatching(), 2000)
    watcher.on('update', function(result) {
      console.log('update received', result)
      results.push(JSON.parse(JSON.stringify(result)))
      if (actions.length > 0) {
        // Run next action
        setTimeout(actions.shift(), 100)
      } else {
        // Checking the result of all actions
        expect(results).to.deep.equal([
          {
            test: {
              files: {
                'drei.hbs': {
                  contents: 'testPartials2/drei {{drei}}',
                  path: 'test-tmp/testPartials2/drei.hbs'
                },
                'eins.hbs': {
                  contents: 'abc',
                  path: 'test-tmp/testPartials1/eins.hbs'
                },
                'zwei.hbs': {
                  contents: 'testPartials2/zwei {{zwei}}',
                  path: 'test-tmp/testPartials2/zwei.hbs'
                }
              }
            }
          },
          {
            test: {
              files: {
                'drei.hbs': {
                  contents: 'testPartials2/drei {{drei}}',
                  path: 'test-tmp/testPartials2/drei.hbs'
                },
                'eins.hbs': {
                  contents: 'abc',
                  path: 'test-tmp/testPartials1/eins.hbs'
                },
                'zwei.hbs': {
                  contents: 'abc',
                  path: 'test-tmp/testPartials2/zwei.hbs'
                }
              }
            }
          },
          {
            test: {
              files: {
                'drei.hbs': {
                  contents: 'testPartials2/drei {{drei}}',
                  path: 'test-tmp/testPartials2/drei.hbs'
                },
                'eins.hbs': {
                  contents: 'cde',
                  path: 'test-tmp/testPartials2/eins.hbs'
                },
                'zwei.hbs': {
                  contents: 'abc',
                  path: 'test-tmp/testPartials2/zwei.hbs'
                }
              }
            }
          }
        ])
        watcher.stopWatching()
        done()
      }
    })
  })
})
