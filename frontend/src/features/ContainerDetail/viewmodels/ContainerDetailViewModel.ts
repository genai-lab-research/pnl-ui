/**
 * Container Detail ViewModel
 * Manages state and business logic for the Container Detail page
 */

import { makeAutoObservable, runInAction } from 'mobx';
import { containerDetailService } from '../services/containerDetailService';
import type {
  ContainerDetailData,
  ContainerDetailPageState,
  ContainerDetailLoadingState,
  ContainerDetailError,
  TimePeriod,
  MetricInterval,
  ActivityLogEntry,
  ContainerSettings,
  EnvironmentLinks,
  ContainerDetailTab,
} from '../types/container-detail';
import type { DashboardSummary, MetricSnapshot } from '../types/metrics';

export class ContainerDetailViewModel {
  // Container data
  containerData: ContainerDetailData | null = null;
  dashboardSummary: DashboardSummary | null = null;
  metricSnapshots: MetricSnapshot[] = [];
  activities: ActivityLogEntry[] = [];
  environmentLinks: EnvironmentLinks | null = null;

  // Page state
  pageState: ContainerDetailPageState = {
    activeTab: 'overview',
    selectedTimePeriod: 'week',
    metricInterval: 'day',
    isSettingsEditMode: false,
    activityPage: 1,
    isLoadingActivities: false,
    hasMoreActivities: true,
  };

  // Loading states
  loadingState: ContainerDetailLoadingState = {
    container: false,
    metrics: false,
    crops: false,
    activities: false,
    settings: false,
  };

  // Error state
  error: ContainerDetailError | null = null;

  // Polling
  private metricsPollingInterval: ReturnType<typeof setInterval> | null = null;
  private readonly METRICS_POLLING_INTERVAL = 30000; // 30 seconds

  constructor(private containerId: number) {
    makeAutoObservable(this);
  }

  // Getters for computed values
  get isLoading(): boolean {
    return Object.values(this.loadingState).some(loading => loading);
  }

  get hasError(): boolean {
    return this.error !== null;
  }

  get currentMetrics() {
    return this.containerData?.dashboardMetrics || this.dashboardSummary?.currentMetrics;
  }

  get cropsSummary() {
    return this.containerData?.cropsSummary || [];
  }

  get recentActivity() {
    return this.containerData?.recentActivity || [];
  }

  get allActivities() {
    // Combine recent activities with paginated activities
    const recentIds = new Set(this.recentActivity.map(a => a.id));
    const paginatedActivities = this.activities.filter(a => !recentIds.has(a.id));
    return [...this.recentActivity, ...paginatedActivities];
  }

  // Actions
  async loadContainerData(): Promise<void> {
    runInAction(() => {
      this.loadingState.container = true;
      this.error = null;
    });

    try {
      const data = await containerDetailService.getContainerOverview(
        this.containerId,
        this.pageState.selectedTimePeriod,
        this.pageState.metricInterval
      );

      runInAction(() => {
        this.containerData = data;
        this.loadingState.container = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = {
          code: 'LOAD_ERROR',
          message: 'Failed to load container data',
        };
        this.loadingState.container = false;
      });
    }
  }

  async loadDashboardSummary(): Promise<void> {
    try {
      const summary = await containerDetailService.getDashboardSummary(this.containerId);
      runInAction(() => {
        this.dashboardSummary = summary;
      });
    } catch (error) {
      console.error('Failed to load dashboard summary:', error);
    }
  }

  async loadMetricSnapshots(): Promise<void> {
    runInAction(() => {
      this.loadingState.metrics = true;
    });

    try {
      const endDate = new Date();
      const startDate = new Date();
      
      // Calculate start date based on selected period
      switch (this.pageState.selectedTimePeriod) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      const snapshots = await containerDetailService.getMetricSnapshots(
        this.containerId,
        startDate,
        endDate,
        this.pageState.metricInterval
      );

      runInAction(() => {
        this.metricSnapshots = snapshots;
        this.loadingState.metrics = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = {
          code: 'METRICS_ERROR',
          message: 'Failed to load metrics',
        };
        this.loadingState.metrics = false;
      });
    }
  }

  async loadMoreActivities(): Promise<void> {
    if (!this.pageState.hasMoreActivities || this.pageState.isLoadingActivities) {
      return;
    }

    runInAction(() => {
      this.pageState.isLoadingActivities = true;
    });

    try {
      const { activities, hasMore } = await containerDetailService.getActivityLogs(
        this.containerId,
        this.pageState.activityPage,
        20
      );

      runInAction(() => {
        this.activities = [...this.activities, ...activities];
        this.pageState.hasMoreActivities = hasMore;
        this.pageState.activityPage += 1;
        this.pageState.isLoadingActivities = false;
      });
    } catch (error) {
      runInAction(() => {
        this.pageState.isLoadingActivities = false;
      });
    }
  }

  async updateContainerSettings(settings: Partial<ContainerSettings>): Promise<void> {
    runInAction(() => {
      this.loadingState.settings = true;
      this.error = null;
    });

    try {
      const result = await containerDetailService.updateContainerSettings(
        this.containerId,
        settings
      );

      if (result.success) {
        // Log the activity
        await containerDetailService.createActivityLog(
          this.containerId,
          'settings_changed',
          'Container settings updated'
        );

        // Reload container data to get updated values
        await this.loadContainerData();

        runInAction(() => {
          this.pageState.isSettingsEditMode = false;
          this.loadingState.settings = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.error = {
          code: 'UPDATE_ERROR',
          message: 'Failed to update container settings',
        };
        this.loadingState.settings = false;
      });
    }
  }

  async loadEnvironmentLinks(): Promise<void> {
    try {
      const links = await containerDetailService.getEnvironmentLinks(this.containerId);
      runInAction(() => {
        this.environmentLinks = links;
      });
    } catch (error) {
      console.error('Failed to load environment links:', error);
    }
  }

  async updateEnvironmentLinks(links: Partial<EnvironmentLinks>): Promise<void> {
    try {
      const result = await containerDetailService.updateEnvironmentLinks(
        this.containerId,
        links
      );

      if (result.success) {
        await this.loadEnvironmentLinks();
      }
    } catch (error) {
      runInAction(() => {
        this.error = {
          code: 'UPDATE_ERROR',
          message: 'Failed to update environment links',
        };
      });
    }
  }

  // UI State Management
  setActiveTab(tab: ContainerDetailTab): void {
    this.pageState.activeTab = tab;
  }

  setTimePeriod(period: TimePeriod): void {
    this.pageState.selectedTimePeriod = period;
    // Reload data with new time period
    this.loadContainerData();
    this.loadMetricSnapshots();
  }

  setMetricInterval(interval: MetricInterval): void {
    this.pageState.metricInterval = interval;
    // Reload metrics with new interval
    this.loadMetricSnapshots();
  }

  toggleSettingsEditMode(): void {
    this.pageState.isSettingsEditMode = !this.pageState.isSettingsEditMode;
  }

  // Polling Management
  startMetricsPolling(): void {
    if (this.metricsPollingInterval) {
      return;
    }

    this.metricsPollingInterval = setInterval(() => {
      this.loadDashboardSummary();
      this.loadMetricSnapshots();
    }, this.METRICS_POLLING_INTERVAL);
  }

  stopMetricsPolling(): void {
    if (this.metricsPollingInterval) {
      clearInterval(this.metricsPollingInterval);
      this.metricsPollingInterval = null;
    }
  }

  // Cleanup
  dispose(): void {
    this.stopMetricsPolling();
  }

  // Initialize
  async initialize(): Promise<void> {
    // Load initial data
    await Promise.all([
      this.loadContainerData(),
      this.loadDashboardSummary(),
      this.loadMetricSnapshots(),
      this.loadEnvironmentLinks(),
    ]);

    // Start polling
    this.startMetricsPolling();
  }
}

// Factory function to create view model instances
export function createContainerDetailViewModel(containerId: number): ContainerDetailViewModel {
  return new ContainerDetailViewModel(containerId);
}