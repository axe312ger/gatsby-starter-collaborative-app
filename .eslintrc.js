module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['react'],
  globals: {
    graphql: false,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: '2017',
  },
  parser: 'babel-eslint',
  extends: ['standard', 'standard-react'],
  rules: {
    'react/require-optimization': 1,
  },
}
