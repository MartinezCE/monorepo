import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  detectOpenHandles: true,
  setupFilesAfterEnv: ['jest-extended/all'],
};

export default config;
