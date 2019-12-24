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
const debug = require('debug')('customize-watch:watcher')
const qfs = require('m-io/fs')
const deep = require('deep-aplus')(require('q').Promise)
const _ = require('lodash')
const events = require('events')
const chokidar = require('chokidar')
const path = require('path')

/**
 * Creates a new watcher that invokes customize whenever a watched file
 * (or a file in a watched directory) changes
 * @param {Recustomize} recustomize
 * @return {events.EventEmitter} an event-emitter sending an `update`-event, when
 * the output has been recomputed
 */
module.exports = function(recustomize) {
  const emitter = new events.EventEmitter()
  let result = null
  // Determine watched files from configuration
  recustomize.watched().done(function(watched) {
    // Compute and register watched files and dirs:
    // For each watched file or diretory...
    _.each(watched, function(paths, engineName) {
      if (!paths) {
        return
      }
      deep(
        paths.map(function(aPath) {
          // ... determine whether it is a directory
          return {
            path: path.resolve(aPath),
            isDir: qfs.isDirectory(aPath)
          }
        })
      ).then(function(pathsWithType) {
        // Sort dirs and files in different buckets
        const dirs = []
        const files = []
        pathsWithType.forEach(function(pathWithType) {
          if (pathWithType.isDir) {
            dirs.push(pathWithType.path)
          } else {
            files.push(pathWithType.path)
          }
        })

        function runEngine() {
          recustomize.run(engineName).done(
            function(subResult) {
              result[engineName] = subResult[engineName]
              emitter.emit('update', result)
            },
            function(e) {
              console.error('Error after update: ' + e.toString() + '\n' + e.stack)
            }
          )
        }
        // Register watchers with chokidar
        const dirWatcher = watch(dirs, false, runEngine)
        const fileWatcher = watch(files, true, runEngine)

        emitter.stopWatching = function() {
          unwatch(dirWatcher)
          unwatch(fileWatcher)
        }

        // Compute initial result
        recustomize.run().done(
          function(initialResult) {
            result = initialResult
            emitter.emit('update', result)
          },
          function(e) {
            console.error('Error while running for the first time: ' + e.toString() + '\n' + e.stack)
          }
        )
      })
    })
  })
  return emitter
}

function watch(paths, usePolling, callback) {
  const watcher = chokidar.watch(paths, {
    ignoreInitial: true,
    usePolling: usePolling
  })
  watcher.on('ready', function() {
    debug('Watchers for ', paths, ' ready')
  })
  const fn = _.debounce(callback, 250)
  watcher
    .on('change', fn)
    .on('add', fn)
    .on('unlink', fn)
  return watcher
}

function unwatch(watcher) {
  watcher.close()
}
