// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
import '@testing-library/jest-dom';

// Mock import.meta for Jest
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: '/api/v1',
        VITE_DEFAULT_USERNAME: 'testuser',
        VITE_DEFAULT_PASSWORD: 'testpassword',
        VITE_AUTO_LOGIN: 'true',
        NODE_ENV: 'test'
      }
    }
  },
  writable: true
});