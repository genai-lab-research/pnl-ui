import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  useContainerFilters,
  useContainerMetrics,
  useContainerActions,
  useContainerTableActions
} from '../hooks';
import { containerService } from '../services';
import type { Container, PerformanceMetrics, FilterOptions } from '../types';

// Mock the container service
vi.mock('../services/containerService', () => ({
  containerService: {
    getFilterOptions: vi.fn(),
    getPerformanceMetrics: vi.fn(),
    getContainers: vi.fn(),
    createContainer: vi.fn(),
    updateContainer: vi.fn(),
    deleteContainer: vi.fn(),
    shutdownContainer: vi.fn()
  }
}));

const mockContainerService = containerService as {
  getFilterOptions: vi.Mock;
  getPerformanceMetrics: vi.Mock;
  getContainers: vi.Mock;
  createContainer: vi.Mock;
  updateContainer: vi.Mock;
  deleteContainer: vi.Mock;
  shutdownContainer: vi.Mock;
};

// Test data
const mockFilterOptions: FilterOptions = {
  tenants: [
    { id: 1, name: 'Farm Corp' },
    { id: 2, name: 'Green Tech' }
  ],
  purposes: ['development', 'research', 'production'],
  statuses: ['created', 'active', 'maintenance', 'inactive'],
  container_types: ['physical', 'virtual']
};

const mockPerformanceMetrics: PerformanceMetrics = {
  physical: {
    container_count: 12,
    yield: {
      average: 15.6,
      total: 187.2,
      chart_data: [
        { date: '2024-01-01', value: 14.2, is_current_period: false, is_future: false },
        { date: '2024-01-02', value: 16.8, is_current_period: true, is_future: false }
      ]
    },
    space_utilization: {
      average: 82.5,
      chart_data: [
        { date: '2024-01-01', value: 80.0, is_current_period: false, is_future: false },
        { date: '2024-01-02', value: 85.0, is_current_period: true, is_future: false }
      ]
    }
  },
  virtual: {
    container_count: 24,
    yield: {
      average: 8.9,
      total: 213.6,
      chart_data: [
        { date: '2024-01-01', value: 8.1, is_current_period: false, is_future: false },
        { date: '2024-01-02', value: 9.7, is_current_period: true, is_future: false }
      ]
    },
    space_utilization: {
      average: 91.2,
      chart_data: [
        { date: '2024-01-01', value: 89.0, is_current_period: false, is_future: false },
        { date: '2024-01-02', value: 93.4, is_current_period: true, is_future: false }
      ]
    }
  },
  time_range: {
    type: 'week',
    start_date: '2024-01-01',
    end_date: '2024-01-07'
  },
  generated_at: '2024-01-02T10:30:00Z'
};

const mockContainer: Container = {
  id: 1,
  name: 'Test Container',
  tenant_id: 1,
  type: 'physical',
  purpose: 'development',
  location: { city: 'San Francisco', country: 'USA', address: '123 Farm St' },
  notes: 'Test container for development',
  status: 'active',
  created_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-02T10:00:00Z',
  seed_types: [],
  alerts: [],
  settings: {
    shadow_service_enabled: false,
    copied_environment_from: null,
    robotics_simulation_enabled: true,
    ecosystem_connected: false,
    ecosystem_settings: {}
  },
  environment: {
    temperature: 22.5,
    humidity: 65,
    co2: 400,
    light_intensity: 800
  },
  inventory: {
    total_capacity: 100,
    used_capacity: 75,
    available_capacity: 25,
    seed_count: 50
  },
  metrics: {
    yield_kg: 15.6,
    space_utilization_pct: 82.5,
    growth_rate: 1.2,
    health_score: 95
  }
};

describe('Container Management Dataflow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Filter Management Dataflow', () => {
    it('should load filter options and apply filters correctly', async () => {
      mockContainerService.getFilterOptions.mockResolvedValue(mockFilterOptions);

      const filtersChanged = vi.fn();
      const { result } = renderHook(() => 
        useContainerFilters({ onFiltersChange: filtersChanged })
      );

      // Wait for filter options to load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockContainerService.getFilterOptions).toHaveBeenCalled();
      expect(result.current.filterOptions).toEqual(mockFilterOptions);

      // Test filter changes
      act(() => {
        result.current.setTypeFilter('physical');
      });

      expect(filtersChanged).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'physical' })
      );
      expect(result.current.filters.type).toBe('physical');

      // Test multiple filters
      act(() => {
        result.current.setTenantFilter(1);
        result.current.setAlertsFilter(true);
      });

      expect(result.current.hasActiveFilters).toBe(true);
      expect(result.current.isFilterActive('type')).toBe(true);
      expect(result.current.isFilterActive('alerts')).toBe(true);
    });

    it('should handle search debouncing correctly', async () => {
      vi.useFakeTimers();
      const filtersChanged = vi.fn();

      const { result } = renderHook(() => 
        useContainerFilters({ 
          onFiltersChange: filtersChanged,
          debounceDelay: 300
        })
      );

      // Rapid search inputs
      act(() => {
        result.current.setSearchValue('con');
      });
      act(() => {
        result.current.setSearchValue('cont');
      });
      act(() => {
        result.current.setSearchValue('container');
      });

      // Should not have triggered onChange yet
      expect(filtersChanged).not.toHaveBeenCalled();

      // Advance timers
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Should have triggered with final value
      expect(filtersChanged).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'container' })
      );

      vi.useRealTimers();
    });

    it('should clear all filters correctly', async () => {
      const filtersChanged = vi.fn();
      const { result } = renderHook(() => 
        useContainerFilters({ onFiltersChange: filtersChanged })
      );

      // Set multiple filters
      act(() => {
        result.current.setTypeFilter('physical');
        result.current.setTenantFilter(1);
        result.current.setAlertsFilter(true);
        result.current.setSearchValue('test');
      });

      expect(result.current.hasActiveFilters).toBe(true);

      // Clear all filters
      act(() => {
        result.current.clearAllFilters();
      });

      expect(result.current.hasActiveFilters).toBe(false);
      expect(result.current.searchValue).toBe('');
      expect(result.current.hasAlertsFilter).toBe(false);
      expect(filtersChanged).toHaveBeenCalledWith(
        expect.objectContaining({
          search: '',
          type: 'all',
          tenant: 'all',
          purpose: 'all',
          status: 'all',
          alerts: false
        })
      );
    });
  });

  describe('Metrics Management Dataflow', () => {
    it('should load metrics and handle time range changes', async () => {
      mockContainerService.getPerformanceMetrics.mockResolvedValue(mockPerformanceMetrics);

      const metricsChanged = vi.fn();
      const { result } = renderHook(() => 
        useContainerMetrics({ onMetricsChange: metricsChanged })
      );

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockContainerService.getPerformanceMetrics).toHaveBeenCalledWith({
        timeRange: 'week',
        type: 'all',
        containerIds: undefined
      });
      expect(result.current.metrics).toEqual(mockPerformanceMetrics);
      expect(metricsChanged).toHaveBeenCalledWith(mockPerformanceMetrics);

      // Test time range change
      await act(async () => {
        await result.current.setTimeRange('month');
      });

      expect(mockContainerService.getPerformanceMetrics).toHaveBeenCalledWith({
        timeRange: 'month',
        type: 'all',
        containerIds: undefined
      });
      expect(result.current.timeRange).toBe('month');
    });

    it('should handle metrics loading errors', async () => {
      const errorMessage = 'Failed to load metrics';
      mockContainerService.getPerformanceMetrics.mockRejectedValue(new Error(errorMessage));

      const metricsChanged = vi.fn();
      const { result } = renderHook(() => 
        useContainerMetrics({ onMetricsChange: metricsChanged })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.metrics).toBeNull();
      expect(metricsChanged).toHaveBeenCalledWith(null);
    });

    it('should refresh metrics correctly', async () => {
      mockContainerService.getPerformanceMetrics.mockResolvedValue(mockPerformanceMetrics);

      const { result } = renderHook(() => useContainerMetrics());

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const initialCallCount = mockContainerService.getPerformanceMetrics.mock.calls.length;

      // Refresh metrics
      await act(async () => {
        await result.current.refreshMetrics();
      });

      expect(mockContainerService.getPerformanceMetrics.mock.calls.length).toBe(initialCallCount + 1);
    });
  });

  describe('Container Actions Dataflow', () => {
    it('should create container successfully', async () => {
      mockContainerService.createContainer.mockResolvedValue(mockContainer);

      const containerCreated = vi.fn();
      const { result } = renderHook(() => 
        useContainerActions({ onContainerCreated: containerCreated })
      );

      const createRequest = {
        name: 'New Container',
        tenant_id: 1,
        type: 'physical' as const,
        purpose: 'development' as const,
        notes: 'New test container',
        shadow_service_enabled: false,
        robotics_simulation_enabled: true,
        ecosystem_connected: false,
        ecosystem_settings: {},
        status: 'created' as const,
        seed_type_ids: []
      };

      await act(async () => {
        const container = await result.current.createContainer(createRequest);
        expect(container).toEqual(mockContainer);
      });

      expect(mockContainerService.createContainer).toHaveBeenCalledWith(createRequest);
      expect(containerCreated).toHaveBeenCalledWith(mockContainer);
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();
    });

    it('should handle container creation errors', async () => {
      const errorMessage = 'Validation failed';
      mockContainerService.createContainer.mockRejectedValue(new Error(errorMessage));

      const onError = vi.fn();
      const { result } = renderHook(() => 
        useContainerActions({ onError })
      );

      const createRequest = {
        name: '',
        tenant_id: 1,
        type: 'physical' as const,
        purpose: 'development' as const,
        notes: '',
        shadow_service_enabled: false,
        robotics_simulation_enabled: false,
        ecosystem_connected: false,
        ecosystem_settings: {},
        status: 'created' as const,
        seed_type_ids: []
      };

      await act(async () => {
        try {
          await result.current.createContainer(createRequest);
          expect.fail('Should have thrown error');
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });

      expect(result.current.createError).toBe(errorMessage);
      expect(onError).toHaveBeenCalledWith(errorMessage, 'create');
    });

    it('should update container successfully', async () => {
      const updatedContainer = { ...mockContainer, name: 'Updated Container' };
      mockContainerService.updateContainer.mockResolvedValue(updatedContainer);

      const containerUpdated = vi.fn();
      const { result } = renderHook(() => 
        useContainerActions({ onContainerUpdated: containerUpdated })
      );

      const updateRequest = { name: 'Updated Container' };

      await act(async () => {
        const container = await result.current.updateContainer(1, updateRequest);
        expect(container).toEqual(updatedContainer);
      });

      expect(mockContainerService.updateContainer).toHaveBeenCalledWith(1, updateRequest);
      expect(containerUpdated).toHaveBeenCalledWith(updatedContainer);
    });

    it('should delete container successfully', async () => {
      mockContainerService.deleteContainer.mockResolvedValue(undefined);

      const containerDeleted = vi.fn();
      const { result } = renderHook(() => 
        useContainerActions({ onContainerDeleted: containerDeleted })
      );

      await act(async () => {
        await result.current.deleteContainer(1);
      });

      expect(mockContainerService.deleteContainer).toHaveBeenCalledWith(1);
      expect(containerDeleted).toHaveBeenCalledWith(1);
    });

    it('should shutdown container successfully', async () => {
      const shutdownResponse = { success: true, message: 'Container shut down', container_id: 1 };
      mockContainerService.shutdownContainer.mockResolvedValue(shutdownResponse);

      const containerShutdown = vi.fn();
      const { result } = renderHook(() => 
        useContainerActions({ onContainerShutdown: containerShutdown })
      );

      const shutdownRequest = { reason: 'Maintenance', force: false };

      await act(async () => {
        await result.current.shutdownContainer(1, shutdownRequest);
      });

      expect(mockContainerService.shutdownContainer).toHaveBeenCalledWith(1, shutdownRequest);
      expect(containerShutdown).toHaveBeenCalledWith(1);
    });
  });

  describe('Table Actions Integration', () => {
    it('should execute row actions correctly', async () => {
      mockContainerService.deleteContainer.mockResolvedValue(undefined);
      mockContainerService.shutdownContainer.mockResolvedValue({
        success: true,
        message: 'Shutdown complete',
        container_id: 1
      });

      const actionComplete = vi.fn();
      const { result } = renderHook(() => 
        useContainerTableActions(actionComplete)
      );

      // Test delete action
      await act(async () => {
        await result.current.executeRowAction('1', 'delete');
      });

      expect(mockContainerService.deleteContainer).toHaveBeenCalledWith(1);
      expect(actionComplete).toHaveBeenCalledWith('delete', '1');

      // Test shutdown action
      await act(async () => {
        await result.current.executeRowAction('2', 'shutdown', {
          reason: 'Manual shutdown',
          force: false
        });
      });

      expect(mockContainerService.shutdownContainer).toHaveBeenCalledWith(2, {
        reason: 'Manual shutdown',
        force: false
      });
      expect(actionComplete).toHaveBeenCalledWith('shutdown', '2');
    });

    it('should track pending actions correctly', async () => {
      // Mock long-running operation
      mockContainerService.deleteContainer.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useContainerTableActions());

      // Start action
      const promise = act(async () => {
        return result.current.executeRowAction('1', 'delete');
      });

      // Should be pending
      expect(result.current.isActionPending('delete', '1')).toBe(true);
      expect(result.current.hasPendingActions).toBe(true);

      // Wait for completion
      await promise;

      // Should no longer be pending
      expect(result.current.isActionPending('delete', '1')).toBe(false);
      expect(result.current.hasPendingActions).toBe(false);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete filter-to-data flow', async () => {
      const containersResponse = {
        data: [mockContainer],
        pagination: { page: 1, limit: 10, total: 1, total_pages: 1 },
        performance_metrics: mockPerformanceMetrics
      };

      mockContainerService.getFilterOptions.mockResolvedValue(mockFilterOptions);
      mockContainerService.getContainers.mockResolvedValue(containersResponse);

      const filtersChanged = vi.fn();
      
      // Simulate using both hooks together
      const { result: filtersResult } = renderHook(() => 
        useContainerFilters({ onFiltersChange: filtersChanged })
      );

      // Wait for filter options to load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Apply filters
      act(() => {
        filtersResult.current.setTypeFilter('physical');
        filtersResult.current.setTenantFilter(1);
      });

      expect(filtersChanged).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'physical',
          tenant: 1
        })
      );

      // This would typically trigger a data refresh in the actual implementation
      expect(filtersResult.current.hasActiveFilters).toBe(true);
    });

    it('should handle error recovery flows', async () => {
      // First call fails
      mockContainerService.getPerformanceMetrics
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockPerformanceMetrics);

      const { result } = renderHook(() => useContainerMetrics());

      // Wait for initial failure
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe('Network error');

      // Clear error and retry
      act(() => {
        result.current.clearError();
      });

      expect(result.current.isError).toBe(false);

      // Retry should succeed
      await act(async () => {
        await result.current.refreshMetrics();
      });

      expect(result.current.isError).toBe(false);
      expect(result.current.metrics).toEqual(mockPerformanceMetrics);
    });
  });
});