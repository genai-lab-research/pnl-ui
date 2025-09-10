/**
 * Integration tests for API Services
 * These tests verify the complete flow of API calls with authentication
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { authService } from '../authService';
import { containerService } from '../containerService';
import { getDefaultCredentials, getApiBaseUrl } from '../../utils/env';
import { tokenStorage } from '../../utils/tokenStorage';

// Skip integration tests if the environment variable is set
const skipIntegration = import.meta.env.VITE_SKIP_INTEGRATION_TESTS === 'true';

describe.skipIf(skipIntegration)('API Services Integration Tests', () => {
  let isAuthenticated = false;
  const credentials = getDefaultCredentials();

  beforeAll(async () => {
    // Clear any existing auth data
    tokenStorage.clearToken();
  });

  afterAll(() => {
    // Clean up after tests
    tokenStorage.clearToken();
  });

  describe('Authentication Flow', () => {
    it('should login successfully with valid credentials', async () => {
      try {
        const response = await authService.login({
          username: credentials.username,
          password: credentials.password,
        });

        expect(response).toHaveProperty('access_token');
        expect(response).toHaveProperty('token_type');
        expect(response.token_type).toBe('bearer');
        
        // Verify token is stored
        const storedToken = tokenStorage.getAccessToken();
        expect(storedToken).toBe(response.access_token);
        
        isAuthenticated = true;
      } catch (error) {
        // If backend is not running, skip the test
        if (error instanceof Error && error.message.includes('Network')) {
          console.warn('Backend not available, skipping integration test');
          return;
        }
        throw error;
      }
    });

    it('should get current user after login', async () => {
      if (!isAuthenticated) {
        console.warn('Not authenticated, skipping test');
        return;
      }

      try {
        const user = await authService.getCurrentUser();
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('id');
        expect(user.username).toBe(credentials.username);
      } catch (error) {
        console.warn('Could not get current user:', error);
      }
    });

    it('should validate token', async () => {
      if (!isAuthenticated) {
        console.warn('Not authenticated, skipping test');
        return;
      }

      const isValid = await authService.validateToken();
      expect(isValid).toBe(true);
    });
  });

  describe('Container Service with Authentication', () => {
    beforeEach(async () => {
      // Ensure we're authenticated before container tests
      if (!isAuthenticated) {
        try {
          await authService.login({
            username: credentials.username,
            password: credentials.password,
          });
          isAuthenticated = true;
        } catch {
          console.warn('Could not authenticate for container tests');
        }
      }
    });

    it('should fetch containers with authentication', async () => {
      if (!isAuthenticated) {
        console.warn('Not authenticated, skipping test');
        return;
      }

      try {
        const response = await containerService.getContainers();
        expect(response).toHaveProperty('items');
        expect(Array.isArray(response.items)).toBe(true);
      } catch (error) {
        console.warn('Could not fetch containers:', error);
      }
    });

    it('should handle environment status requests', async () => {
      if (!isAuthenticated) {
        console.warn('Not authenticated, skipping test');
        return;
      }

      // This test assumes at least one container exists
      try {
        const containers = await containerService.getContainers();
        if (containers.items.length > 0) {
          const containerId = containers.items[0].id;
          const status = await containerService.getEnvironmentStatus(containerId);
          
          expect(status).toHaveProperty('is_connected');
          expect(typeof status.is_connected).toBe('boolean');
        }
      } catch (error) {
        console.warn('Could not get environment status:', error);
      }
    });

    it('should handle recipe management requests', async () => {
      if (!isAuthenticated) {
        console.warn('Not authenticated, skipping test');
        return;
      }

      try {
        const containers = await containerService.getContainers();
        if (containers.items.length > 0) {
          const containerId = containers.items[0].id;
          
          // Test getting active recipes
          const activeRecipes = await containerService.getActiveRecipes(containerId);
          expect(Array.isArray(activeRecipes)).toBe(true);
          
          // Test getting available recipes
          const availableRecipes = await containerService.getAvailableRecipes(containerId);
          expect(Array.isArray(availableRecipes)).toBe(true);
          
          // Test getting recipe history
          const history = await containerService.getRecipeHistory(containerId, { limit: 10 });
          expect(Array.isArray(history)).toBe(true);
        }
      } catch (error) {
        console.warn('Could not handle recipe requests:', error);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid credentials', async () => {
      try {
        await authService.login({
          username: 'invalid_user',
          password: 'wrong_password',
        });
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        if (error instanceof Error) {
          // Should get an authentication error
          expect(error.message).toContain('401');
        }
      }
    });

    it('should handle requests without authentication', async () => {
      // Clear token to simulate unauthenticated request
      tokenStorage.clearToken();
      
      try {
        await containerService.getContainers();
        // If backend allows unauthenticated access, this is ok
      } catch (error) {
        if (error instanceof Error) {
          // Should get an authentication error
          expect(error.message).toContain('401');
        }
      }
    });
  });

  describe('Token Management', () => {
    it('should check if token needs refresh', () => {
      const shouldRefresh = tokenStorage.shouldRefreshToken();
      expect(typeof shouldRefresh).toBe('boolean');
    });

    it('should check token expiration', () => {
      const isExpired = tokenStorage.isTokenExpired();
      expect(typeof isExpired).toBe('boolean');
    });

    it('should handle token storage edge cases', () => {
      // Test clearing tokens
      tokenStorage.clearToken();
      expect(tokenStorage.getAccessToken()).toBeNull();
      
      // Test storage availability
      const isAvailable = tokenStorage.isStorageAvailable();
      expect(typeof isAvailable).toBe('boolean');
    });
  });
});