// API Adapter for Activity Log operations
// Handles activity log fetching, pagination, and filtering

import { ContainerApiService } from '../../../api/containerApiService';
import { 
  ActivityLogItem, 
  ActivityLogResponse, 
  ActivityLogFilter 
} from '../models/activity-log.model';

export interface ActivityLogApiFilter {
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  action_type?: string;
  actor_type?: string;
}

export interface CreateActivityLogRequest {
  action_type: string;
  actor_type: string;
  actor_id: string;
  description: string;
}

export class ActivityLogApiAdapter {
  private containerApiService: ContainerApiService;

  constructor(containerApiService?: ContainerApiService) {
    this.containerApiService = containerApiService || ContainerApiService.getInstance();
  }

  /**
   * Get paginated activity logs for a container
   */
  async getActivityLogs(
    containerId: number,
    filters: ActivityLogApiFilter = {}
  ): Promise<ActivityLogResponse> {
    const queryParams = this.buildQueryString({
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...filters
    });
    
    const endpoint = `/containers/${containerId}/activity-logs${queryParams}`;
    
    try {
      const response = await this.containerApiService.getActivityLogs(
        containerId,
        filters.page || 1,
        filters.limit || 20,
        filters.start_date,
        filters.end_date,
        filters.action_type,
        filters.actor_type
      );
      
      // Transform timestamps to ensure consistent formatting
      return {
        ...response,
        activities: response.activities.map(activity => ({
          ...activity,
          timestamp: new Date(activity.timestamp).toISOString()
        }))
      };
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
      throw new Error('Failed to load activity logs');
    }
  }

  /**
   * Get recent activities (last 20) for overview display
   */
  async getRecentActivities(containerId: number): Promise<ActivityLogItem[]> {
    try {
      const response = await this.getActivityLogs(containerId, {
        page: 1,
        limit: 20
      });
      
      return response.activities;
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      throw new Error('Failed to load recent activities');
    }
  }

  /**
   * Create a new activity log entry
   */
  async createActivityLog(
    containerId: number,
    activityData: CreateActivityLogRequest
  ): Promise<ActivityLogItem> {
    const endpoint = `/containers/${containerId}/activity-logs`;
    
    try {
      const response = await this.containerApiService['makeAuthenticatedRequest']<ActivityLogItem>(endpoint, {
        method: 'POST',
        body: JSON.stringify(activityData)
      });
      
      return {
        ...response,
        timestamp: new Date(response.timestamp).toISOString()
      };
    } catch (error) {
      console.error('Failed to create activity log:', error);
      throw new Error('Failed to create activity log entry');
    }
  }

  /**
   * Get activities for infinite scroll loading
   */
  async getActivitiesPage(
    containerId: number,
    page: number,
    limit: number = 20,
    filters: Omit<ActivityLogApiFilter, 'page' | 'limit'> = {}
  ): Promise<{
    activities: ActivityLogItem[];
    hasMore: boolean;
    nextPage: number;
    total: number;
  }> {
    try {
      const response = await this.getActivityLogs(containerId, {
        ...filters,
        page,
        limit
      });
      
      const hasMore = page < response.pagination.total_pages;
      const nextPage = hasMore ? page + 1 : page;
      
      return {
        activities: response.activities,
        hasMore,
        nextPage,
        total: response.pagination.total
      };
    } catch (error) {
      console.error('Failed to fetch activities page:', error);
      throw new Error('Failed to load more activities');
    }
  }

  /**
   * Get activities filtered by action type
   */
  async getActivitiesByType(
    containerId: number,
    actionType: string,
    limit: number = 50
  ): Promise<ActivityLogItem[]> {
    try {
      const response = await this.getActivityLogs(containerId, {
        action_type: actionType,
        limit
      });
      
      return response.activities;
    } catch (error) {
      console.error('Failed to fetch activities by type:', error);
      throw new Error(`Failed to load ${actionType} activities`);
    }
  }

  /**
   * Get activities filtered by date range
   */
  async getActivitiesInDateRange(
    containerId: number,
    startDate: Date,
    endDate: Date,
    limit: number = 100
  ): Promise<ActivityLogItem[]> {
    try {
      const response = await this.getActivityLogs(containerId, {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        limit
      });
      
      return response.activities;
    } catch (error) {
      console.error('Failed to fetch activities in date range:', error);
      throw new Error('Failed to load activities for the specified date range');
    }
  }

  /**
   * Get activity statistics for a container
   */
  async getActivityStats(
    containerId: number,
    days: number = 30
  ): Promise<{
    totalActivities: number;
    activitiesByType: Record<string, number>;
    activitiesByActor: Record<string, number>;
    dailyActivityCounts: Array<{ date: string; count: number }>;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    try {
      const activities = await this.getActivitiesInDateRange(containerId, startDate, endDate, 1000);
      
      // Calculate statistics
      const activitiesByType: Record<string, number> = {};
      const activitiesByActor: Record<string, number> = {};
      const dailyCounts: Record<string, number> = {};
      
      activities.forEach(activity => {
        // Count by type
        activitiesByType[activity.action_type] = (activitiesByType[activity.action_type] || 0) + 1;
        
        // Count by actor
        const actorKey = `${activity.actor_type}:${activity.actor_id}`;
        activitiesByActor[actorKey] = (activitiesByActor[actorKey] || 0) + 1;
        
        // Count by day
        const dateKey = new Date(activity.timestamp).toDateString();
        dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
      });
      
      // Convert daily counts to array format
      const dailyActivityCounts = Object.entries(dailyCounts).map(([date, count]) => ({
        date,
        count
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      return {
        totalActivities: activities.length,
        activitiesByType,
        activitiesByActor,
        dailyActivityCounts
      };
    } catch (error) {
      console.error('Failed to fetch activity stats:', error);
      throw new Error('Failed to load activity statistics');
    }
  }

  /**
   * Search activities by description
   */
  async searchActivities(
    containerId: number,
    searchQuery: string,
    filters: Omit<ActivityLogApiFilter, 'page' | 'limit'> = {}
  ): Promise<ActivityLogItem[]> {
    try {
      // Get a larger set to search through
      const response = await this.getActivityLogs(containerId, {
        ...filters,
        limit: 500
      });
      
      // Filter by search query (client-side for now)
      const filteredActivities = response.activities.filter(activity =>
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.action_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return filteredActivities;
    } catch (error) {
      console.error('Failed to search activities:', error);
      throw new Error('Failed to search activities');
    }
  }

  /**
   * Transform API filters to domain filters
   */
  transformToDomainFilter(apiFilter: ActivityLogApiFilter): ActivityLogFilter {
    return {
      start_date: apiFilter.start_date,
      end_date: apiFilter.end_date,
      action_type: apiFilter.action_type,
      actor_type: apiFilter.actor_type
    };
  }

  /**
   * Transform domain filters to API filters
   */
  transformToApiFilter(domainFilter: ActivityLogFilter, page = 1, limit = 20): ActivityLogApiFilter {
    return {
      page,
      limit,
      ...domainFilter
    };
  }

  /**
   * Build query string from parameters
   */
  private buildQueryString(params: Record<string, any>): string {
    const filtered = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => [key, String(value)]);
    
    if (filtered.length === 0) return '';
    
    const searchParams = new URLSearchParams(filtered);
    return `?${searchParams.toString()}`;
  }

  /**
   * Handle API errors with user-friendly messages
   */
  private handleApiError(error: any, operation: string): never {
    if (error.message?.includes('401')) {
      throw new Error('Authentication required. Please log in again.');
    }
    if (error.message?.includes('403')) {
      throw new Error('You do not have permission to access activity logs.');
    }
    if (error.message?.includes('404')) {
      throw new Error('Activity logs not found.');
    }
    
    console.error(`Activity log ${operation} failed:`, error);
    throw new Error(`Failed to ${operation}. Please try again.`);
  }
}

// Export singleton instance
export const activityLogApiAdapter = new ActivityLogApiAdapter();
