/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  // Specify test environment
  testEnvironment: 'node',
  
  // Enable TypeScript via ts-jest
  preset: 'ts-jest',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },

  // Test patterns
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.ts',
  ],

  // Environment variables
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },

  // Verbose output
  verbose: true,
};

export default config; 