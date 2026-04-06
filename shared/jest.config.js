/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/game'],
  testMatch: ['**/__tests__/**/*.test.ts'],
};
