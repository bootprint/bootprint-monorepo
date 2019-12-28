const path = require('path')
const cp = require('child_process')
const debug = require('debug')('bootprint:main-spec')

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const bootprint = require('../')
const tmpDir = path.join(__dirname, 'tmp')
const targetDir = path.join(tmpDir, 'target')
const swaggerJsonFile = path.join(tmpDir, 'changing.json')
const fs = require('fs-extra')
const nock = require('nock')

beforeEach(async function() {
  await fs.remove(tmpDir)
  await fs.mkdirp(tmpDir)
})

function runBootprint(inputFileOrUrl) {
  return bootprint
    .merge({
      handlebars: {
        templates: path.join(__dirname, 'fixtures', 'handlebars')
      },
      less: {
        main: require.resolve('./fixtures/main.less')
      }
    })
    .build(inputFileOrUrl, targetDir)
    .generate()
}

describe('The programmatic interface', function() {
  it('should load the input json each time it runs', function() {
    fs.writeFileSync(
      swaggerJsonFile,
      JSON.stringify({
        eins: 'one',
        zwei: 'two',
        drei: 'three'
      })
    )

    return runBootprint(swaggerJsonFile)
      .then(function() {
        const content = fs.readFileSync(path.join(targetDir, 'index.html'), { encoding: 'utf-8' })
        expect(content.trim()).to.equal('eins=one zwei=two drei=three')
        fs.writeFileSync(
          swaggerJsonFile,
          JSON.stringify({
            eins: 'un',
            zwei: 'deux',
            drei: 'trois'
          })
        )
        return runBootprint(swaggerJsonFile)
      })
      .then(function() {
        const content = fs.readFileSync(path.join(targetDir, 'index.html'), { encoding: 'utf-8' })
        expect(content.trim()).to.equal('eins=un zwei=deux drei=trois')
      })
  })

  it('should accept yaml as input', function() {
    return runBootprint(require.resolve('./fixtures/input.yaml')).then(function() {
      const content = fs.readFileSync(path.join(targetDir, 'index.html'), { encoding: 'utf-8' })
      return expect(content.trim()).to.equal('eins=ichi zwei=ni drei=san')
    })
  })

  it('should load data from http', async function() {
    nock('http://example.com')
      .get('/one-two-three')
      .reply(200, {
        eins: 'ichi',
        zwei: 'ni',
        drei: 'san'
      })
    await runBootprint('http://example.com/one-two-three')

    const content = fs.readFileSync(path.join(targetDir, 'index.html'), { encoding: 'utf-8' })
    return expect(content.trim()).to.equal('eins=ichi zwei=ni drei=san')
  })

  it('should take a javascript object as input ', async function() {
    await runBootprint({
      eins: 'ichi',
      zwei: 'ni',
      drei: 'san'
    })

    const content = fs.readFileSync(path.join(targetDir, 'index.html'), { encoding: 'utf-8' })
    return expect(content.trim()).to.equal('eins=ichi zwei=ni drei=san')
  })

})

describe('The CLI interface', function() {
  const targetDir = path.join(tmpDir, 'cli-target')

  function outputFile(filename) {
    return fs.readFileSync(path.join(targetDir, filename), { encoding: 'utf-8' }).trim()
  }

  it('should run without errors if the correct number of parameters is provided', async function() {
    const result = await getOutputAndErrorOfExecution('./bin/bootprint.js', [
      './test/fixtures/test-module.js',
      `./test/fixtures/input.yaml`,
      targetDir
    ])

    expect(result.err).to.be.null()
    expect(outputFile('index.html'), 'Checking index.html').to.equal('eins=ichi zwei=ni drei=san')

    expect(outputFile('main.css'), 'Checking main.css').to.equal(
      "body{background-color:'#abc'}/*# sourceMappingURL=main.css.map */"
    )

    expect(outputFile('main.css.map'), 'Source map main.css.map must exist').to.be.ok()
  })

  it('should return with a non-zero exit-code and an error message if too few parameters are given', async function() {
    const result = await getOutputAndErrorOfExecution('./bin/bootprint.js', ['./test/fixtures/input.yaml', targetDir])
    expect(result.err).not.to.be.null()
    expect(result.stderr, 'Checking stderr-output').to.match(
      /\s*Invalid number of command-line arguments. 3 arguments expected.*/
    )
    expect(result.status === 1, 'Checking exit-code')
  })

  it('should return with a non-zero exit-code and an error without stack-trace if the source file could not be found', async function() {
    const result = await getOutputAndErrorOfExecution('./bin/bootprint.js', [
      './test/fixtures/test-module.js',
      './test/fixtures/non-existing-file.yaml',
      targetDir
    ])
    expect(result.stderr, 'Checking stderr-output').to.match(/.*no such file or directory.*/)
    expect(result.stderr, 'stderr should not contain a stack-trace').not.to.match(/throw/)
    expect(result.error).not.to.be.null()
  })

  it('should return with a non-zero exit-code and an error with stack-trace for unexpected errors', async function() {
    const result = await getOutputAndErrorOfExecution('./bin/bootprint.js', [
      './test/fixtures/test-module-error.js',
      './test/fixtures/non-existing-file.yaml',
      targetDir
    ])
    expect(result.stderr, 'stderr should contain a stack-trace').to.match(/throw new Error/)
    expect(result.error).not.to.be.null()
  })
})

async function getOutputAndErrorOfExecution(command, args) {
  const bootprintProjectDirectory = path.resolve(__dirname, '..')
  const options = { encoding: 'utf8', cwd: bootprintProjectDirectory }

  debug('execAndCatchErrors', { command, args, options })

  const nodeJs = process.argv[0]
  return new Promise(resolve => {
    cp.execFile(nodeJs, [command].concat(args), options, function(err, stdout, stderr) {
      debug(`execAndCatchErrors:stdout=${stderr}`)
      debug(`execAndCatchErrors:stderr=${stderr}`)
      if (err != null) {
        debug(`execAndCatchErrors:err=${err.stack}`)
      }
      resolve({ stdout, stderr, err })
    })
  })
}
