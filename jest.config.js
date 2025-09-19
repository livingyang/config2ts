/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  testTimeout: 600000,
  transform: {
    "^.+\.tsx?$": ["ts-jest", {}],
  },
};