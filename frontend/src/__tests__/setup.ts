/**
 * Test setup file
 */
import { expect, beforeAll } from 'vitest';

// Global test setup
beforeAll(() => {
  console.log('Starting API tests...');
  console.log('Ensure the backend server is running at http://localhost:8000');
});

// Define fail helper for tests
export const fail = (message: string) => {
  throw new Error(message);
};

// Mock console.error to keep test output clean
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (args[0]?.includes && args[0].includes('Warning:')) {
    return; // Suppress React warnings
  }
  originalConsoleError(...args);
};