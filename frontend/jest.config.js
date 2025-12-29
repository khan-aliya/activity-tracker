module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  moduleFileExtensions: ['js', 'json'],
  collectCoverage: false,
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)'
  ]
};