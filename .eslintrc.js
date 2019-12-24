module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ['standard', 'prettier'],
  plugins: ['promise'],
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {},
  overrides: [
    {
      files: ['**/test/*-spec.js'],
      env: {
        mocha: true
      }
    }
  ]
}
