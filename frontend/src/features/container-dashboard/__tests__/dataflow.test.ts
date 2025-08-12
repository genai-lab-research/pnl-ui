// Dataflow Tests for Container Dashboard
// Tests the integration between models, services, and viewmodels

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ContainerDomainModel,
  FiltersDomainModel,
  PaginationDomainModel,
  PerformanceMetricsDomainModel,
  DashboardDomainModel
} from '../models';
import { DashboardViewModel } from '../viewmodels';

// Mock the API services
vi.mock('../services', () => ({
  containerApiAdapter: {
    getContainers: vi.fn(),
    createContainer: vi.fn(),
    updateContainer: vi.fn(),
    deleteContainer: vi.fn(),
    shutdownContainer: vi.fn()
  },
  performanceApiAdapter: {
    getDashboardMetrics: vi.fn(),
    getCardMetrics: vi.fn()
  },
  filtersApiAdapter: {
    initializeFilters: vi.fn(),
    getFilterOptions: vi.fn()
  }
}));

const mockContainerData = {
  id: 1,
  name: 'Test Container',
  type: 'physical' as const,
  tenant_id: 1,
  purpose: 'development' as const,
  status: 'active' as const,
  location: {
    city: 'San Francisco',
    country: 'USA',
    address: '123 Test St'
  },
  alerts: [],
  seed_types: [],
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  metrics: {
    yield_kg: 25.5,
    space_utilization_pct: 85,
    growth_rate: 1.2,
    health_score: 0.9
  }
};

const mockPerformanceData = {
  physical: {
    container_count: 5,
    yield: {
      average: 24.5,
      total: 122.5,
      chart_data: [
        { date: '2023-01-01', value: 20, is_current_period: false, is_future: false },
        { date: '2023-01-02', value: 25, is_current_period: true, is_future: false }
      ]
    },
    space_utilization: {
      average: 82.5,
      chart_data: [
        { date: '2023-01-01', value: 80, is_current_period: false, is_future: false },
        { date: '2023-01-02', value: 85, is_current_period: true, is_future: false }
      ]
    }
  },
  virtual: {
    container_count: 3,
    yield: {
      average: 18.3,
      total: 55.0,
      chart_data: [
        { date: '2023-01-01', value: 15, is_current_period: false, is_future: false },
        { date: '2023-01-02', value: 20, is_current_period: true, is_future: false }
      ]
    },
    space_utilization: {
      average: 75.0,
      chart_data: [
        { date: '2023-01-01', value: 70, is_current_period: false, is_future: false },
        { date: '2023-01-02', value: 80, is_current_period: true, is_future: false }
      ]
    }
  },
  time_range: {
    type: 'week',
    start_date: '2023-01-01T00:00:00Z',
    end_date: '2023-01-07T23:59:59Z'
  },
  generated_at: '2023-01-02T12:00:00Z'
};

const mockFilterOptions = {
  tenants: [{ id: 1, name: 'Test Tenant' }],
  purposes: ['development', 'research', 'production'],
  statuses: ['created', 'active', 'maintenance', 'inactive'],
  container_types: ['physical', 'virtual']
};

describe('Container Dashboard Dataflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Domain Models', () => {
    it('should create ContainerDomainModel from API response', () => {
      const container = ContainerDomainModel.fromApiResponse(mockContainerData as any);
      
      expect(container.id).toBe(1);
      expect(container.name).toBe('Test Container');
      expect(container.type).toBe('physical');
      expect(container.hasActiveAlerts()).toBe(false);
      expect(container.isPhysical()).toBe(true);
      expect(container.isActive()).toBe(true);
      expect(container.getLocationDisplay()).toBe('San Francisco, USA');
    });

    it('should create PerformanceMetricsDomainModel from API response', () => {
      const performance = PerformanceMetricsDomainModel.fromApiResponse(mockPerformanceData as any);
      
      expect(performance.getTotalContainers()).toBe(8);
      expect(performance.getPhysicalRatio()).toBeCloseTo(0.625); // 5/8
      expect(performance.getVirtualRatio()).toBeCloseTo(0.375); // 3/8
      expect(performance.getTotalYield()).toBe(177.5);
    });

    it('should create FiltersDomainModel with proper validation', () => {
      const filters = FiltersDomainModel.fromOptions(mockFilterOptions);
      
      expect(filters.hasActiveFilters()).toBe(false);
      expect(filters.isValidTenant(1)).toBe(true);
      expect(filters.isValidTenant(999)).toBe(false);
      expect(filters.isValidPurpose('development')).toBe(true);
      expect(filters.isValidPurpose('invalid')).toBe(false);
    });

    it('should handle filter state transitions', () => {
      const filters = FiltersDomainModel.fromOptions(mockFilterOptions);
      
      const withSearch = filters.withSearch('test query');
      expect(withSearch.state.search).toBe('test query');
      expect(withSearch.hasActiveFilters()).toBe(true);
      
      const withTenant = withSearch.withTenant(1);
      expect(withTenant.state.tenant).toBe(1);
      expect(withTenant.getActiveFiltersCount()).toBe(2);
      
      const cleared = withTenant.clearAll();
      expect(cleared.hasActiveFilters()).toBe(false);
    });

    it('should create proper API filters from domain model', () => {
      const filters = FiltersDomainModel.fromOptions(mockFilterOptions)
        .withSearch('test')
        .withType('physical')
        .withTenant(1)
        .withPurpose('development');
      
      const apiFilters = filters.toApiFilters(2, 25, 'name', 'desc');
      
      expect(apiFilters).toEqual({
        page: 2,
        limit: 25,
        sort: 'name',
        order: 'desc',
        search: 'test',
        type: 'physical',
        tenant: 1,
        purpose: 'development'
      });
    });
  });

  describe('Dashboard Domain Model', () => {
    it('should manage dashboard state transitions', () => {
      let dashboard = DashboardDomainModel.createEmpty();
      
      // Add containers
      const containers = [ContainerDomainModel.fromApiResponse(mockContainerData as any)];
      dashboard = dashboard.withContainers(containers);
      expect(dashboard.getTotalContainersCount()).toBe(1);
      
      // Add performance data
      const performance = PerformanceMetricsDomainModel.fromApiResponse(mockPerformanceData as any);
      dashboard = dashboard.withPerformance(performance);
      expect(dashboard.shouldShowPerformanceCards()).toBe(true);
      
      // Test container type filtering
      dashboard = dashboard.withContainerType('physical');
      const filtered = dashboard.getFilteredContainers();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].isPhysical()).toBe(true);
    });

    it('should calculate summary statistics correctly', () => {
      const containers = [
        ContainerDomainModel.fromApiResponse({
          ...mockContainerData,
          id: 1,
          status: 'active',
          alerts: [],
          metrics: { yield_kg: 20, space_utilization_pct: 80, growth_rate: 1.0, health_score: 0.9 }
        } as any),
        ContainerDomainModel.fromApiResponse({
          ...mockContainerData,
          id: 2,
          status: 'active',
          alerts: [{ id: 1, active: true, severity: 'high' } as any],
          metrics: { yield_kg: 30, space_utilization_pct: 90, growth_rate: 1.2, health_score: 0.8 }
        } as any)
      ];
      
      const dashboard = DashboardDomainModel.createEmpty().withContainers(containers);
      
      expect(dashboard.getTotalContainersCount()).toBe(2);
      expect(dashboard.getActiveContainersCount()).toBe(2);
      expect(dashboard.getContainersWithAlertsCount()).toBe(1);
      expect(dashboard.getAverageYield()).toBe(25); // (20 + 30) / 2
      expect(dashboard.getAverageSpaceUtilization()).toBe(85); // (80 + 90) / 2
    });
  });

  describe('Dashboard ViewModel Integration', () => {
    it('should initialize with proper state', () => {
      const viewModel = new DashboardViewModel();
      
      expect(viewModel.isInitialized).toBe(false);
      expect(viewModel.isLoading).toBe(false);
      expect(viewModel.containers).toHaveLength(0);
      expect(viewModel.performance).toBeNull();
    });

    it('should handle state updates through actions', () => {
      const viewModel = new DashboardViewModel();
      
      // Test selection
      viewModel.selectContainer(1);
      expect(viewModel.viewData.selectedContainerId).toBe(1);
      
      // Test modal management
      viewModel.showCreateModal();
      expect(viewModel.viewData.showCreateModal).toBe(true);
      
      viewModel.hideCreateModal();
      expect(viewModel.viewData.showCreateModal).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      const dashboard = DashboardDomainModel.createEmpty()
        .withError({ containers: 'Network error' });
      
      expect(dashboard.hasAnyErrors()).toBe(true);
      expect(dashboard.state.errors.containers).toBe('Network error');
      
      const cleared = dashboard.clearError('containers');
      expect(cleared.state.errors.containers).toBeNull();
    });

    it('should handle loading states correctly', () => {
      const dashboard = DashboardDomainModel.createEmpty()
        .withLoading({ containers: true, performance: true });
      
      expect(dashboard.isAnyLoading()).toBe(true);
      expect(dashboard.canRefreshData()).toBe(false);
      
      const loaded = dashboard.withLoading({ containers: false, performance: false });
      expect(loaded.isAnyLoading()).toBe(false);
      expect(loaded.canRefreshData()).toBe(true);
    });
  });

  describe('Pagination Logic', () => {
    it('should handle pagination state correctly', () => {
      let pagination = PaginationDomainModel.createDefault(10);
      
      expect(pagination.state.currentPage).toBe(1);
      expect(pagination.hasNextPage()).toBe(false);
      expect(pagination.hasPreviousPage()).toBe(false);
      
      // Simulate API response with more data
      pagination = PaginationDomainModel.fromApiResponse({
        page: 1,
        limit: 10,
        total: 25,
        total_pages: 3
      });
      
      expect(pagination.hasNextPage()).toBe(true);
      expect(pagination.getStartItem()).toBe(1);
      expect(pagination.getEndItem()).toBe(10);
      expect(pagination.getPaginationText()).toBe('1-10 of 25 items');
      
      // Navigate to next page
      const nextPage = pagination.nextPage();
      expect(nextPage.state.currentPage).toBe(2);
      expect(nextPage.getStartItem()).toBe(11);
      expect(nextPage.getEndItem()).toBe(20);
    });
  });
});

// Integration test with mocked APIs
describe('Full Dataflow Integration', () => {
  it('should simulate complete dashboard workflow', async () => {
    const { containerApiAdapter, performanceApiAdapter, filtersApiAdapter } = 
      await import('../services');
    
    // Mock successful API responses
    (filtersApiAdapter.initializeFilters as any).mockResolvedValue({
      filters: FiltersDomainModel.fromOptions(mockFilterOptions)
    });
    
    (containerApiAdapter.getContainers as any).mockResolvedValue({
      containers: [ContainerDomainModel.fromApiResponse(mockContainerData as any)],
      pagination: PaginationDomainModel.fromApiResponse({
        page: 1,
        limit: 10,
        total: 1,
        total_pages: 1
      })
    });
    
    (performanceApiAdapter.getDashboardMetrics as any).mockResolvedValue({
      performance: PerformanceMetricsDomainModel.fromApiResponse(mockPerformanceData as any)
    });
    
    const viewModel = new DashboardViewModel();
    
    // Test initialization
    await viewModel.initialize();
    
    // Verify state after initialization
    expect(viewModel.isInitialized).toBe(true);
    expect(viewModel.containers).toHaveLength(1);
    expect(viewModel.performance).not.toBeNull();
    expect(viewModel.filters.availableOptions.tenants).toHaveLength(1);
    
    // Cleanup
    viewModel.dispose();
  });
});
