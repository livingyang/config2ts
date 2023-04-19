/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    'd3': '<rootDir>/node_modules/d3/dist/d3.min.js',
  }
};