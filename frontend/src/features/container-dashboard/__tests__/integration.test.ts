// Integration test for Container Dashboard feature exports
import { describe, it, expect } from 'vitest';

describe('Container Dashboard Feature Integration', () => {
  it('should export all required modules', async () => {
    // Test that all modules can be imported without errors
    const feature = await import('../index');
    
    // Check that main exports are available
    expect(feature.useDashboard).toBeDefined();
    expect(feature.DashboardViewModel).toBeDefined();
    expect(feature.ContainerDomainModel).toBeDefined();
    expect(feature.containerApiAdapter).toBeDefined();
    expect(feature.performanceApiAdapter).toBeDefined();
    expect(feature.filtersApiAdapter).toBeDefined();
  });

  it('should be able to create domain models', async () => {
    // Import domain models
    const {
      ContainerDomainModel,
      FiltersDomainModel,
      PaginationDomainModel,
      DashboardDomainModel
    } = await import('../models');

    // Test that models can be created
    const dashboard = DashboardDomainModel.createEmpty();
    expect(dashboard).toBeDefined();
    expect(dashboard.getTotalContainersCount()).toBe(0);

    const filters = FiltersDomainModel.createEmpty();
    expect(filters).toBeDefined();
    expect(filters.hasActiveFilters()).toBe(false);

    const pagination = PaginationDomainModel.createDefault();
    expect(pagination).toBeDefined();
    expect(pagination.state.currentPage).toBe(1);
  });

  it('should be able to create ViewModels', async () => {
    const { DashboardViewModel } = await import('../viewmodels');
    
    const viewModel = new DashboardViewModel();
    expect(viewModel).toBeDefined();
    expect(viewModel.isInitialized).toBe(false);
    expect(viewModel.containers).toEqual([]);
  });

  it('should have working API adapters', async () => {
    const {
      containerApiAdapter,
      performanceApiAdapter,
      filtersApiAdapter
    } = await import('../services');

    // Check that adapters are singleton instances
    expect(containerApiAdapter).toBeDefined();
    expect(performanceApiAdapter).toBeDefined();
    expect(filtersApiAdapter).toBeDefined();

    // Check that they have expected methods
    expect(typeof containerApiAdapter.getContainers).toBe('function');
    expect(typeof performanceApiAdapter.getDashboardMetrics).toBe('function');
    expect(typeof filtersApiAdapter.getFilterOptions).toBe('function');
  });
});
