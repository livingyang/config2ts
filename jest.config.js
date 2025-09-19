/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  testTimeout: 600000,
  transform: {
    "^.+\.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    '^d3-dsv$': '<rootDir>/node_modules/d3-dsv/dist/d3-dsv.min.js',
  },
};