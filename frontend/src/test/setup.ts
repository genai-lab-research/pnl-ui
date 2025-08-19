import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Clean up after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock environment variables for tests
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || '/api/v1',
    VITE_DEFAULT_USERNAME: process.env.VITE_DEFAULT_USERNAME || 'testuser',
    VITE_DEFAULT_PASSWORD: process.env.VITE_DEFAULT_PASSWORD || 'testpassword',
    VITE_AUTO_LOGIN: process.env.VITE_AUTO_LOGIN || 'false',
    VITE_BACKEND_URL: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
    VITE_DEV_PORT: process.env.VITE_DEV_PORT || '5173',
    VITE_TEST_USER_EMAIL: process.env.VITE_TEST_USER_EMAIL || 'testuser@example.com',
    VITE_DEV_TOKEN_PREFIX: process.env.VITE_DEV_TOKEN_PREFIX || 'dev-token-',
    VITE_SKIP_INTEGRATION_TESTS: process.env.VITE_SKIP_INTEGRATION_TESTS || 'false',
    MODE: 'test',
  },
  writable: true,
});

// Mock fetch globally for tests that don't explicitly mock it
global.fetch = global.fetch || vi.fn();

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(() => null),
    removeItem: vi.fn(() => null),
    clear: vi.fn(() => null),
  },
  writable: true,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(() => null),
    removeItem: vi.fn(() => null),
    clear: vi.fn(() => null),
  },
  writable: true,
});

// Suppress console errors/warnings during tests unless explicitly needed
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
};

console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('componentWillMount') || args[0].includes('componentWillReceiveProps'))
  ) {
    return;
  }
  originalConsoleWarn.call(console, ...args);
};