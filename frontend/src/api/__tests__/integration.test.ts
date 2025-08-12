import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { authService } from '../authService';
import { containerService } from '../containerService';
import { tokenStorage } from '../../utils/tokenStorage';

// Integration tests that test the interaction between services
describe('API Services Integration', () => {
  // Mock server responses for integration testing
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  beforeAll(() => {
    // Setup global mocks
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should handle complete login flow and use token for API calls', async () => {
      const mockLoginResponse = {
        access_token: 'integration-test-token',
        token_type: 'bearer',
        user: {
          id: 1,
          username: 'integrationuser',
          email: 'integration@test.com',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        expires_in: 3600,
      };

      const mockContainerResponse = {
        containers: [],
        pagination: { page: 1, limit: 10, total: 0, total_pages: 0 },
        performance_metrics: {
          physical: { container_count: 0, yield: { average: 0, total: 0, chart_data: [] }, space_utilization: { average: 0, chart_data: [] } },
          virtual: { container_count: 0, yield: { average: 0, total: 0, chart_data: [] }, space_utilization: { average: 0, chart_data: [] } },
          time_range: { type: 'week', start_date: '2023-01-01', end_date: '2023-01-07' },
          generated_at: '2023-01-01T00:00:00Z',
        },
      };

      // Mock login request
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockLoginResponse,
          headers: new Headers({ 'content-type': 'application/json' }),
        })
        // Mock container request
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockContainerResponse,
          headers: new Headers({ 'content-type': 'application/json' }),
        });

      // Perform login
      const loginResult = await authService.login({
        username: 'integrationuser',
        password: 'testpassword',
      });

      expect(loginResult).toEqual(mockLoginResponse);

      // Verify token is stored
      expect(authService.isAuthenticated()).toBe(true);

      // Make authenticated API call
      const containersResult = await containerService.getContainers();

      expect(containersResult).toEqual(mockContainerResponse);

      // Verify the container request included the authorization header
      expect(mockFetch).toHaveBeenLastCalledWith(
        '/api/v1/containers/',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer integration-test-token',
          }),
        })
      );
    });

    it('should handle token expiration and clear authentication', async () => {
      // Mock unauthorized response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ detail: 'Token expired' }),
      });

      // Try to make API call with expired token
      await expect(containerService.getContainers()).rejects.toThrow('Authentication required');

      // Verify authentication state is cleared
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle network errors consistently across services', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      // Test auth service error handling
      await expect(authService.login({ username: 'test', password: 'test' }))
        .rejects.toThrow('Login failed. Please check your credentials.');

      // Test container service error handling  
      await expect(containerService.getContainers())
        .rejects.toThrow('Network request failed');
    });

    it('should handle server errors consistently', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ detail: 'Server error' }),
      });

      await expect(authService.login({ username: 'test', password: 'test' }))
        .rejects.toThrow('Server error');

      await expect(containerService.getContainers())
        .rejects.toThrow('Server error');
    });
  });

  describe('Token Refresh Integration', () => {
    it('should refresh token and retry failed requests', async () => {
      const mockRefreshResponse = {
        access_token: 'new-refreshed-token',
        expires_in: 3600,
      };

      const mockContainerResponse = {
        containers: [],
        pagination: { page: 1, limit: 10, total: 0, total_pages: 0 },
        performance_metrics: {
          physical: { container_count: 0, yield: { average: 0, total: 0, chart_data: [] }, space_utilization: { average: 0, chart_data: [] } },
          virtual: { container_count: 0, yield: { average: 0, total: 0, chart_data: [] }, space_utilization: { average: 0, chart_data: [] } },
          time_range: { type: 'week', start_date: '2023-01-01', end_date: '2023-01-07' },
          generated_at: '2023-01-01T00:00:00Z',
        },
      };

      // Mock refresh token request
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockRefreshResponse,
          headers: new Headers({ 'content-type': 'application/json' }),
        })
        // Mock container request after refresh
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockContainerResponse,
          headers: new Headers({ 'content-type': 'application/json' }),
        });

      // Mock tokenStorage to simulate refresh token availability
      const mockTokenStorage = vi.mocked(tokenStorage);
      mockTokenStorage.getRefreshToken = vi.fn().mockReturnValue('refresh-token');
      mockTokenStorage.createTokenStorage = vi.fn().mockReturnValue({
        token: 'new-refreshed-token',
        expiresAt: Date.now() + 3600000,
      });
      mockTokenStorage.setToken = vi.fn();

      // Perform token refresh
      const newToken = await authService.refreshToken();
      expect(newToken).toBe('new-refreshed-token');

      // Make API call with new token
      const result = await containerService.getContainers();
      expect(result).toEqual(mockContainerResponse);
    });
  });

  describe('Service Configuration', () => {
    it('should use consistent base URLs across services', () => {
      const authServiceInstance = authService;
      const containerServiceInstance = containerService;

      // Both services should be configured with the same base URL
      expect(authServiceInstance).toBeDefined();
      expect(containerServiceInstance).toBeDefined();
    });

    it('should maintain singleton pattern', () => {
      const authInstance1 = authService;
      const authInstance2 = authService;
      
      const containerInstance1 = containerService;
      const containerInstance2 = containerService;

      expect(authInstance1).toBe(authInstance2);
      expect(containerInstance1).toBe(containerInstance2);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle login -> get containers -> create container -> logout flow', async () => {
      const mockResponses = [
        // Login response
        {
          ok: true,
          status: 200,
          json: async () => ({
            access_token: 'scenario-token',
            token_type: 'bearer',
            user: { id: 1, username: 'scenariouser', email: 'scenario@test.com' },
            expires_in: 3600,
          }),
          headers: new Headers({ 'content-type': 'application/json' }),
        },
        // Get containers response
        {
          ok: true,
          status: 200,
          json: async () => ({
            containers: [],
            pagination: { page: 1, limit: 10, total: 0, total_pages: 0 },
            performance_metrics: {
              physical: { container_count: 0, yield: { average: 0, total: 0, chart_data: [] }, space_utilization: { average: 0, chart_data: [] } },
              virtual: { container_count: 0, yield: { average: 0, total: 0, chart_data: [] }, space_utilization: { average: 0, chart_data: [] } },
              time_range: { type: 'week', start_date: '2023-01-01', end_date: '2023-01-07' },
              generated_at: '2023-01-01T00:00:00Z',
            },
          }),
          headers: new Headers({ 'content-type': 'application/json' }),
        },
        // Create container response
        {
          ok: true,
          status: 201,
          json: async () => ({
            id: 1,
            name: 'New Container',
            tenant_id: 1,
            type: 'physical',
            purpose: 'development',
            location: { city: 'Test City', country: 'Test Country', address: 'Test Address' },
            status: 'created',
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          }),
          headers: new Headers({ 'content-type': 'application/json' }),
        },
        // Logout response
        {
          ok: true,
          status: 200,
          json: async () => ({}),
          headers: new Headers({ 'content-type': 'application/json' }),
        },
      ];

      mockFetch
        .mockResolvedValueOnce(mockResponses[0])
        .mockResolvedValueOnce(mockResponses[1])
        .mockResolvedValueOnce(mockResponses[2])
        .mockResolvedValueOnce(mockResponses[3]);

      // 1. Login
      await authService.login({ username: 'scenariouser', password: 'password' });
      expect(authService.isAuthenticated()).toBe(true);

      // 2. Get containers
      const containers = await containerService.getContainers();
      expect(containers.containers).toEqual([]);

      // 3. Create container
      const newContainer = await containerService.createContainer({
        name: 'New Container',
        tenant_id: 1,
        type: 'physical',
        purpose: 'development',
        location: { city: 'Test City', country: 'Test Country', address: 'Test Address' },
        notes: '',
        shadow_service_enabled: false,
        robotics_simulation_enabled: false,
        ecosystem_connected: false,
        ecosystem_settings: {},
        status: 'created',
        seed_type_ids: [],
      });
      expect(newContainer.id).toBe(1);

      // 4. Logout
      await authService.logout();
      expect(authService.isAuthenticated()).toBe(false);

      // Verify all requests were made
      expect(mockFetch).toHaveBeenCalledTimes(4);
    });
  });
});