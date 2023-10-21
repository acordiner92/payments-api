export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts', '!**/*.int.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
