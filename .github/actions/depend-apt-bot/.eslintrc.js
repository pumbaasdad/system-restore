module.exports = {
  env: {
    node: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: [
    'jest',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off', // Allow console for GitHub Actions
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.js', '**/*.spec.js', '**/setup.js'] },
    ],
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'max-len': ['error', { code: 120 }],
    'no-restricted-syntax': ['error', {
      selector: 'ForInStatement',
      message: 'for..in loops iterate over the entire prototype chain, which is '
        + 'virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
    }, {
      selector: 'LabeledStatement',
      message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
    }, {
      selector: 'WithStatement',
      message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
    }],
  },
  ignorePatterns: [
    'node_modules/',
    'coverage/',
  ],
};
