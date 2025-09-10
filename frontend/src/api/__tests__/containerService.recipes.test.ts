/**
 * Tests for Container Service Recipe Management Endpoints
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { containerService } from '../containerService';
import { tokenStorage } from '../../utils/tokenStorage';
import {
  ActiveRecipe,
  RecipeApplication,
  RecipeVersion,
  ApplyRecipeRequest,
  ApplyRecipeResponse,
  RecipeHistoryQueryParams,
  AvailableRecipesQueryParams,
  EnvironmentParameters,
} from '../../types/recipes';

// Mock fetch globally
global.fetch = vi.fn();

// Mock token storage
vi.mock('../../utils/tokenStorage', () => ({
  tokenStorage: {
    getAccessToken: vi.fn(),
  },
}));

describe('ContainerService - Recipe Management', () => {
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

  describe('getActiveRecipes', () => {
    it('should get active recipes successfully', async () => {
      const mockParams: EnvironmentParameters = {
        tray_density: 1.5,
        air_temperature: 22.5,
        humidity: 65,
        co2: 1200,
        water_temperature: 20,
        ec: 1.8,
        ph: 6.2,
        water_hours: 16,
        light_hours: 18,
      };

      const mockRecipes: ActiveRecipe[] = [
        {
          recipe_version_id: 1,
          recipe_name: 'Lettuce Standard',
          version: '1.0.0',
          crop_type: 'lettuce',
          applied_at: '2024-01-01T10:00:00Z',
          applied_by: 'john.doe',
          environment_parameters: mockParams,
        },
        {
          recipe_version_id: 2,
          recipe_name: 'Basil Premium',
          version: '2.1.0',
          crop_type: 'basil',
          applied_at: '2024-01-02T10:00:00Z',
          applied_by: 'jane.smith',
          environment_parameters: mockParams,
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRecipes,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getActiveRecipes(containerId);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/recipes/active`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockRecipes);
      expect(result).toHaveLength(2);
    });

    it('should handle empty active recipes', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getActiveRecipes(containerId);
      expect(result).toEqual([]);
    });
  });

  describe('applyRecipe', () => {
    it('should apply recipe successfully', async () => {
      const applyRequest: ApplyRecipeRequest = {
        recipe_version_id: 3,
        applied_by: 'admin',
        environment_sync: true,
      };

      const mockResponse: ApplyRecipeResponse = {
        success: true,
        message: 'Recipe applied successfully',
        application_id: 456,
        environment_sync_status: 'synced',
        applied_at: '2024-01-03T15:30:00Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.applyRecipe(containerId, applyRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/recipes/apply`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(applyRequest),
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
    });

    it('should handle recipe application without environment sync', async () => {
      const applyRequest: ApplyRecipeRequest = {
        recipe_version_id: 4,
        applied_by: 'operator',
        environment_sync: false,
      };

      const mockResponse: ApplyRecipeResponse = {
        success: true,
        message: 'Recipe applied locally',
        application_id: 457,
        environment_sync_status: 'not_synced',
        applied_at: '2024-01-03T16:00:00Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.applyRecipe(containerId, applyRequest);
      expect(result.environment_sync_status).toBe('not_synced');
    });
  });

  describe('getRecipeHistory', () => {
    it('should get recipe history without parameters', async () => {
      const mockHistory: RecipeApplication[] = [
        {
          id: 1,
          container_id: containerId,
          recipe_version_id: 3,
          applied_at: '2024-01-03T15:30:00Z',
          applied_by: 'admin',
          previous_recipe_version_id: 2,
          changes_summary: { temperature: '+2°C', humidity: '-5%' },
          environment_sync_status: 'synced',
        },
        {
          id: 2,
          container_id: containerId,
          recipe_version_id: 2,
          applied_at: '2024-01-02T10:00:00Z',
          applied_by: 'operator',
          previous_recipe_version_id: 1,
          changes_summary: { crop_type: 'changed from lettuce to basil' },
          environment_sync_status: 'synced',
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockHistory,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getRecipeHistory(containerId);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/recipes/history`,
        expect.any(Object)
      );
      expect(result).toEqual(mockHistory);
    });

    it('should get recipe history with query parameters', async () => {
      const params: RecipeHistoryQueryParams = {
        limit: 10,
        start_date: '2024-01-01T00:00:00Z',
        end_date: '2024-01-31T23:59:59Z',
      };

      const mockHistory: RecipeApplication[] = [
        {
          id: 1,
          container_id: containerId,
          recipe_version_id: 3,
          applied_at: '2024-01-15T15:30:00Z',
          applied_by: 'admin',
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockHistory,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getRecipeHistory(containerId, params);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/recipes/history?limit=10&start_date=${encodeURIComponent(params.start_date!)}&end_date=${encodeURIComponent(params.end_date!)}`,
        expect.any(Object)
      );
      expect(result).toEqual(mockHistory);
    });
  });

  describe('getAvailableRecipes', () => {
    it('should get available recipes without filters', async () => {
      const mockRecipes: RecipeVersion[] = [
        {
          recipe_version_id: 1,
          recipe_id: 101,
          recipe_name: 'Lettuce Standard',
          version: '1.0.0',
          crop_type: 'lettuce',
          valid_from: '2024-01-01T00:00:00Z',
          valid_to: '2024-12-31T23:59:59Z',
          created_by: 'admin',
          environment_parameters: {
            air_temperature: 22,
            humidity: 65,
            co2: 1200,
          },
        },
        {
          recipe_version_id: 2,
          recipe_id: 102,
          recipe_name: 'Basil Premium',
          version: '2.1.0',
          crop_type: 'basil',
          valid_from: '2024-01-01T00:00:00Z',
          created_by: 'admin',
          environment_parameters: {
            air_temperature: 24,
            humidity: 70,
            co2: 1400,
          },
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRecipes,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getAvailableRecipes(containerId);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/recipes/available`,
        expect.any(Object)
      );
      expect(result).toEqual(mockRecipes);
    });

    it('should get available recipes with filters', async () => {
      const params: AvailableRecipesQueryParams = {
        crop_type: 'lettuce',
        active_only: true,
      };

      const mockRecipes: RecipeVersion[] = [
        {
          recipe_version_id: 1,
          recipe_id: 101,
          recipe_name: 'Lettuce Standard',
          version: '1.0.0',
          crop_type: 'lettuce',
          valid_from: '2024-01-01T00:00:00Z',
          valid_to: '2024-12-31T23:59:59Z',
          created_by: 'admin',
          environment_parameters: {
            air_temperature: 22,
            humidity: 65,
          },
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRecipes,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getAvailableRecipes(containerId, params);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseURL}/containers/${containerId}/recipes/available?crop_type=lettuce&active_only=true`,
        expect.any(Object)
      );
      expect(result).toEqual(mockRecipes);
      expect(result.every(r => r.crop_type === 'lettuce')).toBe(true);
    });

    it('should handle recipes with full environment parameters', async () => {
      const mockRecipes: RecipeVersion[] = [
        {
          recipe_version_id: 3,
          recipe_id: 103,
          recipe_name: 'Advanced Lettuce',
          version: '3.0.0',
          crop_type: 'lettuce',
          valid_from: '2024-01-01T00:00:00Z',
          created_by: 'expert',
          environment_parameters: {
            tray_density: 1.5,
            air_temperature: 22.5,
            humidity: 65,
            co2: 1200,
            water_temperature: 20,
            ec: 1.8,
            ph: 6.2,
            water_hours: 16,
            light_hours: 18,
          },
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRecipes,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await containerService.getAvailableRecipes(containerId);
      
      expect(result[0].environment_parameters).toHaveProperty('tray_density');
      expect(result[0].environment_parameters).toHaveProperty('ph');
      expect(result[0].environment_parameters).toHaveProperty('light_hours');
    });
  });

  describe('Error Handling', () => {
    it('should handle 401 unauthorized errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ detail: 'Invalid token' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await expect(containerService.getActiveRecipes(containerId)).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(containerService.getActiveRecipes(containerId)).rejects.toThrow('Network error');
    });

    it('should handle server errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ detail: 'Database connection failed' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await expect(containerService.applyRecipe(containerId, {
        recipe_version_id: 1,
        applied_by: 'admin',
      })).rejects.toThrow();
    });
  });
});