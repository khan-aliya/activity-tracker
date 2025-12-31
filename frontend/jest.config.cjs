
module.exports = {
  testEnvironment: 'jsdom',
  // Comment out or remove this line if setupTests.js doesn't exist
  // setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
  ],
  collectCoverage: false,
  verbose: true,
};