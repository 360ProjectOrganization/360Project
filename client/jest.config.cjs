module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/jest.styleMock.cjs',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/jest.fileMock.cjs',
    },
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
}