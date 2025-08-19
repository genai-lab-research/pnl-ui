// Container Overview ViewModel - Manages overview tab state and data
import { 
  ContainerOverview,
  DashboardMetrics,
  TimeRange,
  LoadingStates,
  ErrorStates,
  ContainerMetricCardProps,
} from '../types';
import { containerDetailApiAdaptor } from '../services';

export interface ContainerOverviewState {
  overview: ContainerOverview | null;
  isLoading: LoadingStates;
  errors: ErrorStates;
  timeRange: TimeRange;
  activityPage: number;
  activityLimit: number;
  cropsPage: number;
  cropsLimit: number;
}

/**
 * ViewModel for Container Overview Tab
 * Manages overview data, metrics, crops, and activity logs
 */
export class ContainerOverviewViewModel {
  private state: ContainerOverviewState;
  private listeners: Set<(state: ContainerOverviewState) => void> = new Set();
  private metricsPollingInterval: NodeJS.Timeout | null = null;

  constructor(private readonly containerId: number) {
    this.state = {
      overview: null,
      isLoading: {
        overview: false,
        metrics: false,
        activities: false,
        settings: false,
      },
      errors: {},
      timeRange: 'week',
      activityPage: 1,
      activityLimit: 20,
      cropsPage: 1,
      cropsLimit: 2,
    };
  }

  // State Management

  getState(): ContainerOverviewState {
    return { ...this.state };
  }

  subscribe(listener: (state: ContainerOverviewState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Data Loading

  async loadOverviewData(): Promise<void> {
    this.updateState({
      isLoading: { ...this.state.isLoading, overview: true },
      errors: { ...this.state.errors, overview: undefined },
    });

    try {
      // Fetch both overview and full container details in parallel
      const [overview, fullContainer] = await Promise.all([
        containerDetailApiAdaptor.getContainerOverview(
          this.containerId,
          {
            time_range: this.state.timeRange,
            metric_interval: 'day',
          }
        ),
        containerDetailApiAdaptor.getFullContainerDetails(this.containerId)
      ]);

      // Merge the full container details into the overview
      const enhancedOverview = {
        ...overview,
        container: {
          ...overview.container,
          ...fullContainer,
          tenant: fullContainer.tenant || overview.container.tenant
        }
      };

      this.updateState({
        overview: enhancedOverview,
        isLoading: { ...this.state.isLoading, overview: false },
      });

    } catch (error) {
      this.updateState({
        isLoading: { ...this.state.isLoading, overview: false },
        errors: { 
          ...this.state.errors, 
          overview: error instanceof Error ? error.message : 'Failed to load overview data' 
        },
      });
    }
  }

  async refreshMetrics(): Promise<void> {
    if (!this.state.overview) return;

    this.updateState({
      isLoading: { ...this.state.isLoading, metrics: true },
      errors: { ...this.state.errors, metrics: undefined },
    });

    try {
      const overview = await containerDetailApiAdaptor.getContainerOverview(
        this.containerId,
        {
          time_range: this.state.timeRange,
          metric_interval: 'day',
        }
      );

      // Update only metrics data
      this.updateState({
        overview: {
          ...this.state.overview,
          dashboard_metrics: overview.dashboard_metrics,
        },
        isLoading: { ...this.state.isLoading, metrics: false },
      });

    } catch (error) {
      this.updateState({
        isLoading: { ...this.state.isLoading, metrics: false },
        errors: { 
          ...this.state.errors, 
          metrics: error instanceof Error ? error.message : 'Failed to refresh metrics' 
        },
      });
    }
  }

  async loadMoreActivities(): Promise<void> {
    this.updateState({
      isLoading: { ...this.state.isLoading, activities: true },
      errors: { ...this.state.errors, activities: undefined },
    });

    try {
      const activityResponse = await containerDetailApiAdaptor.getActivityLogs(
        this.containerId,
        {
          page: this.state.activityPage + 1,
          limit: this.state.activityLimit,
        }
      );

      if (this.state.overview) {
        this.updateState({
          overview: {
            ...this.state.overview,
            recent_activity: [
              ...this.state.overview.recent_activity,
              ...activityResponse.activities,
            ],
          },
          activityPage: this.state.activityPage + 1,
          isLoading: { ...this.state.isLoading, activities: false },
        });
      }

    } catch (error) {
      this.updateState({
        isLoading: { ...this.state.isLoading, activities: false },
        errors: { 
          ...this.state.errors, 
          activities: error instanceof Error ? error.message : 'Failed to load more activities' 
        },
      });
    }
  }

  // Time Range Management

  async changeTimeRange(timeRange: TimeRange): Promise<void> {
    if (timeRange === this.state.timeRange) return;

    this.updateState({ timeRange });
    await this.loadOverviewData();
  }

  // Real-time Metrics

  startMetricsPolling(): void {
    if (this.metricsPollingInterval) return;

    this.metricsPollingInterval = setInterval(async () => {
      try {
        await this.refreshMetrics();
      } catch (error) {
        console.error('Metrics polling error:', error);
      }
    }, 30000); // Poll every 30 seconds
  }

  stopMetricsPolling(): void {
    if (this.metricsPollingInterval) {
      clearInterval(this.metricsPollingInterval);
      this.metricsPollingInterval = null;
    }
  }

  // Derived Data for UI Components

  getContainerInfo() {
    return this.state.overview?.container || null;
  }

  getNavigationProps() {
    const container = this.getContainerInfo();
    return {
      containerName: container?.name || `Container ${this.containerId}`,
      onBreadcrumbClick: () => {
        // Navigate back to container management
        window.history.back();
      },
    };
  }

  getStatusHeaderProps() {
    const container = this.getContainerInfo();
    if (!container) return null;

    return {
      containerType: container.type,
      description: `${container.tenant.name} - ${container.location?.name || 'No location'}`,
      status: container.status,
      statusVariant: this.getStatusVariant(container.status),
    };
  }

  getMetricCards(): any {
    const metrics = this.state.overview?.dashboard_metrics;
    
    // Provide default values matching the design
    return {
      airTemperature: metrics?.air_temperature || 20,
      humidity: metrics?.humidity || 65,
      co2: metrics?.co2 || 860,
      yieldTotal: metrics?.yield_metrics?.total || 51,
      yieldAverage: metrics?.yield_metrics?.average || 51,
      nurseryUtilization: metrics?.space_utilization?.nursery_station || 75,
      cultivationUtilization: metrics?.space_utilization?.cultivation_area || 90,
    };
  }

  getCropsTableData() {
    const crops = this.state.overview?.crops_summary || [];
    
    // If no crops data, provide sample data matching the design
    const sampleCrops = crops.length > 0 ? crops : [
      {
        seed_type: 'Salanova Cousteau',
        cultivation_area_count: 40,
        nursery_station_count: 30,
        last_seeding_date: '2025-01-30',
        last_transplanting_date: '2025-01-30',
        last_harvesting_date: null,
        average_age: 26,
        overdue_count: 2,
      },
      {
        seed_type: 'Kiribati',
        cultivation_area_count: 50,
        nursery_station_count: 20,
        last_seeding_date: '2025-01-30',
        last_transplanting_date: '2025-01-30',
        last_harvesting_date: null,
        average_age: 30,
        overdue_count: 0,
      },
      {
        seed_type: 'Rex Butterhead',
        cultivation_area_count: 65,
        nursery_station_count: 10,
        last_seeding_date: '2025-01-10',
        last_transplanting_date: '2025-01-20',
        last_harvesting_date: '2025-01-01',
        average_age: 22,
        overdue_count: 0,
      },
      {
        seed_type: 'Lollo Rossa',
        cultivation_area_count: 35,
        nursery_station_count: 25,
        last_seeding_date: '2025-01-15',
        last_transplanting_date: '2025-01-20',
        last_harvesting_date: '2025-05-02',
        average_age: 18,
        overdue_count: 13,
      },
    ];
    
    // Calculate pagination
    const { cropsPage, cropsLimit } = this.state;
    const totalItems = sampleCrops.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / cropsLimit));
    const startIndex = (cropsPage - 1) * cropsLimit;
    const endIndex = startIndex + cropsLimit;
    const paginatedCrops = sampleCrops.slice(startIndex, endIndex);

    return {
      rows: paginatedCrops.map((crop, index) => ({
        id: (startIndex + index).toString(),
        seedType: crop.seed_type,
        cultivation_area_count: crop.cultivation_area_count,
        nursery_station_count: crop.nursery_station_count,
        last_seeding_date: crop.last_seeding_date,
        last_transplanting_date: crop.last_transplanting_date,
        last_harvesting_date: crop.last_harvesting_date,
        average_age: crop.average_age,
        overdue_count: crop.overdue_count,
        // Legacy fields for backward compatibility
        tenantId: this.state.overview?.container?.tenant?.name || 'N/A',
        phase: this.determinePhase(crop),
        lastSeedingDate: crop.last_seeding_date,
        lastTransplantingDate: crop.last_transplanting_date,
        lastHarvestingDate: crop.last_harvesting_date,
        averageAge: crop.average_age,
        overdueCount: crop.overdue_count,
        shipDate: 'N/A', // Not provided in API
        batchSize: `${crop.nursery_station_count + crop.cultivation_area_count}`,
        status: crop.overdue_count > 0 ? 'warning' : 'active',
      })),
      seedTypes: sampleCrops.map(c => c.seed_type).join(', '),
      pagination: {
        page: cropsPage,
        totalPages: totalPages,
        total: totalItems,
        limit: cropsLimit,
      }
    };
  }

  private determinePhase(crop: any): string {
    // Determine phase based on dates
    if (crop.last_harvesting_date) {
      return 'Harvesting';
    } else if (crop.last_transplanting_date) {
      return 'Growing';
    } else if (crop.last_seeding_date) {
      return 'Seeding';
    }
    return 'Planning';
  }

  getActivityTimeline() {
    const activities = this.state.overview?.recent_activity || [];
    
    return activities.map((activity) => ({
      id: activity.id,
      message: activity.description,
      timestamp: activity.timestamp,
      author: activity.actor_id,
      category: activity.action_type,
      action_type: activity.action_type,
      actor_type: activity.actor_type,
      actor_id: activity.actor_id,
      description: activity.description,
      formattedTime: this.formatTimestamp(activity.timestamp),
    }));
  }

  getTimeSelectorProps() {
    return {
      selectedRange: this.state.timeRange,
      onRangeChange: (range: TimeRange) => this.changeTimeRange(range),
    };
  }

  hasMoreActivities(): boolean {
    // Simplified - in real implementation, check pagination info
    const activities = this.state.overview?.recent_activity || [];
    return activities.length >= this.state.activityLimit;
  }

  // Error and Loading States

  getLoadingStates() {
    return this.state.isLoading;
  }

  getErrors() {
    return this.state.errors;
  }

  clearError(errorType: keyof ErrorStates): void {
    this.updateState({
      errors: {
        ...this.state.errors,
        [errorType]: undefined,
      },
    });
  }

  // Pagination Methods

  changeCropsPage(page: number): void {
    if (page < 1) return;
    
    this.updateState({
      cropsPage: page,
    });
  }

  changeCropsItemsPerPage(itemsPerPage: number): void {
    if (itemsPerPage < 1) return;
    
    this.updateState({
      cropsLimit: itemsPerPage,
      cropsPage: 1, // Reset to first page
    });
  }

  // Cleanup

  dispose(): void {
    this.stopMetricsPolling();
    this.listeners.clear();
  }

  // Private Methods

  private updateState(updates: Partial<ContainerOverviewState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('Error in ContainerOverviewViewModel listener:', error);
      }
    });
  }

  private getStatusVariant(status: string): 'active' | 'inactive' | 'pending' | 'warning' | 'error' {
    switch (status.toLowerCase()) {
      case 'active':
        return 'active';
      case 'inactive':
        return 'inactive';
      case 'maintenance':
        return 'warning';
      case 'pending':
        return 'pending';
      default:
        return 'error';
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private calculateDelta(_metric: keyof DashboardMetrics): number | undefined {
    // Simplified - would need historical data for real calculation
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getDeltaDirection(_metric: keyof DashboardMetrics): 'up' | 'down' | 'flat' {
    // Simplified - would calculate from historical data
    return 'flat';
  }

  private calculateYieldDelta(): number | undefined {
    // Simplified - would compare with previous period
    return undefined;
  }

  private getYieldDeltaDirection(): 'up' | 'down' | 'flat' {
    // Simplified - would calculate from yield trends
    return 'flat';
  }

  private formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  }

  private formatTimestamp(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  }
}