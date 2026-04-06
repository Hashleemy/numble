/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '^@numble/shared$': '<rootDir>/../shared/game/index.ts',
    '^@numble/shared/(.*)$': '<rootDir>/../shared/game/$1',
    '\\.(css|scss)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  setupFilesAfterFramework: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        strict: true,
        esModuleInterop: true,
        moduleResolution: 'node',
      },
    }],
  },
};
