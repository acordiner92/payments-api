export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.int.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/int/setup.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
