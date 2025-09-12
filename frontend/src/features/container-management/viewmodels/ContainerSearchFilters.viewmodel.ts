import type { 
  ContainerFilters
} from '../types';

export class ContainerSearchFiltersViewModel {
  private filters: ContainerFilters = {
    search: '',
    type: 'all',
    tenant: 'all', 
    purpose: 'all',
    status: 'all',
    alerts: false
  };


  // Business logic methods
  validateFilters(filters: ContainerFilters): boolean {
    return true; // Basic validation, can be extended
  }

  shouldTriggerSearch(searchValue: string): boolean {
    return searchValue.length >= 2 || searchValue.length === 0;
  }

  getInitialFilters(): ContainerFilters {
    return { ...this.filters };
  }

  getFilterLabel(filterType: keyof ContainerFilters, value: string): string {
    switch (filterType) {
      case 'type':
        return value === 'all' ? 'All Types' : value.charAt(0).toUpperCase() + value.slice(1);
      case 'tenant':
        return value === 'all' ? 'All Tenants' : value;
      case 'purpose':
        return value === 'all' ? 'All Purposes' : value;
      case 'status':
        return value === 'all' ? 'All Statuses' : value;
      default:
        return value;
    }
  }
}