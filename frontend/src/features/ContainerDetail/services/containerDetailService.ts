/**
 * Container Detail Service
 * Wraps containerApiService with domain-specific transformations
 * Handles data transformation between API and UI models
 */

import { containerApiService } from '../../../api/containerApiService';
import type {
  ContainerOverviewResponse,
  DashboardSummaryResponse,
  ContainerSettingsUpdateRequest,
  MetricSnapshot as ApiMetricSnapshot,
  EnvironmentLink as ApiEnvironmentLink,
  CropsSummary as ApiCropsSummary,
  ActivityLog as ApiActivityLog,
  YieldDataPoint,
  UtilizationDataPoint,
} from '../../../api/containerApiService';

import type {
  ContainerDetailData,
  ContainerInfo,
  DashboardMetrics,
  CropSummaryRow,
  ActivityLogEntry,
  ActivityActionType,
  ActivityActorType,
  ContainerSettings,
  EnvironmentLinks,
  TimePeriod,
  MetricInterval,
  ActivityLogFilters,
} from '../types/container-detail';

import type {
  MetricSnapshot,
  DashboardSummary,
} from '../types/metrics';

// Transform API response to domain model
function transformContainerInfo(apiData: ContainerOverviewResponse['container']): ContainerInfo {
  return {
    id: apiData.id,
    name: apiData.name,
    type: apiData.type as 'physical' | 'virtual',
    tenant: {
      id: apiData.tenant.id,
      name: apiData.tenant.name,
    },
    location: apiData.location,
    status: apiData.status as ContainerInfo['status'],
  };
}

// Transform dashboard metrics from API to domain model
function transformDashboardMetrics(apiMetrics: ContainerOverviewResponse['dashboard_metrics']): DashboardMetrics {
  return {
    airTemperature: apiMetrics.air_temperature,
    humidity: apiMetrics.humidity,
    co2: apiMetrics.co2,
    yield: {
      average: apiMetrics.yield.average,
      total: apiMetrics.yield.total,
      chartData: apiMetrics.yield.chart_data.map((point: YieldDataPoint) => ({
        date: new Date(point.date),
        value: point.value,
        isCurrentPeriod: point.is_current_period,
        isFuture: point.is_future,
      })),
    },
    spaceUtilization: {
      nurseryStation: apiMetrics.space_utilization.nursery_station,
      cultivationArea: apiMetrics.space_utilization.cultivation_area,
      chartData: apiMetrics.space_utilization.chart_data.map((point: UtilizationDataPoint) => ({
        date: new Date(point.date),
        nurseryValue: point.nursery_value,
        cultivationValue: point.cultivation_value,
        isCurrentPeriod: point.is_current_period,
        isFuture: point.is_future,
      })),
    },
  };
}

// Transform crops summary from API to domain model
function transformCropsSummary(apiCrops: ApiCropsSummary[]): CropSummaryRow[] {
  return apiCrops.map((crop, index) => ({
    id: `crop-${index}-${crop.seed_type}`,
    seedType: crop.seed_type,
    nurseryStationCount: crop.nursery_station_count,
    cultivationAreaCount: crop.cultivation_area_count,
    lastSeedingDate: crop.last_seeding_date ? new Date(crop.last_seeding_date) : null,
    lastTransplantingDate: crop.last_transplanting_date ? new Date(crop.last_transplanting_date) : null,
    lastHarvestingDate: crop.last_harvesting_date ? new Date(crop.last_harvesting_date) : null,
    averageAge: crop.average_age,
    overdueCount: crop.overdue_count,
  }));
}

// Transform activity logs from API to domain model
function transformActivityLogs(apiLogs: ApiActivityLog[]): ActivityLogEntry[] {
  return apiLogs.map(log => ({
    id: log.id,
    containerId: log.container_id,
    timestamp: new Date(log.timestamp),
    actionType: log.action_type as ActivityActionType,
    actorType: log.actor_type as ActivityActorType,
    actorId: log.actor_id,
    description: log.description,
  }));
}

// Transform metric snapshots
function transformMetricSnapshots(apiSnapshots: ApiMetricSnapshot[]): MetricSnapshot[] {
  return apiSnapshots.map(snapshot => ({
    id: snapshot.id,
    containerId: snapshot.container_id,
    timestamp: new Date(snapshot.timestamp),
    airTemperature: snapshot.air_temperature,
    humidity: snapshot.humidity,
    co2: snapshot.co2,
    yieldKg: snapshot.yield_kg,
    spaceUtilizationPct: snapshot.space_utilization_pct,
  }));
}

// Transform environment links
function transformEnvironmentLinks(apiLinks: ApiEnvironmentLink): EnvironmentLinks {
  const transformLink = (link: Record<string, unknown>) => ({
    enabled: !!link && Object.keys(link).length > 0,
    url: link?.url as string | undefined,
    apiKey: link?.api_key as string | undefined,
    settings: link,
  });

  return {
    containerId: apiLinks.container_id,
    fa: transformLink(apiLinks.fa),
    pya: transformLink(apiLinks.pya),
    aws: transformLink(apiLinks.aws),
    mbai: transformLink(apiLinks.mbai),
    fh: transformLink(apiLinks.fh),
  };
}

// Transform container settings for update
function transformSettingsForApi(settings: Partial<ContainerSettings>): ContainerSettingsUpdateRequest {
  const apiSettings: ContainerSettingsUpdateRequest = {};

  if (settings.tenantId !== undefined) apiSettings.tenant_id = settings.tenantId;
  if (settings.purpose !== undefined) apiSettings.purpose = settings.purpose;
  if (settings.location !== undefined) apiSettings.location = settings.location;
  if (settings.notes !== undefined) apiSettings.notes = settings.notes;
  if (settings.shadowServiceEnabled !== undefined) apiSettings.shadow_service_enabled = settings.shadowServiceEnabled;
  if (settings.copiedEnvironmentFrom !== undefined) apiSettings.copied_environment_from = settings.copiedEnvironmentFrom;
  if (settings.roboticsSimulationEnabled !== undefined) apiSettings.robotics_simulation_enabled = settings.roboticsSimulationEnabled;
  if (settings.ecosystemConnected !== undefined) apiSettings.ecosystem_connected = settings.ecosystemConnected;
  if (settings.ecosystemSettings !== undefined) apiSettings.ecosystem_settings = settings.ecosystemSettings;

  return apiSettings;
}

// Transform dashboard summary
function transformDashboardSummary(apiSummary: DashboardSummaryResponse): DashboardSummary {
  return {
    currentMetrics: {
      airTemperature: apiSummary.current_metrics.air_temperature,
      humidity: apiSummary.current_metrics.humidity,
      co2: apiSummary.current_metrics.co2,
      yieldKg: apiSummary.current_metrics.yield_kg,
      spaceUtilizationPct: apiSummary.current_metrics.space_utilization_pct,
    },
    cropCounts: {
      totalCrops: apiSummary.crop_counts.total_crops,
      nurseryCrops: apiSummary.crop_counts.nursery_crops,
      cultivationCrops: apiSummary.crop_counts.cultivation_crops,
      overdueCrops: apiSummary.crop_counts.overdue_crops,
    },
    activityCount: apiSummary.activity_count,
    lastUpdated: new Date(apiSummary.last_updated),
  };
}

// Container Detail Service
export class ContainerDetailService {
  /**
   * Get comprehensive container overview data
   */
  async getContainerOverview(
    containerId: number,
    timePeriod: TimePeriod = 'week',
    metricInterval: MetricInterval = 'day'
  ): Promise<ContainerDetailData> {
    const response = await containerApiService.getContainerOverview(
      containerId,
      timePeriod,
      metricInterval
    );

    return {
      container: transformContainerInfo(response.container),
      dashboardMetrics: transformDashboardMetrics(response.dashboard_metrics),
      cropsSummary: transformCropsSummary(response.crops_summary),
      recentActivity: transformActivityLogs(response.recent_activity),
    };
  }

  /**
   * Get paginated activity logs
   */
  async getActivityLogs(
    containerId: number,
    page: number = 1,
    limit: number = 20,
    filters?: ActivityLogFilters
  ): Promise<{ activities: ActivityLogEntry[]; hasMore: boolean; total: number }> {
    const response = await containerApiService.getActivityLogs(
      containerId,
      page,
      limit,
      filters?.startDate?.toISOString(),
      filters?.endDate?.toISOString(),
      filters?.actionType,
      filters?.actorType
    );

    return {
      activities: transformActivityLogs(response.activities),
      hasMore: page < response.pagination.total_pages,
      total: response.pagination.total,
    };
  }

  /**
   * Get metric snapshots for charts
   */
  async getMetricSnapshots(
    containerId: number,
    startDate?: Date,
    endDate?: Date,
    interval: MetricInterval = 'day'
  ): Promise<MetricSnapshot[]> {
    const snapshots = await containerApiService.getMetricSnapshots(
      containerId,
      startDate?.toISOString(),
      endDate?.toISOString(),
      interval
    );

    return transformMetricSnapshots(snapshots);
  }

  /**
   * Get dashboard summary for quick loading
   */
  async getDashboardSummary(containerId: number): Promise<DashboardSummary> {
    const summary = await containerApiService.getDashboardSummary(containerId);
    return transformDashboardSummary(summary);
  }

  /**
   * Update container settings
   */
  async updateContainerSettings(
    containerId: number,
    settings: Partial<ContainerSettings>
  ): Promise<{ success: boolean; message: string; updatedAt: Date }> {
    const apiSettings = transformSettingsForApi(settings);
    const response = await containerApiService.updateContainerSettings(containerId, apiSettings);

    return {
      success: response.success,
      message: response.message,
      updatedAt: new Date(response.updated_at),
    };
  }

  /**
   * Get environment links
   */
  async getEnvironmentLinks(containerId: number): Promise<EnvironmentLinks> {
    const links = await containerApiService.getEnvironmentLinks(containerId);
    return transformEnvironmentLinks(links);
  }

  /**
   * Update environment links
   */
  async updateEnvironmentLinks(
    containerId: number,
    links: Partial<EnvironmentLinks>
  ): Promise<{ success: boolean; message: string; updatedAt: Date }> {
    // Transform back to API format
    const apiLinks: Partial<ApiEnvironmentLink> = {};
    if (links.fa !== undefined) apiLinks.fa = links.fa.settings || {};
    if (links.pya !== undefined) apiLinks.pya = links.pya.settings || {};
    if (links.aws !== undefined) apiLinks.aws = links.aws.settings || {};
    if (links.mbai !== undefined) apiLinks.mbai = links.mbai.settings || {};
    if (links.fh !== undefined) apiLinks.fh = links.fh.settings || {};

    const response = await containerApiService.updateEnvironmentLinks(containerId, apiLinks);

    return {
      success: response.success,
      message: response.message,
      updatedAt: new Date(response.updated_at),
    };
  }

  /**
   * Create activity log entry
   */
  async createActivityLog(
    containerId: number,
    actionType: ActivityActionType,
    description: string,
    actorType: ActivityActorType = 'user',
    actorId: string = 'current-user'
  ): Promise<ActivityLogEntry> {
    const activity = await containerApiService.createActivityLog(containerId, {
      action_type: actionType,
      actor_type: actorType,
      actor_id: actorId,
      description,
    });

    return {
      id: activity.id,
      containerId: activity.container_id,
      timestamp: new Date(activity.timestamp),
      actionType: activity.action_type as ActivityActionType,
      actorType: activity.actor_type as ActivityActorType,
      actorId: activity.actor_id,
      description: activity.description,
    };
  }

  /**
   * Create metric snapshot
   */
  async createMetricSnapshot(
    containerId: number,
    metrics: Omit<MetricSnapshot, 'id' | 'containerId' | 'timestamp'>
  ): Promise<MetricSnapshot> {
    const snapshot = await containerApiService.createMetricSnapshot(containerId, {
      air_temperature: metrics.airTemperature,
      humidity: metrics.humidity,
      co2: metrics.co2,
      yield_kg: metrics.yieldKg,
      space_utilization_pct: metrics.spaceUtilizationPct,
    });

    return {
      id: snapshot.id,
      containerId: snapshot.container_id,
      timestamp: new Date(snapshot.timestamp),
      airTemperature: snapshot.air_temperature,
      humidity: snapshot.humidity,
      co2: snapshot.co2,
      yieldKg: snapshot.yield_kg,
      spaceUtilizationPct: snapshot.space_utilization_pct,
    };
  }
}

// Export singleton instance
export const containerDetailService = new ContainerDetailService();