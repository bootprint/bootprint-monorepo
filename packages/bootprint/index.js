const customize = require('customize-watch')
const write = require('customize-write-files')
const fs = require('fs-extra')
const got = require('got')
const yaml = require('js-yaml')

// preconfigured Customize instance.
module.exports = customize()
  .registerEngine('handlebars', require('customize-engine-handlebars'))
  .registerEngine('less', require('customize-engine-less'))

// Customize type for adding methods
const Customize = customize.Customize

Customize.prototype.build = function(jsonFile, targetDir) {
  const withData = this.merge({
    handlebars: {
      data: loadFromFileOrHttp(jsonFile).catch(function(err) {
        // Augment error for identification in the cli script
        err.cause = 'bootprint-load-data'
        throw err
      })
    }
  })
  return new Bootprint(withData, targetDir)
}

/**
 * The old Bootprint interface
 * @constructor
 */
function Bootprint(withData, targetDir) {
  /**
   * Run Bootprint and write the result to the specified target directory
   * @param {object=} options passed to Customize#run()
   * @returns {Promise} a promise for the completion of the build
   */
  this.generate = function generate(options) {
    return withData.run(options).then(write(targetDir))
  }

  /**
   * Run the file watcher to watch all files loaded into the
   * current Bootprint-configuration.
   * The watcher run Bootprint every time one the the input files, templates or helpers changes.
   * @returns {EventEmitter} an EventEmitter that sends an `update`-event after each
   *   build, but before the files are written to disc.
   */
  this.watch = function() {
    return withData.watch().on('update', write(targetDir))
  }
}

function loadFromFile(fileOrUrlOrData) {
  return fs.readFile(fileOrUrlOrData, 'utf8').then(function(data) {
    return yaml.safeLoad(data, { json: true })
  })
}

/**
 * Helper method for loading the bootprint-data
 * @param fileOrUrlOrData
 * @returns {*}
 * @private
 */
function loadFromFileOrHttp(fileOrUrlOrData) {
  // If this is not a string,
  // it is probably already the raw data.
  if (typeof fileOrUrlOrData !== 'string') {
    return Promise.resolve(fileOrUrlOrData)
  }
  // otherwise load data from url or file
  if (fileOrUrlOrData.match(/^https?:\/\//)) {
    return loadFromHttp(fileOrUrlOrData)
  } else {
    return loadFromFile(fileOrUrlOrData)
  }
}

async function loadFromHttp(fileOrUrlOrData) {
  const result = await got(fileOrUrlOrData, {
    followRedirect: true,
    headers: {
      'User-Agent': 'Bootprint/' + require('./package').version
    }
  })
  return yaml.safeLoad(result.body, { json: true })
}
