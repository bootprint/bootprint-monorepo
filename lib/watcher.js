/*!
 * customize <https://github.com/nknapp/ride-over>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

/*
 * Use the `debug`-module to provide debug output if needed
 */
var debug = require('debug')('customize:watcher')
var Q = require('q')
var qfs = require('q-io/fs')
var deep = require('q-deep')
var _ = require('lodash')
var events = require('events')
var chokidar = require('chokidar')
var path = require('path')

/**
 * Creates a new watcher that invokes customize whenever a watched file
 * (or a file in a watched directory) changes
 * @param recustomize
 * @param {object<string[]>} watches watched files and directories
 *
 */
module.exports = function (recustomize) {
  var emitter = new events.EventEmitter()
  var result = null
  // Determine watched files from configuration
  recustomize.watched()

    // Compute and register watched files and dirs:
    .then(function (watched) {
      // For each watched file or diretory...
      _.each(watched, function (paths, engineName) {
        deep(paths.map(function (aPath) {
          // ... determine whether it is a directory
          return {
            path: path.resolve(aPath),
            isDir: qfs.isDirectory(aPath)
          }
        }))
          .then(function (pathsWithType) {
            // Sort dirs and files in different buckets
            var dirs = []
            var files = []
            pathsWithType.forEach(function (pathWithType) {
              if (pathWithType.isDir) {
                dirs.push(pathWithType.path)
              } else {
                files.push(pathWithType.path)
              }
            })

            // Register watchers with chokidar
            watch(dirs, false, function () {
              recustomize.run(engineName).then(function (subResult) {
                result[engineName] = subResult
                emitter.emit('update', result)
              })
            })
            watch(files, false, function () {
              customize.run(engineName).then(function (subResult) {
                console.log(subResult)
                result[engineName] = subResult
                emitter.emit('update', result)
              })
            })
            customize.run().done(function (initialResult) {
              result = initialResult
              emitter.emit('update', result)
            })
          })
      })
    })
  return emitter
}

var watch = function (paths, usePolling, callback) {
  var watcher = chokidar.watch(paths, {
    ignoreInitial: true,
    usePolling: usePolling
  })
  watcher.on('ready', function () {
    debug('Watchers for ', paths, ' ready')
  })
  var fn = _.throttle(callback, 1000)
  watcher.on('change', fn).on('add', fn).on('delete', fn)
}
