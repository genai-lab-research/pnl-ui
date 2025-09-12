import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  useContainerSearchFiltersViewModel,
  useContainerMetricsOverviewViewModel,
  useContainerDataTableViewModel
} from '../viewmodels';

// Mock the services
vi.mock('../services/containerService', () => ({
  containerService: {
    getFilterOptions: vi.fn(),
    getPerformanceMetrics: vi.fn(),
    getContainers: vi.fn(),
    getContainer: vi.fn(),
    createContainer: vi.fn(),
    updateContainer: vi.fn(),
    deleteContainer: vi.fn(),
    shutdownContainer: vi.fn()
  }
}));

// Mock data
const mockFilterOptions = {
  tenants: [{ id: 1, name: 'Farm Corp' }],
  purposes: ['development', 'research'],
  statuses: ['active', 'inactive'],
  container_types: ['physical', 'virtual']
};

const mockPerformanceMetrics = {
  physical: {
    container_count: 10,
    yield: { average: 15.0, total: 150.0, chart_data: [] },
    space_utilization: { average: 85.0, chart_data: [] }
  },
  virtual: {
    container_count: 5,
    yield: { average: 10.0, total: 50.0, chart_data: [] },
    space_utilization: { average: 90.0, chart_data: [] }
  },
  time_range: { type: 'week', start_date: '2024-01-01', end_date: '2024-01-07' },
  generated_at: '2024-01-02T10:00:00Z'
};

const mockContainersResponse = {
  data: [],
  pagination: { page: 1, limit: 10, total: 0, total_pages: 0 },
  performance_metrics: mockPerformanceMetrics
};

describe('ViewModels Tests', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Setup default mocks
    const { containerService } = await import('../services');
    (containerService.getFilterOptions as vi.Mock).mockResolvedValue(mockFilterOptions);
    (containerService.getPerformanceMetrics as vi.Mock).mockResolvedValue(mockPerformanceMetrics);
    (containerService.getContainers as vi.Mock).mockResolvedValue(mockContainersResponse);
  });

  describe('ContainerSearchFiltersViewModel', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useContainerSearchFiltersViewModel());

      expect(result.current.filters).toEqual({
        search: '',
        type: 'all',
        tenant: 'all',
        purpose: 'all',
        status: 'all',
        alerts: false
      });
      expect(result.current.searchInput).toBe('');
      expect(result.current.hasAlertsFilter).toBe(false);
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('should load filter options on mount', async () => {
      const { result } = renderHook(() => useContainerSearchFiltersViewModel());

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      // Wait for load to complete
      await act(async () => {
        await result.current.loadFilterOptions();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.filterOptions.data).toEqual(mockFilterOptions);
    });

    it('should handle filter chip option changes', async () => {
      const onFiltersChange = vi.fn();
      const { result } = renderHook(() => 
        useContainerSearchFiltersViewModel(onFiltersChange)
      );

      await act(async () => {
        await result.current.loadFilterOptions();
      });

      act(() => {
        result.current.setFilterChipOption('type', 'physical');
      });

      expect(result.current.filters.type).toBe('physical');
      expect(onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'physical' })
      );
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('should handle search value changes with debouncing', () => {
      vi.useFakeTimers();
      const onFiltersChange = vi.fn();
      const { result } = renderHook(() => 
        useContainerSearchFiltersViewModel(onFiltersChange, 300)
      );

      act(() => {
        result.current.setSearchValue('test search');
      });

      // Should update input immediately
      expect(result.current.searchInput).toBe('test search');
      
      // Should not have called onChange yet
      expect(onFiltersChange).not.toHaveBeenCalled();

      // Fast forward past debounce delay
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'test search' })
      );

      vi.useRealTimers();
    });

    it('should generate filter chips correctly', async () => {
      const { result } = renderHook(() => useContainerSearchFiltersViewModel());

      await act(async () => {
        await result.current.loadFilterOptions();
      });

      // Should have filter chips based on options
      expect(result.current.filterChips).toHaveLength(4); // type, tenant, purpose, status
      
      const typeChip = result.current.filterChips.find(chip => chip.id === 'type');
      expect(typeChip).toBeDefined();
      expect(typeChip!.options).toEqual([
        { id: 'all', label: 'All Types', value: 'all' },
        { id: 'physical', label: 'Physical', value: 'physical' },
        { id: 'virtual', label: 'Virtual', value: 'virtual' }
      ]);
    });

    it('should clear all filters correctly', async () => {
      const onFiltersChange = vi.fn();
      const { result } = renderHook(() => 
        useContainerSearchFiltersViewModel(onFiltersChange)
      );

      // Set some filters first
      act(() => {
        result.current.setFilterChipOption('type', 'physical');
        result.current.setHasAlertsFilter(true);
        result.current.setSearchValue('test');
      });

      expect(result.current.hasActiveFilters).toBe(true);

      act(() => {
        result.current.clearAllFilters();
      });

      expect(result.current.hasActiveFilters).toBe(false);
      expect(result.current.searchInput).toBe('');
      expect(result.current.hasAlertsFilter).toBe(false);
      expect(result.current.filters).toEqual({
        search: '',
        type: 'all',
        tenant: 'all',
        purpose: 'all',
        status: 'all',
        alerts: false
      });
    });
  });

  describe('ContainerMetricsOverviewViewModel', () => {
    it('should initialize with default state and load metrics', async () => {
      const { result } = renderHook(() => useContainerMetricsOverviewViewModel());

      expect(result.current.selectedTimeRange).toBe('week');
      expect(result.current.selectedContainerType).toBe('all');

      // Wait for initial metrics load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.hasData).toBe(true);
      expect(result.current.physicalCardData).toBeDefined();
      expect(result.current.virtualCardData).toBeDefined();
    });

    it('should handle time range changes', async () => {
      const { result } = renderHook(() => useContainerMetricsOverviewViewModel());

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Change time range
      await act(async () => {
        await result.current.setTimeRange('month');
      });

      expect(result.current.selectedTimeRange).toBe('month');

      const { containerService } = await import('../services');
      expect(containerService.getPerformanceMetrics).toHaveBeenCalledWith({
        timeRange: 'month',
        type: 'all',
        containerIds: undefined
      });
    });

    it('should handle container type filter toggles', () => {
      const onFiltersChange = vi.fn();
      const { result } = renderHook(() => 
        useContainerMetricsOverviewViewModel(onFiltersChange)
      );

      // Toggle to physical
      act(() => {
        result.current.toggleContainerTypeFilter('physical');
      });

      expect(result.current.selectedContainerType).toBe('physical');
      expect(result.current.isPhysicalCardActive).toBe(true);
      expect(result.current.isVirtualCardActive).toBe(false);
      expect(onFiltersChange).toHaveBeenCalledWith({ containerType: 'physical' });

      // Toggle back to all (clicking same type again)
      act(() => {
        result.current.toggleContainerTypeFilter('physical');
      });

      expect(result.current.selectedContainerType).toBe('all');
      expect(result.current.isPhysicalCardActive).toBe(false);
      expect(onFiltersChange).toHaveBeenCalledWith({ containerType: null });
    });

    it('should generate time range selector data correctly', () => {
      const { result } = renderHook(() => useContainerMetricsOverviewViewModel());

      expect(result.current.timeRangeSelectorData).toEqual({
        options: [
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'quarter', label: 'Quarter' },
          { value: 'year', label: 'Year' }
        ],
        selectedValue: 'week'
      });
    });

    it('should handle metrics loading errors', async () => {
      const { containerService } = await import('../services');
      containerService.getPerformanceMetrics.mockRejectedValueOnce(new Error('API Error'));

      const { result } = renderHook(() => useContainerMetricsOverviewViewModel());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe('API Error');
      expect(result.current.hasData).toBe(false);
    });

    it('should refresh metrics correctly', async () => {
      const { result } = renderHook(() => useContainerMetricsOverviewViewModel());

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const { containerService } = await import('../services');
      const initialCallCount = containerService.getPerformanceMetrics.mock.calls.length;

      // Refresh
      await act(async () => {
        await result.current.refreshMetrics();
      });

      expect(containerService.getPerformanceMetrics.mock.calls.length).toBe(initialCallCount + 1);
    });
  });

  describe('ContainerDataTableViewModel', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useContainerDataTableViewModel());

      expect(result.current.selectedRowId).toBeNull();
      expect(result.current.pagination).toEqual({ page: 1, limit: 10 });
      expect(result.current.sortOptions).toEqual({ field: 'name', order: 'asc' });
      expect(result.current.isCreateDialogOpen).toBe(false);
      expect(result.current.isEditDialogOpen).toBe(false);
    });

    it('should handle row selection', async () => {
      const { result } = renderHook(() => useContainerDataTableViewModel());

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.selectRow('1');
      });

      expect(result.current.selectedRowId).toBe('1');

      // Select same row again should deselect
      act(() => {
        result.current.selectRow('1');
      });

      expect(result.current.selectedRowId).toBeNull();
    });

    it('should handle pagination changes', async () => {
      const { result } = renderHook(() => useContainerDataTableViewModel());

      await act(async () => {
        await result.current.changePage(2);
      });

      expect(result.current.pagination.page).toBe(2);

      await act(async () => {
        await result.current.changePageSize(25);
      });

      expect(result.current.pagination.limit).toBe(25);
      expect(result.current.pagination.page).toBe(1); // Should reset to page 1
    });

    it('should handle sorting changes', async () => {
      const { result } = renderHook(() => useContainerDataTableViewModel());

      await act(async () => {
        await result.current.sortBy('created_at');
      });

      expect(result.current.sortOptions).toEqual({
        field: 'created_at',
        order: 'asc'
      });

      // Sort by same field should toggle order
      await act(async () => {
        await result.current.sortBy('created_at');
      });

      expect(result.current.sortOptions).toEqual({
        field: 'created_at',
        order: 'desc'
      });
    });

    it('should handle dialog state management', () => {
      const { result } = renderHook(() => useContainerDataTableViewModel());

      // Create dialog
      act(() => {
        result.current.openCreateDialog();
      });
      expect(result.current.isCreateDialogOpen).toBe(true);

      act(() => {
        result.current.closeCreateDialog();
      });
      expect(result.current.isCreateDialogOpen).toBe(false);
    });

    it('should handle container creation', async () => {
      const { containerService } = await import('../services');
      const mockContainer = { id: 1, name: 'New Container' };
      containerService.createContainer.mockResolvedValue(mockContainer);

      const { result } = renderHook(() => useContainerDataTableViewModel());

      const createRequest = {
        name: 'New Container',
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
        await result.current.createContainer(createRequest);
      });

      expect(containerService.createContainer).toHaveBeenCalledWith(createRequest);
      expect(result.current.isCreateDialogOpen).toBe(false);
      
      // Should trigger a refresh
      expect(containerService.getContainers).toHaveBeenCalled();
    });

    it('should calculate derived state correctly', async () => {
      const containersWithData = {
        data: [
          { 
            id: 1, 
            name: 'Test Container',
            type: 'physical',
            tenant_id: 1,
            purpose: 'development',
            location: { city: 'SF', country: 'USA', address: '123 St' },
            status: 'active',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
            alerts: []
          }
        ],
        pagination: { page: 2, limit: 25, total: 50, total_pages: 2 }
      };

      const { containerService } = await import('../services');
      containerService.getContainers.mockResolvedValue(containersWithData);

      const { result } = renderHook(() => useContainerDataTableViewModel());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.hasData).toBe(true);
      expect(result.current.totalPages).toBe(2);
      expect(result.current.currentPage).toBe(2);
      expect(result.current.pageSize).toBe(25);
      expect(result.current.totalItems).toBe(50);
      expect(result.current.isFirstPage).toBe(false);
      expect(result.current.isLastPage).toBe(true);
      expect(result.current.tableRows).toHaveLength(1);
    });
  });

  describe('ViewModel Integration', () => {
    it('should work together in a complete dashboard scenario', async () => {
      const filtersChanged = vi.fn();
      const metricsChanged = vi.fn();

      // Setup all viewmodels
      const { result: filtersVM } = renderHook(() => 
        useContainerSearchFiltersViewModel(filtersChanged)
      );
      const { result: metricsVM } = renderHook(() => 
        useContainerMetricsOverviewViewModel(metricsChanged)
      );
      const { result: tableVM } = renderHook(() => 
        useContainerDataTableViewModel()
      );

      // Wait for initial loads
      await act(async () => {
        await filtersVM.current.loadFilterOptions();
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Apply filters
      act(() => {
        filtersVM.current.setFilterChipOption('type', 'physical');
      });

      expect(filtersChanged).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'physical' })
      );

      // In real implementation, this would trigger table refresh
      await act(async () => {
        await tableVM.current.loadContainers(filtersVM.current.filters);
      });

      // Toggle metric card (would filter table in real implementation)
      act(() => {
        metricsVM.current.toggleContainerTypeFilter('physical');
      });

      expect(metricsVM.current.isPhysicalCardActive).toBe(true);

      // All viewmodels should maintain their state consistently
      expect(filtersVM.current.hasActiveFilters).toBe(true);
      expect(metricsVM.current.hasData).toBe(true);
      expect(tableVM.current.tableRows).toBeDefined();
    });
  });
});