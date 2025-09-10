/**
 * Tests for Container Service Environment Endpoints
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { containerService } from '../containerService';
import { tokenStorage } from '../../utils/tokenStorage';
import {
  EnvironmentStatus,
  EnvironmentLinks,
  IframeConfiguration,
  ExternalUrlConfiguration,
  EnvironmentConnectionRequest,
  EnvironmentConnectionResponse,
  EnvironmentSystemHealth,
  SessionRefreshResponse,
  UpdateEnvironmentLinksRequest,
  UpdateEnvironmentLinksResponse,
} from '../../types/environment';

// Mock fetch globally
global.fetch = vi.fn();

// Mock token storage
vi.mock('../../utils/tokenStorage', () => ({
  tokenStorage: {
    getAccessToken: vi.fn(),
  },
}));

describe('ContainerService - Environment Management', () => {
  const mockToken = 'test-jwt-token';
  const containerId = 123;
  const baseURL = '/api/v1';

  beforeEach(() => {
    vi.clearAllMocks();
    (tokenStorage.getAccessToken as any).mockReturnValue(mockToken);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getEnvironmentStatus', () => {
    it('should get environment status successfully', async () => {
      const mockStatus: EnvironmentStatus = {
        is_connected: true,
        environment_system: 'farmhand',
        iframe_url: 'https://farmhand.example.com/iframe',
        external_url: 'https://farmhand.example.com',
        last_sync: '2024-01-01T12:00:00Z',
        connection_details: {
          system_version: '1.0.0',
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatus,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getEnvironmentStatus(containerId);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/environment/status`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockStatus);
    });

    it('should handle disconnected environment', async () => {
      const mockStatus: EnvironmentStatus = {
        is_connected: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatus,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getEnvironmentStatus(containerId);
      expect(result.is_connected).toBe(false);
    });
  });

  describe('getEnvironmentLinks', () => {
    it('should get environment links successfully', async () => {
      const mockLinks: EnvironmentLinks = {
        container_id: containerId,
        fa: { environment: 'alpha' },
        pya: { config: 'test' },
        aws: { region: 'us-west-2' },
        mbai: { endpoint: 'https://mbai.example.com' },
        fh: { environment: 'prod' },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockLinks,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getEnvironmentLinks(containerId);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/environment-links`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
          }),
        })
      );
      expect(result).toEqual(mockLinks);
    });
  });

  describe('updateEnvironmentLinks', () => {
    it('should update environment links successfully', async () => {
      const updateRequest: UpdateEnvironmentLinksRequest = {
        fa: { environment: 'beta' },
        fh: { environment: 'staging' },
      };

      const mockResponse: UpdateEnvironmentLinksResponse = {
        success: true,
        message: 'Environment links updated successfully',
        updated_at: '2024-01-01T12:00:00Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.updateEnvironmentLinks(containerId, updateRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/environment-links`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateRequest),
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getIframeUrl', () => {
    it('should get iframe URL without parameters', async () => {
      const mockConfig: IframeConfiguration = {
        iframe_url: 'https://farmhand.example.com/iframe?token=xyz',
        expires_at: '2024-01-01T13:00:00Z',
        permissions: ['view', 'edit'],
        container_context: {
          container_id: containerId,
          environment_id: 'env-123',
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockConfig,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getIframeUrl(containerId);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/environment/iframe-url`,
        expect.any(Object)
      );
      expect(result).toEqual(mockConfig);
    });

    it('should get iframe URL with tab and refresh parameters', async () => {
      const mockConfig: IframeConfiguration = {
        iframe_url: 'https://farmhand.example.com/iframe?token=xyz&tab=recipes',
        expires_at: '2024-01-01T13:00:00Z',
        permissions: ['view', 'edit'],
        container_context: {
          container_id: containerId,
          environment_id: 'env-123',
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockConfig,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getIframeUrl(containerId, 'recipes', true);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/environment/iframe-url?tab=recipes&refresh=true`,
        expect.any(Object)
      );
      expect(result).toEqual(mockConfig);
    });
  });

  describe('getExternalUrl', () => {
    it('should get external URL successfully', async () => {
      const mockConfig: ExternalUrlConfiguration = {
        external_url: 'https://farmhand.example.com/external?token=abc',
        expires_at: '2024-01-01T13:00:00Z',
        session_token: 'session-token-123',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockConfig,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getExternalUrl(containerId, 'environment');

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/environment/external-url?tab=environment`,
        expect.any(Object)
      );
      expect(result).toEqual(mockConfig);
    });
  });

  describe('connectEnvironment', () => {
    it('should connect environment successfully', async () => {
      const connectionRequest: EnvironmentConnectionRequest = {
        environment_system: 'farmhand',
        fa: { environment: 'alpha' },
        fh: { environment: 'prod' },
        user_permissions: ['view', 'edit', 'admin'],
      };

      const mockResponse: EnvironmentConnectionResponse = {
        success: true,
        message: 'Environment connection initiated',
        connection_id: 'conn-123',
        iframe_url: 'https://farmhand.example.com/iframe',
        external_url: 'https://farmhand.example.com',
        estimated_setup_time: 5,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.connectEnvironment(containerId, connectionRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/environment/connect`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(connectionRequest),
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getEnvironmentHealth', () => {
    it('should get environment health status', async () => {
      const mockHealth: EnvironmentSystemHealth = {
        status: 'healthy',
        last_heartbeat: '2024-01-01T12:00:00Z',
        response_time_ms: 150,
        system_version: '1.0.0',
        features_available: ['recipes', 'monitoring', 'alerts'],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockHealth,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getEnvironmentHealth(containerId);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/environment/health`,
        expect.any(Object)
      );
      expect(result).toEqual(mockHealth);
    });

    it('should handle degraded environment health', async () => {
      const mockHealth: EnvironmentSystemHealth = {
        status: 'degraded',
        last_heartbeat: '2024-01-01T12:00:00Z',
        response_time_ms: 1500,
        system_version: '1.0.0',
        features_available: ['recipes'],
        maintenance_window: {
          scheduled: true,
          start_time: '2024-01-02T00:00:00Z',
          end_time: '2024-01-02T04:00:00Z',
          reason: 'System maintenance',
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockHealth,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getEnvironmentHealth(containerId);
      expect(result.status).toBe('degraded');
      expect(result.maintenance_window).toBeDefined();
    });
  });

  describe('refreshEnvironmentSession', () => {
    it('should refresh session successfully', async () => {
      const mockResponse: SessionRefreshResponse = {
        success: true,
        new_iframe_url: 'https://farmhand.example.com/iframe?token=new',
        new_external_url: 'https://farmhand.example.com?token=new',
        expires_at: '2024-01-01T14:00:00Z',
        session_id: 'session-456',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.refreshEnvironmentSession(containerId);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/environment/refresh-session`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });
});