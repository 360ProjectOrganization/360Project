module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
}