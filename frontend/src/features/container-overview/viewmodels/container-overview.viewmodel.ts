// ViewModel for Container Overview page coordination
// Orchestrates data flow between models and UI components

import { ContainerOverviewModel, ContainerInfo } from '../models/container-overview.model';
import { TimeRange, MetricInterval } from '../models/dashboard-metrics.model';
import { containerOverviewApiAdapter } from '../services/container-overview-api.adapter';

export interface ContainerOverviewState {
  containerInfo: ContainerInfo | null;
  activeTab: 'overview' | 'environment' | 'inventory' | 'devices';
  isLoading: boolean;
  error: string | null;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canManage: boolean;
  };
  timeRange: TimeRange;
  metricInterval: MetricInterval;
}

export class ContainerOverviewViewModel {
  private model: ContainerOverviewModel;
  private onStateChange?: (state: ContainerOverviewState) => void;

  constructor(containerId: number) {
    this.model = new ContainerOverviewModel(containerId);
  }

  // State management
  public setStateChangeListener(callback: (state: ContainerOverviewState) => void): void {
    this.onStateChange = callback;
  }

  public getState(): ContainerOverviewState {
    return {
      containerInfo: this.model.containerInfo,
      activeTab: this.model.activeTab,
      isLoading: this.model.isLoading,
      error: this.model.error,
      permissions: {
        canView: true, // These would be set from API response
        canEdit: true,
        canManage: true
      },
      timeRange: 'week', // Default time range
      metricInterval: 'day' // Default interval
    };
  }

  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
  }

  // Core operations
  public async initialize(): Promise<void> {
    try {
      this.model.setLoading(true);
      this.model.setError(null);
      this.notifyStateChange();

      // Load container info and check permissions
      const [containerInfo, permissions] = await Promise.all([
        containerOverviewApiAdapter.getContainerInfo(this.model.containerId),
        containerOverviewApiAdapter.checkContainerPermissions(this.model.containerId)
      ]);

      this.model.setContainerInfo(containerInfo);
      this.model.setLoading(false);
      this.notifyStateChange();

    } catch (error) {
      this.model.setError(error instanceof Error ? error.message : 'Failed to load container');
      this.model.setLoading(false);
      this.notifyStateChange();
    }
  }

  public async switchTab(tab: 'overview' | 'environment' | 'inventory' | 'devices'): Promise<void> {
    this.model.setActiveTab(tab);
    this.notifyStateChange();

    // Navigate to the new tab URL
    const tabs = this.model.getTabs();
    const targetTab = tabs.find(t => t.key === tab);
    if (targetTab?.path) {
      // In a real app, this would use the router
      window.history.pushState({}, '', targetTab.path);
    }
  }

  public async refreshData(): Promise<void> {
    try {
      this.model.setLoading(true);
      this.notifyStateChange();

      const containerInfo = await containerOverviewApiAdapter.getContainerInfo(this.model.containerId);
      this.model.setContainerInfo(containerInfo);
      this.model.setLoading(false);
      this.notifyStateChange();

    } catch (error) {
      this.model.setError(error instanceof Error ? error.message : 'Failed to refresh data');
      this.model.setLoading(false);
      this.notifyStateChange();
    }
  }

  // UI data transformation methods
  public getBreadcrumbs() {
    return this.model.getBreadcrumbs();
  }

  public getTabs() {
    return this.model.getTabs();
  }

  public getContainerIconType(): string {
    return this.model.getContainerIconType();
  }

  public hasLocationInfo(): boolean {
    return this.model.hasLocationInfo();
  }

  public getContainerDisplayName(): string {
    return this.model.containerInfo?.name || 'Loading...';
  }

  public getContainerType(): string {
    if (!this.model.containerInfo) return '';
    return this.model.containerInfo.type === 'physical' ? 'Physical Container' : 'Virtual Container';
  }

  public getTenantName(): string {
    return this.model.containerInfo?.tenant.name || '';
  }

  public getLocationString(): string {
    const location = this.model.containerInfo?.location;
    if (!location) return '';
    
    return `${location.city}, ${location.country}`;
  }

  public getStatusColor(): 'success' | 'warning' | 'error' | 'info' {
    const status = this.model.containerInfo?.status;
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'info';
    }
  }

  public getStatusLabel(): string {
    const status = this.model.containerInfo?.status;
    switch (status) {
      case 'active':
        return 'Active';
      case 'maintenance':
        return 'Maintenance';
      case 'inactive':
        return 'Inactive';
      case 'created':
        return 'Created';
      default:
        return 'Unknown';
    }
  }

  // Navigation helpers
  public navigateToDashboard(): void {
    // In a real app, this would use the router
    window.history.pushState({}, '', '/dashboard');
  }

  public navigateToTab(tabKey: string): void {
    const tab = this.model.getTabs().find(t => t.key === tabKey);
    if (tab) {
      this.switchTab(tab.key);
    }
  }

  // URL state management
  public getPageUrl(): string {
    const activeTab = this.model.activeTab;
    return `/containers/${this.model.containerId}/${activeTab}`;
  }

  public setActiveTabFromUrl(tabKey: string): void {
    const validTabs = ['overview', 'environment', 'inventory', 'devices'] as const;
    if (validTabs.includes(tabKey as any)) {
      this.model.setActiveTab(tabKey as any);
      this.notifyStateChange();
    }
  }

  // Error handling
  public clearError(): void {
    this.model.setError(null);
    this.notifyStateChange();
  }

  public hasError(): boolean {
    return Boolean(this.model.error);
  }

  public getErrorMessage(): string | null {
    return this.model.error;
  }

  // Loading state
  public isLoading(): boolean {
    return this.model.isLoading;
  }

  // Permissions
  public canViewContainer(): boolean {
    return Boolean(this.model.containerInfo); // Simple check - has data
  }

  public canEditContainer(): boolean {
    // In a real app, this would check user permissions
    return this.canViewContainer();
  }

  public canManageContainer(): boolean {
    // In a real app, this would check admin permissions
    return this.canViewContainer();
  }

  // Cleanup
  public destroy(): void {
    this.onStateChange = undefined;
  }
}
