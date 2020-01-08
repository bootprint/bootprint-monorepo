const fs = require('fs')
const path = require('path')
const cp = require('child_process')

module.exports = {
  getLocalPackageVersions,
  pathToPackage,
  loadPackageJson,
  savePackageJsonAndAddToGit
}

function getLocalPackageVersions() {
  const result = Object.create(null)
  fs.readdirSync('packages').forEach(packageName => {
    const packageJson = loadPackageJson(packageName)
    result[packageJson.name] = packageJson.version
  })
  return result
}

function pathToPackage(packageName) {
  return path.resolve('packages', packageName)
}

function loadPackageJson(packageName) {
  const packageJsonPath = path.resolve('packages', packageName, 'package.json')
  const originalContents = fs.readFileSync(packageJsonPath, 'utf8')
  return JSON.parse(originalContents)
}

function savePackageJsonAndAddToGit(packageJson) {
  console.log('PKG', packageJson)
  const packageJsonPath = path.resolve('packages', packageJson.name, 'package.json')
  const serializedContents = JSON.stringify(packageJson, null, 2)
  fs.writeFileSync(packageJsonPath, serializedContents + '\n')
  cp.spawnSync('git', ['add', packageJsonPath], { stdio: 'inherit' })
}
