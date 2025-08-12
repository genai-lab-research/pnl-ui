// Filters Domain Model
// Business logic for filtering and search functionality

import { ContainerFilterCriteria, FilterOptions } from '../../../types/containers';

export interface FilterState {
  search: string;
  type: 'physical' | 'virtual' | 'all';
  tenant: number | null;
  purpose: 'development' | 'research' | 'production' | 'all';
  status: 'created' | 'active' | 'maintenance' | 'inactive' | 'all';
  hasAlerts: boolean | null;
}

export class FiltersDomainModel {
  constructor(
    public readonly state: FilterState,
    public readonly availableOptions: FilterOptions
  ) {}

  static createEmpty(): FiltersDomainModel {
    return new FiltersDomainModel(
      {
        search: '',
        type: 'all',
        tenant: null,
        purpose: 'all',
        status: 'all',
        hasAlerts: null
      },
      {
        tenants: [],
        purposes: [],
        statuses: [],
        container_types: []
      }
    );
  }

  static fromOptions(options: FilterOptions): FiltersDomainModel {
    return new FiltersDomainModel(
      {
        search: '',
        type: 'all',
        tenant: null,
        purpose: 'all',
        status: 'all',
        hasAlerts: null
      },
      options
    );
  }

  // Business logic methods
  hasActiveFilters(): boolean {
    return (
      this.state.search.trim() !== '' ||
      this.state.type !== 'all' ||
      this.state.tenant !== null ||
      this.state.purpose !== 'all' ||
      this.state.status !== 'all' ||
      this.state.hasAlerts !== null
    );
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.state.search.trim() !== '') count++;
    if (this.state.type !== 'all') count++;
    if (this.state.tenant !== null) count++;
    if (this.state.purpose !== 'all') count++;
    if (this.state.status !== 'all') count++;
    if (this.state.hasAlerts !== null) count++;
    return count;
  }

  getActiveFiltersLabels(): string[] {
    const labels: string[] = [];
    
    if (this.state.search.trim() !== '') {
      labels.push(`Search: "${this.state.search.trim()}"`);
    }
    
    if (this.state.type !== 'all') {
      labels.push(`Type: ${this.state.type}`);
    }
    
    if (this.state.tenant !== null) {
      const tenant = this.availableOptions.tenants.find(t => t.id === this.state.tenant);
      labels.push(`Tenant: ${tenant?.name || 'Unknown'}`);
    }
    
    if (this.state.purpose !== 'all') {
      labels.push(`Purpose: ${this.state.purpose}`);
    }
    
    if (this.state.status !== 'all') {
      labels.push(`Status: ${this.state.status}`);
    }
    
    if (this.state.hasAlerts === true) {
      labels.push('Has Alerts');
    } else if (this.state.hasAlerts === false) {
      labels.push('No Alerts');
    }
    
    return labels;
  }

  withSearch(search: string): FiltersDomainModel {
    return new FiltersDomainModel(
      { ...this.state, search },
      this.availableOptions
    );
  }

  withType(type: 'physical' | 'virtual' | 'all'): FiltersDomainModel {
    return new FiltersDomainModel(
      { ...this.state, type },
      this.availableOptions
    );
  }

  withTenant(tenant: number | null): FiltersDomainModel {
    return new FiltersDomainModel(
      { ...this.state, tenant },
      this.availableOptions
    );
  }

  withPurpose(purpose: 'development' | 'research' | 'production' | 'all'): FiltersDomainModel {
    return new FiltersDomainModel(
      { ...this.state, purpose },
      this.availableOptions
    );
  }

  withStatus(status: 'created' | 'active' | 'maintenance' | 'inactive' | 'all'): FiltersDomainModel {
    return new FiltersDomainModel(
      { ...this.state, status },
      this.availableOptions
    );
  }

  withAlerts(hasAlerts: boolean | null): FiltersDomainModel {
    return new FiltersDomainModel(
      { ...this.state, hasAlerts },
      this.availableOptions
    );
  }

  clearAll(): FiltersDomainModel {
    return new FiltersDomainModel(
      {
        search: '',
        type: 'all',
        tenant: null,
        purpose: 'all',
        status: 'all',
        hasAlerts: null
      },
      this.availableOptions
    );
  }

  toApiFilters(page: number = 1, limit: number = 10, sort: string = 'name', order: 'asc' | 'desc' = 'asc'): ContainerFilterCriteria {
    const filters: ContainerFilterCriteria = {
      page,
      limit,
      sort,
      order
    };

    if (this.state.search.trim() !== '') {
      filters.search = this.state.search.trim();
    }

    if (this.state.type !== 'all') {
      filters.type = this.state.type;
    }

    if (this.state.tenant !== null) {
      filters.tenant = this.state.tenant;
    }

    if (this.state.purpose !== 'all') {
      filters.purpose = this.state.purpose;
    }

    if (this.state.status !== 'all') {
      filters.status = this.state.status;
    }

    if (this.state.hasAlerts !== null) {
      filters.alerts = this.state.hasAlerts;
    }

    return filters;
  }

  getTenantName(tenantId: number): string {
    const tenant = this.availableOptions.tenants.find(t => t.id === tenantId);
    return tenant?.name || 'Unknown Tenant';
  }

  isValidTenant(tenantId: number): boolean {
    return this.availableOptions.tenants.some(t => t.id === tenantId);
  }

  isValidPurpose(purpose: string): boolean {
    return this.availableOptions.purposes.includes(purpose) || purpose === 'all';
  }

  isValidStatus(status: string): boolean {
    return this.availableOptions.statuses.includes(status) || status === 'all';
  }

  isValidType(type: string): boolean {
    return this.availableOptions.container_types.includes(type) || type === 'all';
  }
}
