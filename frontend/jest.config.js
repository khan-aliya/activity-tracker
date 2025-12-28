export default {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testMatch: [
        '**/__tests__/**/*.test.js',
        '**/__tests__/**/*.test.jsx',
        '**/?(*.)+(spec|test).js',
        '**/?(*.)+(spec|test).jsx'
    ],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    }
};
