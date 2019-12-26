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
module.exports = function customizeWatch(recustomize) {
  return new CustomizeWatcher(recustomize)
}

class CustomizeWatcher extends events.EventEmitter {
  /**
   *
   * @param {Recustomize} recustomize
   */
  constructor(recustomize) {
    super()
    this.recustomize = recustomize
    this.promisedExecutionResult = this._initialResultForAllEngines()
    this.promisedChokidarWatchers = this._setupWatchers()
    this._sendInitialUpdateEventWhenReady()
  }

  _sendInitialUpdateEventWhenReady() {
    Promise.all([this.promisedExecutionResult, this.promisedChokidarWatchers]).then(([executionResult]) => {
      debug('emit:update', executionResult)
      this.emit('update', executionResult)
    })
  }

  async _initialResultForAllEngines() {
    return this.recustomize.run()
  }

  async _setupWatchers() {
    const toBeWatchedFilesByEngine = await this.recustomize.watched()
    const createdWatchers = []
    debug('Adding watchers')
    await forEachValueWithKeyParallel(toBeWatchedFilesByEngine, async (toBeWatchedFiles, engineName) => {
      const { dirs, files } = await splitDirsAndFiles(toBeWatchedFiles)
      // We use "polling" for files, because some editors use atomic-writes, which does not work well with fs-events
      // For directories, we don't use polling because this would mean polling a lot of files and is inefficient
      const [dirWatcher, fileWatcher] = await Promise.all([
        createWatcherIfNeeded(dirs, false, () => this._updateResultForOneEngine(engineName)),
        createWatcherIfNeeded(files, true, () => this._updateResultForOneEngine(engineName))
      ])
      debug("Memorizing watchers")
      if (fileWatcher != null) {
        createdWatchers.push(fileWatcher)
      }
      if (dirWatcher != null) {
        createdWatchers.push(dirWatcher)
      }
    })
    return createdWatchers
  }

  _updateResultForOneEngine(engineName) {
    this.promisedExecutionResult = Promise.all([this.promisedExecutionResult, this._computeResultForEngine(engineName)])
      .then(([executionResult, resultForEngine]) => {
        executionResult[engineName] = resultForEngine[engineName]
        debug('emit:update', executionResult)
        this.emit('update', executionResult)
        return executionResult
      })
      .catch(error => {
        console.error(`Error while updating result for engine '${engineName}': ${error}\n${error.stack}`)
      })
  }

  async _computeResultForEngine(engineName) {
    return this.recustomize.run(engineName)
  }

  async stopWatching() {
    const watchers = await this.promisedChokidarWatchers
    watchers.forEach(watcher => watcher.close())
  }
}

async function splitDirsAndFiles(listOfDirsOrFiles) {
  const dirs = []
  const files = []
  await Promise.all(
    listOfDirsOrFiles.map(async directoryOrFile => {
      const resolvedPath = path.resolve(directoryOrFile)
      if (await qfs.isDirectory(resolvedPath)) {
        dirs.push(resolvedPath)
      } else {
        files.push(resolvedPath)
      }
    })
  )
  return { dirs, files }
}

async function forEachValueWithKeyParallel(object, valueKeyIterator) {
  await forEachParallel(Object.keys(object), key => valueKeyIterator(object[key], key))
}

async function forEachParallel(array, iteratorFn) {
  await Promise.all(array.map(iteratorFn))
}

async function createWatcherIfNeeded(paths, usePolling, callback) {
  debug('Setting up watchers for ', { paths, usePolling })
  if (paths.length === 0) {
    debug(`Don't setup watchers for empty paths-array`);
    return Promise.resolve()
  }
  const watcher = chokidar.watch(paths, {
    ignoreInitial: true,
    usePolling: usePolling
  })
  const debouncedCallback = _.debounce(callback, 250)
  watcher
    .on('change', debouncedCallback)
    .on('add', debouncedCallback)
    .on('unlink', debouncedCallback)

  return new Promise(resolve => {
    watcher.on('ready', function() {
      resolve(watcher)
      debug('Watchers for ', paths, ' ready')
    })
  })
}
