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
var debug = require('debug')('customize-watch:watcher')
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
 * @param {Recustomize} recustomize
 * @return {events.EventEmitter} an event-emitter sending an `update`-event, when
 * the output has been recomputed
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
                //
                result[engineName] = subResult[engineName]
                emitter.emit('update', result)
              })
            })

            watch(files, false, function () {
              recustomize.run(engineName).then(function (subResult) {
                result[engineName] = subResult[engineName]
                emitter.emit('update', result)
              })
            })

            // Compute initial result
            recustomize.run().done(function (initialResult) {
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
  var fn = _.debounce(callback, 250)
  watcher.on('change', fn).on('add', fn).on('unlink', fn)
}
