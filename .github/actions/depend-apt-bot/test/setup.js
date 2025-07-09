const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();

// Mock @actions/core
jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  setOutput: jest.fn(),
  setFailed: jest.fn(),
}));

// Mock fs
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

// Mock js-yaml
jest.mock('js-yaml', () => ({
  load: jest.fn(),
  dump: jest.fn(),
}));
