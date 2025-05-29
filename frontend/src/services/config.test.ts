import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import config from './config';

describe('Config Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('API Configuration', () => {
    it('should use development base URL by default', () => {
      expect(config.api.baseUrl).toBe('http://localhost:8000/api/v1');
    });

    it('should have correct timeout value', () => {
      expect(config.api.timeout).toBe(30000); // 30 seconds
    });

    it('should enable mock fallback in development', () => {
      expect(config.api.enableMockFallback).toBe(true);
    });

    it('should detect development environment correctly', () => {
      expect(config.api.isDevelopment).toBe(true);
    });
  });

  describe('UI Configuration', () => {
    it('should have correct default page size', () => {
      expect(config.ui.defaultPageSize).toBe(10);
    });

    it('should have correct max items per page', () => {
      expect(config.ui.maxItemsPerPage).toBe(100);
    });

    it('should have correct debounce delay', () => {
      expect(config.ui.debounceDelay).toBe(300);
    });
  });

  describe('Endpoints Configuration', () => {
    it('should generate correct container endpoints', () => {
      expect(config.endpoints.containers).toBe('/containers');
      expect(config.endpoints.containerById('test-id')).toBe('/containers/test-id');
      expect(config.endpoints.containerMetrics('test-id')).toBe('/containers/test-id/metrics');
      expect(config.endpoints.containerCrops('test-id')).toBe('/containers/test-id/crops');
      expect(config.endpoints.containerActivities('test-id')).toBe('/containers/test-id/activities');
    });

    it('should handle special characters in container IDs', () => {
      const specialId = 'container-with-special@chars#123';
      expect(config.endpoints.containerById(specialId)).toBe(`/containers/${specialId}`);
    });

    it('should handle empty container IDs', () => {
      expect(config.endpoints.containerById('')).toBe('/containers/');
    });
  });

  describe('Features Configuration', () => {
    it('should have correct feature flags', () => {
      expect(config.features.enableRealTimeUpdates).toBe(false);
      expect(config.features.enableAdvancedFiltering).toBe(true);
      expect(config.features.enableExport).toBe(true);
      expect(config.features.enableNotifications).toBe(false);
    });
  });

  describe('Theme Configuration', () => {
    it('should have correct theme settings', () => {
      expect(config.theme.mode).toBe('light');
      expect(config.theme.primaryColor).toBe('#3545EE');
      expect(config.theme.fontFamily).toBe('Inter, sans-serif');
    });
  });

  describe('Environment Variable Handling', () => {
    it('should use VITE_API_BASE_URL when provided', async () => {
      process.env.VITE_API_BASE_URL = 'https://api.example.com';
      
      // Dynamically import to get fresh config with new env vars
      const { default: freshConfig } = await import('./config');
      
      expect(freshConfig.api.baseUrl).toBe('https://api.example.com');
    });

    it('should use VITE_ENABLE_MOCK_FALLBACK when provided', async () => {
      process.env.VITE_ENABLE_MOCK_FALLBACK = 'false';
      
      const { default: freshConfig } = await import('./config');
      
      expect(freshConfig.api.enableMockFallback).toBe(false);
    });

    it('should handle invalid boolean environment variables', async () => {
      process.env.VITE_ENABLE_MOCK_FALLBACK = 'invalid';
      
      const { default: freshConfig } = await import('./config');
      
      // Should default to true for invalid boolean values in development
      expect(freshConfig.api.enableMockFallback).toBe(true);
    });
  });

  describe('Configuration Validation', () => {
    it('should have all required configuration properties', () => {
      expect(config).toHaveProperty('api');
      expect(config).toHaveProperty('ui');
      expect(config).toHaveProperty('endpoints');
      expect(config).toHaveProperty('features');
      expect(config).toHaveProperty('theme');
    });

    it('should have valid API configuration', () => {
      expect(config.api.baseUrl).toBeTruthy();
      expect(typeof config.api.timeout).toBe('number');
      expect(config.api.timeout).toBeGreaterThan(0);
      expect(typeof config.api.enableMockFallback).toBe('boolean');
      expect(typeof config.api.isDevelopment).toBe('boolean');
    });

    it('should have valid UI configuration', () => {
      expect(typeof config.ui.defaultPageSize).toBe('number');
      expect(config.ui.defaultPageSize).toBeGreaterThan(0);
      expect(typeof config.ui.maxItemsPerPage).toBe('number');
      expect(config.ui.maxItemsPerPage).toBeGreaterThan(config.ui.defaultPageSize);
      expect(typeof config.ui.debounceDelay).toBe('number');
      expect(config.ui.debounceDelay).toBeGreaterThanOrEqual(0);
    });

    it('should have valid endpoint functions', () => {
      expect(typeof config.endpoints.containers).toBe('string');
      expect(typeof config.endpoints.containerById).toBe('function');
      expect(typeof config.endpoints.containerMetrics).toBe('function');
      expect(typeof config.endpoints.containerCrops).toBe('function');
      expect(typeof config.endpoints.containerActivities).toBe('function');
    });
  });
});