module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'index.js',
    '!node_modules/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testMatch: ['<rootDir>/test/**/*.test.js'],
};
