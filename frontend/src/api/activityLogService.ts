/**
 * Activity Log Service
 * Handles all activity log related API operations
 * Based on p2_routing.md specifications
 */

import { BaseApiService } from './baseApiService';
import { 
  ActivityLog, 
  CreateActivityLogRequest, 
  ActivityLogFilterCriteria, 
  ActivityLogListResponse,
  ActivitySummary,
  ActivityTrends,
  ActivityAuditTrail,
  ActivityFeedResponse,
  ActivityNotificationSettings
} from '../types/activityLogs';
import { ApiError } from './index';

export class ActivityLogService extends BaseApiService {
  private static instance: ActivityLogService;

  private constructor(baseURL: string = '/api/v1') {
    super(baseURL);
  }

  public static getInstance(baseURL?: string): ActivityLogService {
    if (!ActivityLogService.instance) {
      ActivityLogService.instance = new ActivityLogService(baseURL);
    }
    return ActivityLogService.instance;
  }

  /**
   * Get activity logs with optional filtering
   */
  public async getActivityLogs(filters?: ActivityLogFilterCriteria): Promise<ActivityLogListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const url = `/activity-logs/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.makeAuthenticatedRequest<ActivityLogListResponse>(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch activity logs');
    }
  }

  /**
   * Create a new activity log entry
   */
  public async createActivityLog(logData: CreateActivityLogRequest): Promise<ActivityLog> {
    try {
      const response = await this.makeAuthenticatedRequest<ActivityLog>('/activity-logs/', {
        method: 'POST',
        body: JSON.stringify(logData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create activity log');
    }
  }

  /**
   * Get activity log by ID
   */
  public async getActivityLogById(id: number): Promise<ActivityLog> {
    try {
      const response = await this.makeAuthenticatedRequest<ActivityLog>(`/activity-logs/${id}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch activity log with ID ${id}`);
    }
  }

  /**
   * Get activity logs for a specific container
   */
  public async getActivityLogsForContainer(
    containerId: number,
    filters?: Omit<ActivityLogFilterCriteria, 'container_id'>
  ): Promise<ActivityLog[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('container_id', containerId.toString());
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const response = await this.makeAuthenticatedRequest<ActivityLogListResponse>(`/activity-logs/?${queryParams.toString()}`, {
        method: 'GET',
      });

      return response.activity_logs;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch activity logs for container ${containerId}`);
    }
  }

  /**
   * Get activity summary and statistics
   */
  public async getActivitySummary(
    containerId?: number,
    startDate?: string,
    endDate?: string
  ): Promise<ActivitySummary> {
    try {
      const queryParams = new URLSearchParams();
      if (containerId) queryParams.append('container_id', containerId.toString());
      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);

      const url = `/activity-logs/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.makeAuthenticatedRequest<ActivitySummary>(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch activity summary');
    }
  }

  /**
   * Get activity trends and patterns
   */
  public async getActivityTrends(
    containerId?: number,
    period: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily',
    startDate?: string,
    endDate?: string
  ): Promise<ActivityTrends> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('period', period);
      if (containerId) queryParams.append('container_id', containerId.toString());
      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);

      const response = await this.makeAuthenticatedRequest<ActivityTrends>(`/activity-logs/trends?${queryParams.toString()}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch activity trends');
    }
  }

  /**
   * Get audit trail for a specific entity
   */
  public async getAuditTrail(
    entityType: 'container' | 'device' | 'crop' | 'user',
    entityId: string | number
  ): Promise<ActivityAuditTrail> {
    try {
      const response = await this.makeAuthenticatedRequest<ActivityAuditTrail>(
        `/activity-logs/audit-trail/${entityType}/${entityId}`, 
        {
          method: 'GET',
        }
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch audit trail for ${entityType} ${entityId}`);
    }
  }

  /**
   * Get real-time activity feed
   */
  public async getActivityFeed(
    page = 1,
    limit = 50,
    containerId?: number,
    unreadOnly = false
  ): Promise<ActivityFeedResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      if (containerId) queryParams.append('container_id', containerId.toString());
      if (unreadOnly) queryParams.append('unread_only', 'true');

      const response = await this.makeAuthenticatedRequest<ActivityFeedResponse>(`/activity-logs/feed?${queryParams.toString()}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch activity feed');
    }
  }

  /**
   * Mark activity feed items as read
   */
  public async markActivityFeedAsRead(itemIds: number[]): Promise<{ marked_read: number }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ marked_read: number }>('/activity-logs/feed/mark-read', {
        method: 'POST',
        body: JSON.stringify({ item_ids: itemIds }),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to mark activity feed items as read');
    }
  }

  /**
   * Get activity notification settings
   */
  public async getNotificationSettings(userId: string): Promise<ActivityNotificationSettings> {
    try {
      const response = await this.makeAuthenticatedRequest<ActivityNotificationSettings>(`/activity-logs/notifications/${userId}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch notification settings for user ${userId}`);
    }
  }

  /**
   * Update activity notification settings
   */
  public async updateNotificationSettings(
    userId: string, 
    settings: Partial<ActivityNotificationSettings>
  ): Promise<ActivityNotificationSettings> {
    try {
      const response = await this.makeAuthenticatedRequest<ActivityNotificationSettings>(`/activity-logs/notifications/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(settings),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to update notification settings for user ${userId}`);
    }
  }

  /**
   * Search activity logs
   */
  public async searchActivityLogs(
    query: string,
    filters?: ActivityLogFilterCriteria
  ): Promise<ActivityLogListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const response = await this.makeAuthenticatedRequest<ActivityLogListResponse>(`/activity-logs/search?${queryParams.toString()}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to search activity logs');
    }
  }

  /**
   * Export activity logs
   */
  public async exportActivityLogs(
    filters?: ActivityLogFilterCriteria,
    format: 'csv' | 'json' | 'pdf' = 'csv'
  ): Promise<{ download_url: string; expires_at: string }> {
    try {
      const requestBody = {
        filters: filters || {},
        format
      };

      const response = await this.makeAuthenticatedRequest<{ download_url: string; expires_at: string }>('/activity-logs/export', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to export activity logs');
    }
  }

  /**
   * Delete old activity logs (admin function)
   */
  public async deleteOldActivityLogs(
    olderThan: string,
    dryRun = true
  ): Promise<{ deleted_count: number; preview_count?: number }> {
    try {
      const requestBody = {
        older_than: olderThan,
        dry_run: dryRun
      };

      const response = await this.makeAuthenticatedRequest<{ deleted_count: number; preview_count?: number }>('/activity-logs/cleanup', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to delete old activity logs');
    }
  }
}

// Create and export singleton instance
export const activityLogService = ActivityLogService.getInstance();

// Export utility functions for easier usage
export const getActivityLogs = (filters?: ActivityLogFilterCriteria): Promise<ActivityLogListResponse> => 
  activityLogService.getActivityLogs(filters);

export const createActivityLog = (logData: CreateActivityLogRequest): Promise<ActivityLog> => 
  activityLogService.createActivityLog(logData);

export const getActivityLogById = (id: number): Promise<ActivityLog> => 
  activityLogService.getActivityLogById(id);

export const getActivityLogsForContainer = (
  containerId: number,
  filters?: Omit<ActivityLogFilterCriteria, 'container_id'>
): Promise<ActivityLog[]> => 
  activityLogService.getActivityLogsForContainer(containerId, filters);

export const getActivitySummary = (
  containerId?: number,
  startDate?: string,
  endDate?: string
): Promise<ActivitySummary> => 
  activityLogService.getActivitySummary(containerId, startDate, endDate);

export const getActivityTrends = (
  containerId?: number,
  period: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily',
  startDate?: string,
  endDate?: string
): Promise<ActivityTrends> => 
  activityLogService.getActivityTrends(containerId, period, startDate, endDate);

export const getAuditTrail = (
  entityType: 'container' | 'device' | 'crop' | 'user',
  entityId: string | number
): Promise<ActivityAuditTrail> => 
  activityLogService.getAuditTrail(entityType, entityId);

export const getActivityFeed = (
  page = 1,
  limit = 50,
  containerId?: number,
  unreadOnly = false
): Promise<ActivityFeedResponse> => 
  activityLogService.getActivityFeed(page, limit, containerId, unreadOnly);

export const markActivityFeedAsRead = (itemIds: number[]): Promise<{ marked_read: number }> => 
  activityLogService.markActivityFeedAsRead(itemIds);

export const getNotificationSettings = (userId: string): Promise<ActivityNotificationSettings> => 
  activityLogService.getNotificationSettings(userId);

export const updateNotificationSettings = (
  userId: string, 
  settings: Partial<ActivityNotificationSettings>
): Promise<ActivityNotificationSettings> => 
  activityLogService.updateNotificationSettings(userId, settings);

export const searchActivityLogs = (
  query: string,
  filters?: ActivityLogFilterCriteria
): Promise<ActivityLogListResponse> => 
  activityLogService.searchActivityLogs(query, filters);

export const exportActivityLogs = (
  filters?: ActivityLogFilterCriteria,
  format: 'csv' | 'json' | 'pdf' = 'csv'
): Promise<{ download_url: string; expires_at: string }> => 
  activityLogService.exportActivityLogs(filters, format);

export const deleteOldActivityLogs = (
  olderThan: string,
  dryRun = true
): Promise<{ deleted_count: number; preview_count?: number }> => 
  activityLogService.deleteOldActivityLogs(olderThan, dryRun);
