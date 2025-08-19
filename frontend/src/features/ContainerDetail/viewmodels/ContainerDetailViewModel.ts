// Container Detail ViewModel - Main orchestration and state management
import { 
  ContainerDetailState,
  ContainerDetailData,
  ContainerDetailError,
  TimeRangeValue,
  ContainerDetailPermissions,
  CONTAINER_TABS,
} from '../types';
import { containerDetailService } from '../services';
import { transformMetricsToDisplay, transformMetricsToCardModels } from '../services/dataTransformers';

/**
 * Main ViewModel for Container Detail page
 * Manages overall state, navigation, and coordination between child ViewModels
 */
export class ContainerDetailViewModel {
  private state: ContainerDetailState;
  private listeners: Set<(state: ContainerDetailState) => void> = new Set();
  private realTimeCleanup: (() => void) | null = null;

  constructor(containerId: number) {
    this.state = {
      containerId,
      activeTab: 'overview',
      timeRange: 'week',
      data: null,
      isLoading: false,
      error: null,
      permissions: {
        canView: false,
        canEdit: false,
        canManageSettings: false,
        canViewMetrics: false,
        canViewActivity: false,
        canUpdateEnvironment: false,
      },
    };
  }

  // State Management

  /**
   * Get current state
   */
  getState(): ContainerDetailState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: ContainerDetailState) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Initialize the container detail view
   */
  async initialize(): Promise<void> {
    this.updateState({ isLoading: true, error: null });

    try {
      const { data, permissions } = await containerDetailService.initializeContainer(
        this.state.containerId,
        this.state.timeRange
      );

      this.updateState({
        data,
        permissions,
        isLoading: false,
      });

      // Start real-time monitoring if user has permission
      if (permissions.canViewMetrics) {
        this.startRealTimeMonitoring();
      }

    } catch (error) {
      this.updateState({
        isLoading: false,
        error: error as ContainerDetailError,
      });
    }
  }

  /**
   * Change active tab
   */
  setActiveTab(tab: string): void {
    if (CONTAINER_TABS.some(t => t.value === tab)) {
      this.updateState({ activeTab: tab });
    }
  }

  /**
   * Change time range filter
   */
  async setTimeRange(timeRange: TimeRangeValue): Promise<void> {
    if (timeRange === this.state.timeRange) return;

    this.updateState({ timeRange, isLoading: true });

    try {
      const data = await containerDetailService.refreshContainerData(
        this.state.containerId,
        timeRange
      );

      this.updateState({
        data,
        isLoading: false,
      });

    } catch (error) {
      this.updateState({
        isLoading: false,
        error: error as ContainerDetailError,
      });
    }
  }

  /**
   * Refresh container data
   */
  async refresh(): Promise<void> {
    this.updateState({ isLoading: true, error: null });

    try {
      const data = await containerDetailService.refreshContainerData(
        this.state.containerId,
        this.state.timeRange
      );

      this.updateState({
        data,
        isLoading: false,
      });

    } catch (error) {
      this.updateState({
        isLoading: false,
        error: error as ContainerDetailError,
      });
    }
  }

  /**
   * Clear current error
   */
  clearError(): void {
    this.updateState({ error: null });
  }

  /**
   * Retry failed operation
   */
  async retry(): Promise<void> {
    if (!this.state.error?.retryable) return;
    
    this.clearError();
    await this.refresh();
  }

  // Derived Data Getters

  /**
   * Get container basic information
   */
  getContainerInfo() {
    return this.state.data?.container || null;
  }

  /**
   * Get formatted metrics for display
   */
  getMetricsDisplay() {
    if (!this.state.data?.dashboard) return null;
    return transformMetricsToDisplay(this.state.data.dashboard);
  }

  /**
   * Get metric cards for KPI display
   */
  getMetricCards() {
    const metricsDisplay = this.getMetricsDisplay();
    if (!metricsDisplay) return [];
    return transformMetricsToCardModels(metricsDisplay);
  }

  /**
   * Get navigation model for breadcrumb
   */
  getNavigationModel() {
    const container = this.getContainerInfo();
    return {
      containerId: this.state.containerId,
      containerName: container?.name || `Container ${this.state.containerId}`,
      showBreadcrumb: true,
      onNavigateBack: () => {
        // TODO: Navigate back to container management
        window.history.back();
      },
    };
  }

  /**
   * Get header model for status display
   */
  getHeaderModel() {
    const container = this.getContainerInfo();
    if (!container) return null;

    return {
      containerInfo: {
        name: container.name,
        type: container.type,
        status: container.status,
        tenant: container.tenant,
        location: container.location,
      },
      iconName: container.type === 'physical' ? 'shipping-container' : 'cloud-container',
      statusVariant: this.getStatusVariant(container.status),
    };
  }

  /**
   * Get tab navigation model
   */
  getTabNavigationModel() {
    return {
      active: this.state.activeTab,
      tabs: CONTAINER_TABS.map(tab => ({
        ...tab,
        disabled: !this.hasTabPermission(tab.value),
      })),
      onChange: (tab: string) => this.setActiveTab(tab),
    };
  }

  /**
   * Get time range selector model
   */
  getTimeRangeSelectorModel() {
    return {
      selectedValue: this.state.timeRange,
      options: [
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
        { label: 'Quarter', value: 'quarter' },
        { label: 'Year', value: 'year' },
      ],
      onChange: (value: string) => this.setTimeRange(value as TimeRangeValue),
    };
  }

  /**
   * Get loading state
   */
  getLoadingState() {
    return {
      isLoading: this.state.isLoading,
      loadingMessage: this.state.isLoading ? 'Loading container data...' : undefined,
    };
  }

  /**
   * Get error state
   */
  getErrorState() {
    return {
      isError: !!this.state.error,
      errorMessage: this.state.error?.message || '',
      onRetry: this.state.error?.retryable ? () => this.retry() : undefined,
    };
  }

  /**
   * Check if should show real-time indicator
   */
  shouldShowRealTimeIndicator(): boolean {
    return !!this.realTimeCleanup && this.state.permissions.canViewMetrics;
  }

  /**
   * Get data freshness indicator
   */
  getDataFreshness(): { 
    lastUpdated: string; 
    isStale: boolean; 
    needsRefresh: boolean; 
  } {
    if (!this.state.data?.lastUpdated) {
      return {
        lastUpdated: '',
        isStale: true,
        needsRefresh: true,
      };
    }

    const lastUpdate = new Date(this.state.data.lastUpdated);
    const now = new Date();
    const ageMs = now.getTime() - lastUpdate.getTime();
    const ageMinutes = ageMs / (1000 * 60);

    return {
      lastUpdated: lastUpdate.toLocaleTimeString(),
      isStale: ageMinutes > 5,
      needsRefresh: ageMinutes > 10,
    };
  }

  // Cleanup

  /**
   * Cleanup resources when component unmounts
   */
  dispose(): void {
    // Stop real-time monitoring
    if (this.realTimeCleanup) {
      this.realTimeCleanup();
      this.realTimeCleanup = null;
    }

    // Clean up service resources
    containerDetailService.cleanup(this.state.containerId);

    // Clear listeners
    this.listeners.clear();
  }

  // Private Methods

  private updateState(updates: Partial<ContainerDetailState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('Error in ContainerDetailViewModel listener:', error);
      }
    });
  }

  private startRealTimeMonitoring(): void {
    this.realTimeCleanup = containerDetailService.startRealTimeMonitoring(
      this.state.containerId,
      (metrics) => {
        // Update metrics in current data
        if (this.state.data) {
          // TODO: Update dashboard metrics with new data
          console.log('Received real-time metrics:', metrics);
        }
      },
      (error) => {
        console.error('Real-time metrics error:', error);
        // Could update state with error, but don't want to be too noisy
      }
    );
  }

  private getStatusVariant(status: string): 'active' | 'inactive' | 'maintenance' | 'error' {
    switch (status) {
      case 'active':
        return 'active';
      case 'maintenance':
        return 'maintenance';
      case 'inactive':
        return 'inactive';
      default:
        return 'error';
    }
  }

  private hasTabPermission(tab: string): boolean {
    switch (tab) {
      case 'overview':
        return this.state.permissions.canView;
      case 'environment':
        return this.state.permissions.canViewMetrics;
      case 'inventory':
        return this.state.permissions.canView;
      case 'devices':
        return this.state.permissions.canView;
      default:
        return false;
    }
  }
}
