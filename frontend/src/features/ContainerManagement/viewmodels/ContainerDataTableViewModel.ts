import type { 
  Container,
  CreateContainerRequest,
  UpdateContainerRequest
} from '../types';

export class ContainerDataTableViewModel {

  // Business logic methods
  validateContainerData(data: CreateContainerRequest | UpdateContainerRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Container name must be at least 2 characters long');
    }

    if (!data.tenant_id || data.tenant_id <= 0) {
      errors.push('Valid tenant must be selected');
    }

    if (!data.type || !['physical', 'virtual'].includes(data.type)) {
      errors.push('Container type must be physical or virtual');
    }

    if (!data.purpose || !['development', 'research', 'production'].includes(data.purpose)) {
      errors.push('Valid purpose must be selected');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  canShutdownContainer(container: Container): {
    canShutdown: boolean;
    reason?: string;
  } {
    if (container.status === 'inactive') {
      return {
        canShutdown: false,
        reason: 'Container is already inactive'
      };
    }

    if (container.status === 'maintenance') {
      return {
        canShutdown: false,
        reason: 'Container is currently in maintenance mode'
      };
    }

    return { canShutdown: true };
  }

  calculateTableStats(containers: Container[]): {
    totalContainers: number;
    physicalCount: number;
    virtualCount: number;
    activeCount: number;
    alertCount: number;
  } {
    return {
      totalContainers: containers.length,
      physicalCount: containers.filter(c => c.type === 'physical').length,
      virtualCount: containers.filter(c => c.type === 'virtual').length,
      activeCount: containers.filter(c => c.status === 'active').length,
      alertCount: containers.filter(c => c.alerts && c.alerts.length > 0).length
    };
  }

  getRowActionAvailability(container: Container): {
    canView: boolean;
    canEdit: boolean;
    canDuplicate: boolean;
    canShutdown: boolean;
    canDelete: boolean;
  } {
    const isActive = container.status === 'active';
    const hasAlerts = container.alerts && container.alerts.length > 0;

    return {
      canView: true,
      canEdit: container.status !== 'maintenance',
      canDuplicate: !hasAlerts,
      canShutdown: isActive,
      canDelete: container.status === 'created' || container.status === 'inactive'
    };
  }
}