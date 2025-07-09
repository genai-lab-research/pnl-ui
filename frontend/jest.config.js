export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { 
      useESM: true,
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        module: 'es2022',
        target: 'es2022'
      }
    }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testTimeout: 30000,
  globals: {
    'import.meta': {
      env: {
        VITE_API_BASE_URL: '/api/v1',
        VITE_DEFAULT_USERNAME: 'testuser',
        VITE_DEFAULT_PASSWORD: 'testpassword',
        VITE_AUTO_LOGIN: 'true',
        NODE_ENV: 'test'
      }
    }
  }
};