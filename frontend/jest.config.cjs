module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testMatch: [
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.test.jsx'
  ],
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx}',
    '!src/components/**/*.test.{js,jsx}',
    '!src/components/**/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-bootstrap|bootstrap)/)'
  ]
};