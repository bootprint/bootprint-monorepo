#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const cp = require('child_process')

process.chdir(path.resolve(__dirname, '..'))

fs.readdirSync('packages').forEach(pkg => {
  const packagePath = path.resolve('packages', pkg)
  const packageJsonPath = path.resolve(packagePath, 'package.json')
  const originalContents = fs.readFileSync(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(originalContents)
  fixPackageJson(packageJson, packagePath)
  const newContents = JSON.stringify(packageJson, 0, 2) + '\n'
  fs.writeFileSync(packageJsonPath, newContents)
  cp.spawnSync('git', ['add', packageJsonPath], { stdio: 'inherit' })
})

function fixPackageJson(packageJson, packagePath) {
  updatePeerDependenciesBasedOnDevDependencies(packageJson)
  fixGithubUrls(packageJson, packagePath)
}

function updatePeerDependenciesBasedOnDevDependencies(packageJson) {
  const devDependencies = packageJson.devDependencies
  const peerDependencies = packageJson.peerDependencies
  if (peerDependencies == null) {
    return
  }
  Object.keys(peerDependencies).forEach(dependencyName => {
    if (devDependencies[dependencyName] != null) {
      peerDependencies[dependencyName] = devDependencies[dependencyName]
    }
  })
}

function fixGithubUrls(packageJson, packagePath) {
  const { repository, bugs, author } = require('../package')
  packageJson.repository = {
    ...repository,
    directory: path.posix.relative(process.cwd(), packagePath)
  }
  packageJson.bugs = bugs
  packageJson.author = author
}
