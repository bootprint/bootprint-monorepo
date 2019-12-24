module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['promise'],
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'no-var': 'error',
    'prefer-const': 'warn'
  },
  overrides: [
    {
      files: ['**/test/*-spec.js'],
      env: {
        mocha: true
      }
    }
  ]
}
