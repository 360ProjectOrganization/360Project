module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/jest.styleMock.cjs',
    },
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
}