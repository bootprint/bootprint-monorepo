#!/usr/bin/env node

const path = require('path')
const {
  loadPackageJson,
  pathToPackage,
  savePackageJsonAndAddToGit,
  getLocalPackageVersions
} = require('./utils/packages')

process.chdir(path.resolve(__dirname, '..'))

const localPackageVersions = getLocalPackageVersions()
Object.keys(localPackageVersions).forEach(packageName => {
  const packageJson = loadPackageJson(packageName)
  fixPackageJson(packageJson, pathToPackage(packageName))
  savePackageJsonAndAddToGit(packageJson)
})

function fixPackageJson(packageJson, packagePath) {
  updateLocalPeerDependencies(packageJson)
  fixGithubUrls(packageJson, packagePath)
}

function updateLocalPeerDependencies(packageJson) {
  const peerDependencies = packageJson.peerDependencies
  if (peerDependencies == null) {
    return
  }

  const devDependencies = packageJson.devDependencies
  Object.keys(peerDependencies).forEach(dependencyName => {
    if (devDependencies[dependencyName] != null) {
      peerDependencies[dependencyName] = devDependencies[dependencyName]
    } else if (localPackageVersions[dependencyName] != null) {
      peerDependencies[dependencyName] = '^' + localPackageVersions[dependencyName]
    }
  })
}

function fixGithubUrls(packageJson, packagePath) {
  const { repository, bugs, author } = require('../package')
  packageJson.repository = {
    ...repository,
    directory: path.posix.relative(process.cwd(), packagePath)
  }
  packageJson.funding = {
    url: 'https://en.liberapay.com/bootprint.js'
  }
  packageJson.bugs = bugs
  packageJson.author = author
}
