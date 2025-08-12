// Dashboard Domain Model
// Aggregates all dashboard state and business logic

import { ContainerDomainModel } from './container.model';
import { PerformanceMetricsDomainModel, TimeRangeType } from './performance.model';
import { FiltersDomainModel } from './filters.model';
import { PaginationDomainModel } from './pagination.model';

export interface DashboardState {
  containers: ContainerDomainModel[];
  performance: PerformanceMetricsDomainModel | null;
  filters: FiltersDomainModel;
  pagination: PaginationDomainModel;
  selectedTimeRange: TimeRangeType;
  selectedContainerType: 'all' | 'physical' | 'virtual';
  loading: {
    containers: boolean;
    performance: boolean;
    filterOptions: boolean;
  };
  errors: {
    containers: string | null;
    performance: string | null;
    filterOptions: string | null;
  };
}

export class DashboardDomainModel {
  constructor(
    public readonly state: DashboardState
  ) {}

  static createEmpty(): DashboardDomainModel {
    return new DashboardDomainModel({
      containers: [],
      performance: null,
      filters: FiltersDomainModel.createEmpty(),
      pagination: PaginationDomainModel.createDefault(),
      selectedTimeRange: 'week',
      selectedContainerType: 'all',
      loading: {
        containers: false,
        performance: false,
        filterOptions: false
      },
      errors: {
        containers: null,
        performance: null,
        filterOptions: null
      }
    });
  }

  // State update methods
  withContainers(containers: ContainerDomainModel[]): DashboardDomainModel {
    return new DashboardDomainModel({
      ...this.state,
      containers
    });
  }

  withPerformance(performance: PerformanceMetricsDomainModel): DashboardDomainModel {
    return new DashboardDomainModel({
      ...this.state,
      performance
    });
  }

  withFilters(filters: FiltersDomainModel): DashboardDomainModel {
    return new DashboardDomainModel({
      ...this.state,
      filters
    });
  }

  withPagination(pagination: PaginationDomainModel): DashboardDomainModel {
    return new DashboardDomainModel({
      ...this.state,
      pagination
    });
  }

  withTimeRange(selectedTimeRange: TimeRangeType): DashboardDomainModel {
    return new DashboardDomainModel({
      ...this.state,
      selectedTimeRange
    });
  }

  withContainerType(selectedContainerType: 'all' | 'physical' | 'virtual'): DashboardDomainModel {
    return new DashboardDomainModel({
      ...this.state,
      selectedContainerType
    });
  }

  withLoading(loadingUpdates: Partial<DashboardState['loading']>): DashboardDomainModel {
    return new DashboardDomainModel({
      ...this.state,
      loading: { ...this.state.loading, ...loadingUpdates }
    });
  }

  withError(errorUpdates: Partial<DashboardState['errors']>): DashboardDomainModel {
    return new DashboardDomainModel({
      ...this.state,
      errors: { ...this.state.errors, ...errorUpdates }
    });
  }

  clearError(errorType: keyof DashboardState['errors']): DashboardDomainModel {
    return new DashboardDomainModel({
      ...this.state,
      errors: { ...this.state.errors, [errorType]: null }
    });
  }

  // Business logic methods
  getFilteredContainers(): ContainerDomainModel[] {
    let filtered = this.state.containers;

    // Apply container type filter from performance card selection
    if (this.state.selectedContainerType !== 'all') {
      filtered = filtered.filter(container => 
        container.type === this.state.selectedContainerType
      );
    }

    return filtered;
  }

  getContainerById(id: number): ContainerDomainModel | null {
    return this.state.containers.find(container => container.id === id) || null;
  }

  getTotalContainersCount(): number {
    return this.state.containers.length;
  }

  getPhysicalContainersCount(): number {
    return this.state.containers.filter(c => c.isPhysical()).length;
  }

  getVirtualContainersCount(): number {
    return this.state.containers.filter(c => c.isVirtual()).length;
  }

  getActiveContainersCount(): number {
    return this.state.containers.filter(c => c.isActive()).length;
  }

  getContainersWithAlertsCount(): number {
    return this.state.containers.filter(c => c.hasActiveAlerts()).length;
  }

  getCriticalAlertsCount(): number {
    return this.state.containers.reduce((sum, c) => sum + c.getCriticalAlertsCount(), 0);
  }

  getAverageYield(): number {
    const containers = this.state.containers.filter(c => c.isActive());
    if (containers.length === 0) return 0;
    
    const totalYield = containers.reduce((sum, c) => sum + c.metrics.yieldKg, 0);
    return totalYield / containers.length;
  }

  getAverageSpaceUtilization(): number {
    const containers = this.state.containers.filter(c => c.isActive());
    if (containers.length === 0) return 0;
    
    const totalUtilization = containers.reduce((sum, c) => sum + c.metrics.spaceUtilizationPct, 0);
    return totalUtilization / containers.length;
  }

  getTopPerformingContainers(limit: number = 5): ContainerDomainModel[] {
    return [...this.state.containers]
      .filter(c => c.isActive())
      .sort((a, b) => b.getEfficiencyScore() - a.getEfficiencyScore())
      .slice(0, limit);
  }

  getContainersRequiringAttention(): ContainerDomainModel[] {
    return this.state.containers.filter(c => 
      c.hasActiveAlerts() || 
      c.status === 'maintenance' || 
      c.metrics.healthScore < 0.5
    );
  }

  hasAnyErrors(): boolean {
    return Object.values(this.state.errors).some(error => error !== null);
  }

  isAnyLoading(): boolean {
    return Object.values(this.state.loading).some(loading => loading);
  }

  canRefreshData(): boolean {
    return !this.isAnyLoading();
  }

  shouldShowEmptyState(): boolean {
    return (
      this.state.containers.length === 0 && 
      !this.state.loading.containers && 
      this.state.errors.containers === null
    );
  }

  shouldShowPerformanceCards(): boolean {
    return (
      this.state.performance !== null &&
      !this.state.loading.performance &&
      this.state.errors.performance === null
    );
  }

  // Helper methods for UI state
  getContainerTypeFilterLabel(): string {
    switch (this.state.selectedContainerType) {
      case 'physical':
        return 'Physical Containers';
      case 'virtual':
        return 'Virtual Containers';
      default:
        return 'All Containers';
    }
  }

  getTimeRangeLabel(): string {
    switch (this.state.selectedTimeRange) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'quarter':
        return 'This Quarter';
      case 'year':
        return 'This Year';
      default:
        return 'Current Period';
    }
  }

  getStatusSummary(): {
    healthy: number;
    warning: number;
    critical: number;
    inactive: number;
  } {
    return this.state.containers.reduce(
      (summary, container) => {
        if (!container.isActive()) {
          summary.inactive++;
        } else if (container.getCriticalAlertsCount() > 0) {
          summary.critical++;
        } else if (container.hasActiveAlerts() || container.metrics.healthScore < 0.7) {
          summary.warning++;
        } else {
          summary.healthy++;
        }
        return summary;
      },
      { healthy: 0, warning: 0, critical: 0, inactive: 0 }
    );
  }
}
