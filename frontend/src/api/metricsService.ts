import { BaseApiService } from './baseService';
import { apiConfig } from './config';
import {
  MetricSnapshot,
  MetricSnapshotListFilters,
  ActivityLog,
  ActivityLogListFilters
} from '../types/verticalFarm';

class MetricsService extends BaseApiService {
  constructor() {
    super(apiConfig.baseUrl);
  }

  /**
   * Get metric snapshots with optional filtering
   */
  async getMetricSnapshots(filters?: MetricSnapshotListFilters): Promise<MetricSnapshot[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<MetricSnapshot[]>(`/metrics/snapshots/${queryString}`);
  }

  /**
   * Get metric snapshot by ID
   */
  async getMetricSnapshotById(id: number): Promise<MetricSnapshot> {
    return this.get<MetricSnapshot>(`/metrics/snapshots/${id}`);
  }

  /**
   * Get metric snapshots for a specific container
   */
  async getMetricSnapshotsByContainer(containerId: number): Promise<MetricSnapshot[]> {
    return this.getMetricSnapshots({ container_id: containerId });
  }

  /**
   * Get metric snapshots for a date range
   */
  async getMetricSnapshotsByDateRange(startDate: string, endDate: string): Promise<MetricSnapshot[]> {
    return this.getMetricSnapshots({ start_date: startDate, end_date: endDate });
  }

  /**
   * Get metric snapshots for a container within a date range
   */
  async getMetricSnapshotsByContainerAndDateRange(
    containerId: number,
    startDate: string,
    endDate: string
  ): Promise<MetricSnapshot[]> {
    return this.getMetricSnapshots({
      container_id: containerId,
      start_date: startDate,
      end_date: endDate
    });
  }

  /**
   * Get activity logs with optional filtering
   */
  async getActivityLogs(filters?: ActivityLogListFilters): Promise<ActivityLog[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<ActivityLog[]>(`/activity-logs/${queryString}`);
  }

  /**
   * Get activity log by ID
   */
  async getActivityLogById(id: number): Promise<ActivityLog> {
    return this.get<ActivityLog>(`/activity-logs/${id}`);
  }

  /**
   * Get activity logs for a specific container
   */
  async getActivityLogsByContainer(containerId: number): Promise<ActivityLog[]> {
    return this.getActivityLogs({ container_id: containerId });
  }

  /**
   * Get activity logs by action type
   */
  async getActivityLogsByActionType(actionType: string): Promise<ActivityLog[]> {
    return this.getActivityLogs({ action_type: actionType });
  }

  /**
   * Get activity logs by actor type
   */
  async getActivityLogsByActorType(actorType: string): Promise<ActivityLog[]> {
    return this.getActivityLogs({ actor_type: actorType });
  }

  /**
   * Get recent activity logs for a container
   */
  async getRecentActivityLogsByContainer(containerId: number, _limit: number = 10): Promise<ActivityLog[]> {
    return this.getActivityLogs({ container_id: containerId });
  }
}

export const metricsService = new MetricsService();
export default metricsService;