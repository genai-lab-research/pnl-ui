// Dashboard ViewModel
// Orchestrates the entire dashboard state and coordinates between different sections

import { 
  DashboardDomainModel,
  DashboardState,
  ContainerDomainModel,
  PerformanceMetricsDomainModel,
  FiltersDomainModel,
  PaginationDomainModel,
  TimeRangeType
} from '../models';
import {
  containerApiAdapter,
  performanceApiAdapter,
  filtersApiAdapter
} from '../services';

export interface DashboardViewState {
  isInitialized: boolean;
  lastRefresh: Date | null;
  selectedContainerId: number | null;
  showCreateModal: boolean;
  showEditModal: boolean;
  editingContainer: ContainerDomainModel | null;
  actionInProgress: {
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    shuttingDown: boolean;
  };
}

export class DashboardViewModel {
  private domainModel: DashboardDomainModel;
  private viewState: DashboardViewState;
  private refreshInterval: number | null = null;
  private readonly AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

  constructor(initialState?: Partial<DashboardState>) {
    this.domainModel = initialState 
      ? new DashboardDomainModel({ ...DashboardDomainModel.createEmpty().state, ...initialState })
      : DashboardDomainModel.createEmpty();
    
    this.viewState = {
      isInitialized: false,
      lastRefresh: null,
      selectedContainerId: null,
      showCreateModal: false,
      showEditModal: false,
      editingContainer: null,
      actionInProgress: {
        creating: false,
        updating: false,
        deleting: false,
        shuttingDown: false
      }
    };
  }

  // Getters for UI consumption
  get state(): DashboardState {
    return this.domainModel.state;
  }

  get viewData(): DashboardViewState {
    return { ...this.viewState };
  }

  get isInitialized(): boolean {
    return this.viewState.isInitialized;
  }

  get isLoading(): boolean {
    return this.domainModel.isAnyLoading();
  }

  get hasErrors(): boolean {
    return this.domainModel.hasAnyErrors();
  }

  get canRefresh(): boolean {
    return this.domainModel.canRefreshData() && !this.isActionInProgress();
  }

  get containers(): ContainerDomainModel[] {
    return this.domainModel.getFilteredContainers();
  }

  get performance(): PerformanceMetricsDomainModel | null {
    return this.domainModel.state.performance;
  }

  get filters(): FiltersDomainModel {
    return this.domainModel.state.filters;
  }

  get pagination(): PaginationDomainModel {
    return this.domainModel.state.pagination;
  }

  // Initialization
  async initialize(): Promise<void> {
    if (this.viewState.isInitialized) return;

    try {
      // Start loading states
      this.domainModel = this.domainModel
        .withLoading({ containers: true, performance: true, filterOptions: true })
        .clearError('containers')
        .clearError('performance')
        .clearError('filterOptions');

      // Load all initial data in parallel
      const [filtersResult, containersResult, performanceResult] = await Promise.allSettled([
        filtersApiAdapter.initializeFilters(),
        this.loadContainers(),
        this.loadPerformanceMetrics()
      ]);

      // Process filter options
      if (filtersResult.status === 'fulfilled' && !filtersResult.value.error) {
        this.domainModel = this.domainModel.withFilters(filtersResult.value.filters);
      } else {
        const error = filtersResult.status === 'rejected' 
          ? filtersResult.reason?.message 
          : filtersResult.value.error;
        this.domainModel = this.domainModel.withError({ filterOptions: error || 'Failed to load filter options' });
      }

      // Update loading states
      this.domainModel = this.domainModel.withLoading({
        containers: false,
        performance: false,
        filterOptions: false
      });

      this.viewState.isInitialized = true;
      this.viewState.lastRefresh = new Date();

      // Start auto-refresh
      this.startAutoRefresh();
    } catch (error) {
      this.domainModel = this.domainModel
        .withLoading({ containers: false, performance: false, filterOptions: false })
        .withError({
          containers: error instanceof Error ? error.message : 'Initialization failed',
          performance: error instanceof Error ? error.message : 'Initialization failed',
          filterOptions: error instanceof Error ? error.message : 'Initialization failed'
        });
    }
  }

  // Data loading methods
  private async loadContainers(): Promise<void> {
    try {
      const result = await containerApiAdapter.getContainers(
        this.domainModel.state.filters,
        this.domainModel.state.pagination
      );

      if (result.error) {
        this.domainModel = this.domainModel.withError({ containers: result.error });
      } else {
        this.domainModel = this.domainModel
          .withContainers(result.containers)
          .withPagination(result.pagination)
          .clearError('containers');
      }
    } catch (error) {
      this.domainModel = this.domainModel.withError({
        containers: error instanceof Error ? error.message : 'Failed to load containers'
      });
    }
  }

  private async loadPerformanceMetrics(): Promise<void> {
    try {
      const result = await performanceApiAdapter.getDashboardMetrics(
        this.domainModel.state.selectedTimeRange,
        {
          containerType: this.domainModel.state.selectedContainerType
        }
      );

      if (result.error) {
        this.domainModel = this.domainModel.withError({ performance: result.error });
      } else if (result.performance) {
        this.domainModel = this.domainModel
          .withPerformance(result.performance)
          .clearError('performance');
      }
    } catch (error) {
      this.domainModel = this.domainModel.withError({
        performance: error instanceof Error ? error.message : 'Failed to load performance metrics'
      });
    }
  }

  // Public action methods
  async refreshAll(): Promise<void> {
    if (!this.canRefresh) return;

    this.domainModel = this.domainModel.withLoading({
      containers: true,
      performance: true
    });

    await Promise.all([
      this.loadContainers(),
      this.loadPerformanceMetrics()
    ]);

    this.domainModel = this.domainModel.withLoading({
      containers: false,
      performance: false
    });

    this.viewState.lastRefresh = new Date();
  }

  async refreshContainers(): Promise<void> {
    if (this.domainModel.state.loading.containers) return;

    this.domainModel = this.domainModel.withLoading({ containers: true });
    await this.loadContainers();
    this.domainModel = this.domainModel.withLoading({ containers: false });
  }

  async refreshPerformance(): Promise<void> {
    if (this.domainModel.state.loading.performance) return;

    this.domainModel = this.domainModel.withLoading({ performance: true });
    await this.loadPerformanceMetrics();
    this.domainModel = this.domainModel.withLoading({ performance: false });
  }

  // Filter and search methods
  async applyFilters(newFilters: FiltersDomainModel): Promise<void> {
    this.domainModel = this.domainModel
      .withFilters(newFilters)
      .withPagination(this.domainModel.state.pagination.firstPage()); // Reset to first page
    
    await this.refreshContainers();
  }

  async updateSearch(searchQuery: string): Promise<void> {
    const newFilters = this.domainModel.state.filters.withSearch(searchQuery);
    await this.applyFilters(newFilters);
  }

  async clearFilters(): Promise<void> {
    const clearedFilters = this.domainModel.state.filters.clearAll();
    await this.applyFilters(clearedFilters);
  }

  // Pagination methods
  async changePage(page: number): Promise<void> {
    const newPagination = this.domainModel.state.pagination.withPage(page);
    this.domainModel = this.domainModel.withPagination(newPagination);
    await this.refreshContainers();
  }

  async changePageSize(pageSize: number): Promise<void> {
    const newPagination = this.domainModel.state.pagination.withPageSize(pageSize);
    this.domainModel = this.domainModel.withPagination(newPagination);
    await this.refreshContainers();
  }

  // Time range and container type selection
  async changeTimeRange(timeRange: TimeRangeType): Promise<void> {
    this.domainModel = this.domainModel.withTimeRange(timeRange);
    await this.refreshPerformance();
  }

  async selectContainerType(containerType: 'all' | 'physical' | 'virtual'): Promise<void> {
    this.domainModel = this.domainModel.withContainerType(containerType);
    // Refresh performance metrics to get data for the selected container type
    await this.refreshPerformance();
  }

  // Container management actions
  async createContainer(containerData: any): Promise<{ success: boolean; error?: string }> {
    if (this.viewState.actionInProgress.creating) {
      return { success: false, error: 'Create operation already in progress' };
    }

    try {
      this.viewState.actionInProgress.creating = true;
      
      const result = await containerApiAdapter.createContainer(containerData);
      
      if (result.success) {
        await this.refreshContainers();
        this.viewState.showCreateModal = false;
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create container'
      };
    } finally {
      this.viewState.actionInProgress.creating = false;
    }
  }

  async updateContainer(id: number, containerData: any): Promise<{ success: boolean; error?: string }> {
    if (this.viewState.actionInProgress.updating) {
      return { success: false, error: 'Update operation already in progress' };
    }

    try {
      this.viewState.actionInProgress.updating = true;
      
      const result = await containerApiAdapter.updateContainer(id, containerData);
      
      if (result.success) {
        await this.refreshContainers();
        this.viewState.showEditModal = false;
        this.viewState.editingContainer = null;
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update container'
      };
    } finally {
      this.viewState.actionInProgress.updating = false;
    }
  }

  async deleteContainer(id: number): Promise<{ success: boolean; error?: string }> {
    if (this.viewState.actionInProgress.deleting) {
      return { success: false, error: 'Delete operation already in progress' };
    }

    try {
      this.viewState.actionInProgress.deleting = true;
      
      const result = await containerApiAdapter.deleteContainer(id);
      
      if (result.success) {
        await this.refreshContainers();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete container'
      };
    } finally {
      this.viewState.actionInProgress.deleting = false;
    }
  }

  async shutdownContainer(id: number, reason?: string): Promise<{ success: boolean; error?: string }> {
    if (this.viewState.actionInProgress.shuttingDown) {
      return { success: false, error: 'Shutdown operation already in progress' };
    }

    try {
      this.viewState.actionInProgress.shuttingDown = true;
      
      const result = await containerApiAdapter.shutdownContainer(id, { reason });
      
      if (result.success) {
        await this.refreshContainers();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to shutdown container'
      };
    } finally {
      this.viewState.actionInProgress.shuttingDown = false;
    }
  }

  // Modal management
  showCreateModal(): void {
    this.viewState.showCreateModal = true;
  }

  hideCreateModal(): void {
    this.viewState.showCreateModal = false;
  }

  showEditModal(container: ContainerDomainModel): void {
    this.viewState.showEditModal = true;
    this.viewState.editingContainer = container;
  }

  hideEditModal(): void {
    this.viewState.showEditModal = false;
    this.viewState.editingContainer = null;
  }

  // Selection management
  selectContainer(id: number): void {
    this.viewState.selectedContainerId = id;
  }

  clearSelection(): void {
    this.viewState.selectedContainerId = null;
  }

  getSelectedContainer(): ContainerDomainModel | null {
    if (!this.viewState.selectedContainerId) return null;
    return this.domainModel.getContainerById(this.viewState.selectedContainerId);
  }

  // Auto-refresh management
  startAutoRefresh(): void {
    if (this.refreshInterval) {
      this.stopAutoRefresh();
    }

    this.refreshInterval = window.setInterval(() => {
      if (this.canRefresh) {
        this.refreshAll();
      }
    }, this.AUTO_REFRESH_INTERVAL);
  }

  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      window.clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  // Utility methods
  private isActionInProgress(): boolean {
    return Object.values(this.viewState.actionInProgress).some(inProgress => inProgress);
  }

  getSummaryStats(): {
    totalContainers: number;
    activeContainers: number;
    containersWithAlerts: number;
    criticalAlerts: number;
    averageYield: number;
    averageSpaceUtilization: number;
  } {
    return {
      totalContainers: this.domainModel.getTotalContainersCount(),
      activeContainers: this.domainModel.getActiveContainersCount(),
      containersWithAlerts: this.domainModel.getContainersWithAlertsCount(),
      criticalAlerts: this.domainModel.getCriticalAlertsCount(),
      averageYield: this.domainModel.getAverageYield(),
      averageSpaceUtilization: this.domainModel.getAverageSpaceUtilization()
    };
  }

  getStatusSummary() {
    return this.domainModel.getStatusSummary();
  }

  // Cleanup
  dispose(): void {
    this.stopAutoRefresh();
  }
}
