// Domain models for Container Overview page
// Encapsulates business logic and data structures

export interface ContainerInfo {
  id: number;
  name: string;
  type: string; // Allow any string to match API response
  tenant: {
    id: number;
    name: string;
  };
  location: Record<string, any>; // Allow any JSON object to match API response
  status: string; // Allow any string to match API response
}

export interface TabType {
  key: 'overview' | 'environment' | 'inventory' | 'devices';
  label: string;
  path: string;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive: boolean;
}



// Container overview page state
export class ContainerOverviewModel {
  public readonly containerId: number;
  public containerInfo: ContainerInfo | null = null;
  public activeTab: TabType['key'] = 'overview';
  public isLoading = false;
  public error: string | null = null;

  constructor(containerId: number) {
    this.containerId = containerId;
  }

  public setContainerInfo(info: ContainerInfo): void {
    this.containerInfo = info;
  }

  public setActiveTab(tab: TabType['key']): void {
    this.activeTab = tab;
  }

  public setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  public setError(error: string | null): void {
    this.error = error;
  }

  public getBreadcrumbs(): BreadcrumbItem[] {
    return [
      { label: 'Container Management Dashboard', path: '/dashboard', isActive: false },
      { label: this.containerInfo?.name || 'Container', isActive: true }
    ];
  }

  public getTabs(): TabType[] {
    return [
      { key: 'overview', label: 'Overview', path: `/containers/${this.containerId}/overview` },
      { key: 'environment', label: 'Environment & Recipes', path: `/containers/${this.containerId}/environment` },
      { key: 'inventory', label: 'Inventory', path: `/containers/${this.containerId}/inventory` },
      { key: 'devices', label: 'Devices', path: `/containers/${this.containerId}/devices` }
    ];
  }

  public getContainerIconType(): string {
    return this.containerInfo?.type === 'physical' ? 'physical-container' : 'virtual-container';
  }

  public hasLocationInfo(): boolean {
    return this.containerInfo?.type === 'physical' && Boolean(this.containerInfo.location);
  }
}
