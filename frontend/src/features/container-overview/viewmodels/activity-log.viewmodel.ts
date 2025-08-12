// ViewModel for Activity Log management
// Handles activity data, infinite scroll, filtering, and real-time updates

import { 
  ActivityLogModel, 
  ActivityLogItem, 
  ActivityLogFilter 
} from '../models/activity-log.model';
import { activityLogApiAdapter } from '../services/activity-log-api.adapter';

export interface ActivityLogState {
  activities: ActivityLogItem[];
  groupedActivities: Array<{ date: string; activities: ActivityLogItem[] }>;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  filters: ActivityLogFilter;
  totalCount: number;
}

export class ActivityLogViewModel {
  private model: ActivityLogModel;
  private containerId: number;
  private onStateChange?: (state: ActivityLogState) => void;

  constructor(containerId: number) {
    this.containerId = containerId;
    this.model = new ActivityLogModel();
  }

  // State management
  public setStateChangeListener(callback: (state: ActivityLogState) => void): void {
    this.onStateChange = callback;
  }

  public getState(): ActivityLogState {
    return {
      activities: this.model.getActivities(),
      groupedActivities: this.model.getGroupedActivities(),
      isLoading: this.model.isLoadingData(),
      isLoadingMore: false, // Managed separately for infinite scroll
      hasMore: this.model.hasMoreActivities(),
      error: null, // Managed by this viewmodel
      filters: this.model.getFilters(),
      totalCount: this.model.getPagination().total
    };
  }

  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
  }

  // Core operations
  public async initialize(): Promise<void> {
    try {
      this.model.setLoading(true);
      this.notifyStateChange();

      const response = await activityLogApiAdapter.getActivityLogs(this.containerId, {
        page: 1,
        limit: 20
      });

      this.model.setActivities(response.activities, false);
      this.model.setPagination(response.pagination);
      this.model.setLoading(false);
      
      this.notifyStateChange();

    } catch (error) {
      console.error('Failed to initialize activity log:', error);
      this.model.setLoading(false);
      this.notifyStateChange();
    }
  }

  public async loadMoreActivities(): Promise<void> {
    if (!this.model.hasMoreActivities() || this.model.isLoadingData()) {
      return;
    }

    try {
      this.notifyStateChange(); // Set loading more state

      const nextPage = this.model.getNextPage();
      const response = await activityLogApiAdapter.getActivitiesPage(
        this.containerId,
        nextPage,
        20,
        this.model.getFilters()
      );

      this.model.setActivities(response.activities, true); // Append to existing
      this.model.setPagination({
        page: nextPage,
        limit: 20,
        total: response.total,
        total_pages: Math.ceil(response.total / 20)
      });

      this.notifyStateChange();

    } catch (error) {
      console.error('Failed to load more activities:', error);
      this.notifyStateChange();
    }
  }

  public async refreshActivities(): Promise<void> {
    this.model.reset();
    await this.initialize();
  }

  // Filtering operations
  public async applyFilters(filters: ActivityLogFilter): Promise<void> {
    try {
      this.model.setLoading(true);
      this.model.setFilters(filters);
      this.model.reset(); // Clear existing data
      this.notifyStateChange();

      const response = await activityLogApiAdapter.getActivityLogs(this.containerId, {
        page: 1,
        limit: 20,
        ...filters
      });

      this.model.setActivities(response.activities, false);
      this.model.setPagination(response.pagination);
      this.model.setLoading(false);
      
      this.notifyStateChange();

    } catch (error) {
      console.error('Failed to apply filters:', error);
      this.model.setLoading(false);
      this.notifyStateChange();
    }
  }

  public async setDateRangeFilter(startDate?: string, endDate?: string): Promise<void> {
    const currentFilters = this.model.getFilters();
    await this.applyFilters({
      ...currentFilters,
      start_date: startDate,
      end_date: endDate
    });
  }

  public async setActionTypeFilter(actionType?: string): Promise<void> {
    const currentFilters = this.model.getFilters();
    await this.applyFilters({
      ...currentFilters,
      action_type: actionType
    });
  }

  public async setActorTypeFilter(actorType?: string): Promise<void> {
    const currentFilters = this.model.getFilters();
    await this.applyFilters({
      ...currentFilters,
      actor_type: actorType
    });
  }

  public async clearFilters(): Promise<void> {
    await this.applyFilters({});
  }

  public hasActiveFilters(): boolean {
    const filters = this.model.getFilters();
    return Boolean(
      filters.start_date ||
      filters.end_date ||
      filters.action_type ||
      filters.actor_type
    );
  }

  // Data access methods
  public getActivities(): ActivityLogItem[] {
    return this.model.getActivities();
  }

  public getGroupedActivities(): Array<{ date: string; activities: ActivityLogItem[] }> {
    return this.model.getGroupedActivities();
  }

  public getRecentActivities(limit: number = 10): ActivityLogItem[] {
    return this.model.getActivities().slice(0, limit);
  }

  public getActivityById(id: number): ActivityLogItem | undefined {
    return this.model.getActivities().find(activity => activity.id === id);
  }

  // UI data transformation
  public formatTimestamp(timestamp: string): string {
    return this.model.formatTimestamp(timestamp);
  }

  public getTimelineTime(timestamp: string): string {
    return this.model.getTimelineTime(timestamp);
  }

  public getTimelineDate(timestamp: string): string {
    return this.model.getTimelineDate(timestamp);
  }

  public getActivityIcon(actionType: string): string {
    return this.model.getActivityIcon(actionType);
  }

  public getActivityColor(actionType: string): 'success' | 'info' | 'warning' | 'error' | 'default' {
    return this.model.getActivityColor(actionType);
  }

  public formatActor(activity: ActivityLogItem): string {
    return this.model.formatActor(activity);
  }

  public isRecentActivity(timestamp: string): boolean {
    return this.model.isRecentActivity(timestamp);
  }

  // Filter options
  public getUniqueActionTypes(): string[] {
    return this.model.getUniqueActionTypes();
  }

  public getUniqueActorTypes(): string[] {
    return this.model.getUniqueActorTypes();
  }

  public getActionTypeOptions(): Array<{ value: string; label: string }> {
    const actionTypes = this.getUniqueActionTypes();
    return actionTypes.map(type => ({
      value: type,
      label: this.formatActionTypeLabel(type)
    }));
  }

  public getActorTypeOptions(): Array<{ value: string; label: string }> {
    const actorTypes = this.getUniqueActorTypes();
    return actorTypes.map(type => ({
      value: type,
      label: this.formatActorTypeLabel(type)
    }));
  }

  private formatActionTypeLabel(actionType: string): string {
    return actionType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private formatActorTypeLabel(actorType: string): string {
    return actorType.charAt(0).toUpperCase() + actorType.slice(1);
  }

  // Statistics and analytics
  public async getActivityStats(days: number = 30): Promise<{
    totalActivities: number;
    activitiesByType: Record<string, number>;
    activitiesByActor: Record<string, number>;
    dailyActivityCounts: Array<{ date: string; count: number }>;
  }> {
    try {
      return await activityLogApiAdapter.getActivityStats(this.containerId, days);
    } catch (error) {
      console.error('Failed to get activity stats:', error);
      throw error;
    }
  }

  public getActivitySummary() {
    const activities = this.model.getActivities();
    const total = activities.length;
    const recentCount = activities.filter(activity => 
      this.model.isRecentActivity(activity.timestamp)
    ).length;

    const actionTypeCounts: Record<string, number> = {};
    activities.forEach(activity => {
      actionTypeCounts[activity.action_type] = (actionTypeCounts[activity.action_type] || 0) + 1;
    });

    const mostCommonAction = Object.entries(actionTypeCounts)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      totalActivities: total,
      recentActivities: recentCount,
      mostCommonAction: mostCommonAction ? {
        type: mostCommonAction[0],
        count: mostCommonAction[1],
        label: this.formatActionTypeLabel(mostCommonAction[0])
      } : null,
      actionTypeCounts
    };
  }

  // Search functionality
  public async searchActivities(query: string): Promise<ActivityLogItem[]> {
    try {
      return await activityLogApiAdapter.searchActivities(this.containerId, query, this.model.getFilters());
    } catch (error) {
      console.error('Failed to search activities:', error);
      throw error;
    }
  }

  // Real-time updates (if implemented)
  public addNewActivity(activity: ActivityLogItem): void {
    const currentActivities = this.model.getActivities();
    this.model.setActivities([activity, ...currentActivities], false);
    this.notifyStateChange();
  }

  // Export functionality
  public async exportActivitiesData(): Promise<string> {
    const activities = this.model.getActivities();
    const filters = this.model.getFilters();
    const summary = this.getActivitySummary();
    
    return JSON.stringify({
      container_id: this.containerId,
      exported_at: new Date().toISOString(),
      filters,
      summary,
      activities: activities.map(activity => ({
        ...activity,
        formatted_timestamp: this.formatTimestamp(activity.timestamp),
        formatted_actor: this.formatActor(activity),
        activity_icon: this.getActivityIcon(activity.action_type),
        activity_color: this.getActivityColor(activity.action_type)
      }))
    }, null, 2);
  }

  // State checks
  public hasActivities(): boolean {
    return this.model.getActivities().length > 0;
  }

  public isLoading(): boolean {
    return this.model.isLoadingData();
  }

  public hasMore(): boolean {
    return this.model.hasMoreActivities();
  }

  public hasError(): boolean {
    return false; // Error state would be managed here
  }

  public getErrorMessage(): string | null {
    return null; // Error message would be managed here
  }

  // Cleanup
  public destroy(): void {
    this.onStateChange = undefined;
  }
}
