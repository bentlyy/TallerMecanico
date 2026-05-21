module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFilesAfterEnv: [],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 15,
      lines: 40,
      statements: 40,
    },
  },
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/tests/', '/prisma/'],
};
