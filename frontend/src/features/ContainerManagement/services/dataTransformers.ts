import type { 
  Container, 
  ContainerTableRow, 
  PerformanceMetrics,
  MetricCardData,
  FilterChipData,
  TimeRangeSelectorData,
  ContainerFilters,
  FilterOptions,
  ChartDataPoint
} from '../types';

export class DataTransformers {
  /**
   * Transform container data for table display
   */
  static transformContainersForTable(containers: Container[]): ContainerTableRow[] {
    return containers.map(container => ({
      id: container.id.toString(),
      type: container.type,
      name: container.name,
      tenant: container.tenant_id.toString(), // Would typically be resolved to tenant name
      purpose: container.purpose,
      location: container.location ? `${container.location.city}, ${container.location.country}` : undefined,
      status: container.status,
      created: this.formatDate(container.created_at),
      modified: this.formatDate(container.updated_at),
      hasAlert: container.alerts.some(alert => alert.active)
    }));
  }

  /**
   * Transform performance metrics for metric cards
   */
  static transformMetricsForCards(metrics: PerformanceMetrics): {
    physicalCard: MetricCardData;
    virtualCard: MetricCardData;
  } {
    return {
      physicalCard: {
        title: 'Physical Containers',
        containerCount: metrics.physical.container_count,
        yieldData: {
          average: metrics.physical.yield.average,
          total: metrics.physical.yield.total,
          unit: 'kg',
          chartData: this.transformChartData(metrics.physical.yield.chart_data)
        },
        spaceUtilizationData: {
          average: metrics.physical.space_utilization.average,
          unit: '%',
          chartData: this.transformChartData(metrics.physical.space_utilization.chart_data)
        }
      },
      virtualCard: {
        title: 'Virtual Containers',
        containerCount: metrics.virtual.container_count,
        yieldData: {
          average: metrics.virtual.yield.average,
          total: metrics.virtual.yield.total,
          unit: 'kg',
          chartData: this.transformChartData(metrics.virtual.yield.chart_data)
        },
        spaceUtilizationData: {
          average: metrics.virtual.space_utilization.average,
          unit: '%',
          chartData: this.transformChartData(metrics.virtual.space_utilization.chart_data)
        }
      }
    };
  }

  /**
   * Transform chart data points for component consumption
   */
  private static transformChartData(chartData: ChartDataPoint[]): Array<{
    day: string;
    value: number;
    isCurrent?: boolean;
  }> {
    return chartData.map(point => ({
      day: this.formatDayLabel(point.date),
      value: point.value,
      isCurrent: point.is_current_period
    }));
  }

  /**
   * Transform filter options into filter chip data
   */
  static transformFilterOptions(
    filterOptions: FilterOptions, 
    currentFilters: ContainerFilters
  ): FilterChipData[] {
    return [
      {
        id: 'type',
        label: this.getFilterLabel('type', currentFilters.type),
        isActive: currentFilters.type !== 'all' && currentFilters.type !== undefined,
        options: [
          { id: 'all', label: 'All Types', value: 'all' },
          ...filterOptions.container_types.map(type => ({
            id: type,
            label: this.capitalize(type),
            value: type
          }))
        ],
        selectedOption: currentFilters.type ? {
          id: currentFilters.type,
          label: this.capitalize(currentFilters.type),
          value: currentFilters.type
        } : undefined
      },
      {
        id: 'tenant',
        label: this.getFilterLabel('tenant', currentFilters.tenant),
        isActive: currentFilters.tenant !== 'all' && currentFilters.tenant !== undefined,
        options: [
          { id: 'all', label: 'All Tenants', value: 'all' },
          ...filterOptions.tenants.map(tenant => ({
            id: tenant.id.toString(),
            label: tenant.name,
            value: tenant.id.toString()
          }))
        ],
        selectedOption: currentFilters.tenant && currentFilters.tenant !== 'all' ? {
          id: currentFilters.tenant.toString(),
          label: filterOptions.tenants.find(t => t.id === currentFilters.tenant)?.name || 'Unknown',
          value: currentFilters.tenant.toString()
        } : undefined
      },
      {
        id: 'purpose',
        label: this.getFilterLabel('purpose', currentFilters.purpose),
        isActive: currentFilters.purpose !== 'all' && currentFilters.purpose !== undefined,
        options: [
          { id: 'all', label: 'All Purposes', value: 'all' },
          ...filterOptions.purposes.map(purpose => ({
            id: purpose,
            label: this.capitalize(purpose),
            value: purpose
          }))
        ],
        selectedOption: currentFilters.purpose ? {
          id: currentFilters.purpose,
          label: this.capitalize(currentFilters.purpose),
          value: currentFilters.purpose
        } : undefined
      },
      {
        id: 'status',
        label: this.getFilterLabel('status', currentFilters.status),
        isActive: currentFilters.status !== 'all' && currentFilters.status !== undefined,
        options: [
          { id: 'all', label: 'All Statuses', value: 'all' },
          ...filterOptions.statuses.map(status => ({
            id: status,
            label: this.capitalize(status),
            value: status
          }))
        ],
        selectedOption: currentFilters.status ? {
          id: currentFilters.status,
          label: this.capitalize(currentFilters.status),
          value: currentFilters.status
        } : undefined
      }
    ];
  }

  /**
   * Get time range selector data
   */
  static getTimeRangeSelectorData(currentValue: 'week' | 'month' | 'quarter' | 'year'): TimeRangeSelectorData {
    return {
      options: [
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'quarter', label: 'Quarter' },
        { value: 'year', label: 'Year' }
      ],
      selectedValue: currentValue
    };
  }

  /**
   * Format date for display
   */
  private static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  /**
   * Format day label for charts
   */
  private static formatDayLabel(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  /**
   * Get display label for filter
   */
  private static getFilterLabel(filterType: string, value: unknown): string {
    if (!value || value === 'all') {
      return `All ${this.capitalize(filterType)}s`;
    }
    return this.capitalize(String(value));
  }

  /**
   * Capitalize first letter
   */
  private static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Transform container data for form editing
   */
  static transformContainerForForm(container: Container): any {
    return {
      name: container.name,
      tenant_id: container.tenant_id,
      type: container.type,
      purpose: container.purpose,
      location: container.location || { city: '', country: '', address: '' },
      notes: container.notes,
      shadow_service_enabled: container.settings.shadow_service_enabled,
      copied_environment_from: container.settings.copied_environment_from,
      robotics_simulation_enabled: container.settings.robotics_simulation_enabled,
      ecosystem_connected: container.settings.ecosystem_connected,
      ecosystem_settings: container.settings.ecosystem_settings,
      status: container.status,
      seed_type_ids: container.seed_types.map(seed => seed.id)
    };
  }

  /**
   * Calculate filter summary for display
   */
  static getFilterSummary(filters: ContainerFilters, filterOptions: FilterOptions): string {
    const activeFilters: string[] = [];

    if (filters.search) {
      activeFilters.push(`Search: "${filters.search}"`);
    }

    if (filters.type && filters.type !== 'all') {
      activeFilters.push(`Type: ${this.capitalize(filters.type)}`);
    }

    if (filters.tenant && filters.tenant !== 'all') {
      const tenantName = filterOptions.tenants.find(t => t.id === filters.tenant)?.name;
      activeFilters.push(`Tenant: ${tenantName || 'Unknown'}`);
    }

    if (filters.purpose && filters.purpose !== 'all') {
      activeFilters.push(`Purpose: ${this.capitalize(filters.purpose)}`);
    }

    if (filters.status && filters.status !== 'all') {
      activeFilters.push(`Status: ${this.capitalize(filters.status)}`);
    }

    if (filters.alerts) {
      activeFilters.push('Has Alerts: Yes');
    }

    return activeFilters.length > 0 
      ? activeFilters.join(', ')
      : 'No active filters';
  }
}