// Container Header ViewModel - Manages header display and navigation
import { ContainerHeaderModel, ContainerNavigationModel } from '../types';
import { ContainerInfo } from '../../../api/containerApiService';

/**
 * ViewModel for container header and navigation
 */
export class ContainerHeaderViewModel {
  private containerInfo: ContainerInfo | null = null;
  private listeners: Set<() => void> = new Set();

  constructor(containerInfo?: ContainerInfo) {
    if (containerInfo) {
      this.containerInfo = containerInfo;
    }
  }

  /**
   * Update container information
   */
  updateContainerInfo(containerInfo: ContainerInfo): void {
    this.containerInfo = containerInfo;
    this.notifyListeners();
  }

  /**
   * Subscribe to changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Getters for UI Components

  /**
   * Get navigation model for breadcrumb
   */
  getNavigationModel(): ContainerNavigationModel | null {
    if (!this.containerInfo) return null;

    return {
      containerId: this.containerInfo.id,
      containerName: this.containerInfo.name,
      showBreadcrumb: true,
      onNavigateBack: () => {
        // Navigate back to container management dashboard
        window.history.back(); // TODO: Use proper routing
      },
    };
  }

  /**
   * Get header model for status display
   */
  getHeaderModel(): ContainerHeaderModel | null {
    if (!this.containerInfo) return null;

    return {
      containerInfo: {
        name: this.containerInfo.name,
        type: this.containerInfo.type,
        status: this.containerInfo.status,
        tenant: this.containerInfo.tenant,
        location: this.containerInfo.location,
      },
      iconName: this.getContainerIcon(this.containerInfo.type),
      statusVariant: this.getStatusVariant(this.containerInfo.status),
    };
  }

  /**
   * Get container title for page display
   */
  getContainerTitle(): string {
    if (!this.containerInfo) return 'Container Detail';
    return this.containerInfo.name;
  }

  /**
   * Get container subtitle for page display
   */
  getContainerSubtitle(): string {
    if (!this.containerInfo) return '';
    
    const parts = [
      this.formatContainerType(this.containerInfo.type),
      this.containerInfo.tenant.name,
      this.formatLocation(this.containerInfo.location),
    ].filter(Boolean);

    return parts.join(' | ');
  }

  /**
   * Get status badge model
   */
  getStatusBadge() {
    if (!this.containerInfo) return null;

    return {
      text: this.formatStatus(this.containerInfo.status),
      variant: this.getStatusVariant(this.containerInfo.status),
    };
  }

  /**
   * Get container metadata for display
   */
  getContainerMetadata(): Array<{
    label: string;
    value: string;
    icon?: string;
  }> {
    if (!this.containerInfo) return [];

    const metadata = [
      {
        label: 'Container ID',
        value: this.containerInfo.id.toString(),
        icon: '🏷️',
      },
      {
        label: 'Type',
        value: this.formatContainerType(this.containerInfo.type),
        icon: this.getContainerIcon(this.containerInfo.type),
      },
      {
        label: 'Tenant',
        value: this.containerInfo.tenant.name,
        icon: '🏢',
      },
    ];

    // Add location if it exists and is meaningful
    const locationStr = this.formatLocation(this.containerInfo.location);
    if (locationStr && locationStr !== 'Not specified') {
      metadata.push({
        label: 'Location',
        value: locationStr,
        icon: '📍',
      });
    }

    return metadata;
  }

  /**
   * Check if container data is available
   */
  hasContainerData(): boolean {
    return this.containerInfo !== null;
  }

  /**
   * Get loading state for header
   */
  isLoading(): boolean {
    return this.containerInfo === null;
  }

  // Private Methods

  private getContainerIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'physical':
        return '🚢'; // Shipping container
      case 'virtual':
        return '☁️'; // Cloud
      default:
        return '📦'; // Generic container
    }
  }

  private getStatusVariant(status: string): 'active' | 'inactive' | 'maintenance' | 'error' {
    switch (status.toLowerCase()) {
      case 'active':
        return 'active';
      case 'maintenance':
        return 'maintenance';
      case 'inactive':
      case 'created':
        return 'inactive';
      default:
        return 'error';
    }
  }

  private formatContainerType(type: string): string {
    switch (type.toLowerCase()) {
      case 'physical':
        return 'Physical Container';
      case 'virtual':
        return 'Virtual Container';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }

  private formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  private formatLocation(location: Record<string, any> | undefined): string {
    if (!location || Object.keys(location).length === 0) {
      return '';
    }

    // Try to build a meaningful location string
    if (location.city && location.country) {
      return `${location.city}, ${location.country}`;
    }

    if (location.address) {
      return location.address;
    }

    if (location.facility) {
      return location.facility;
    }

    // If we have location data but can't format it nicely, show a generic label
    return 'Custom Location';
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in ContainerHeaderViewModel listener:', error);
      }
    });
  }
}
