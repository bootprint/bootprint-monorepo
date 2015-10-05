/*!
 * customize-watch <https://github.com/nknapp/customize-watch>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

var customize = require("customize");

module.exports = function watcher () {
  return new Recustomize(customize);
}

/**
 * Recustomize has the same interface as Customize, but instead of storing
 * the current configuration-state, it stores a function that computes the state.
 * The only difference is the [watch()](#Recustomize+watch)-method. It can be
 * used to emit an event every time one of the input files is added, removed or changed.
 *
 * @param {function():customize} builder a builder function for a Customize object
 *
 * @constructor
 */
function Recustomize(builder) {

  /**
   * Wrap the method of a Customize object such that
   * instead of the new Customize object, new Recustomize object
   * with the appropriate builder-function is returned
   *
   * @param fnName
   * @returns {Function}
   */
  function wrap(fnName) {
    return function(/* dynamic arguments */) {
      var args = arguments;
      return new Recustomize(function() {
        var customize = builder();
        return customize[fnName].apply(customize,args);
      })
    }
  }

  // Wrapped functions
  this.merge = wrap("merge")
  this.registerEngine = wrap("registerEngine")
  this.load = wrap("load");

  /**
   * Return the configuation object
   * @returns {Promise<object>}
   */
  this.build = function() {
    return builder().build();
  }


  /**
   * Return a list of files and directories that need to be watched
   * in watch-mode.
   * @return {Promise<object<string[]>>} a list of paths to files or directories for each engine
   */
  this.watched = function() {
    return builder().watched();
  }

  /**
   * Register file-watchers for all relevant files.
   * Rebuild the config and run the appropriate engine, whenever
   * a file has changed.
   * @return {EventEmitter}
   */
  this.watch = function() {
    return require("./lib/watcher.js")(this);
  }



  /**
   * Wraps the run(...)-method of the customize object, rebuilding the whole configuration
   * before running.
   * @returns {object}
   */
  this.run = function( /* dynamic args */ ) {
    var custObj = builder();
    return custObj.run.apply(custObj, arguments);
  }
}


