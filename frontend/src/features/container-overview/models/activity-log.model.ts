// Domain models for activity log management
// Handles activity data, filtering, and pagination

export interface ActivityLogItem {
  id: number;
  container_id: number;
  timestamp: string;
  action_type: string;
  actor_type: string;
  actor_id: string;
  description: string;
}

export interface ActivityLogPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ActivityLogResponse {
  activities: ActivityLogItem[];
  pagination: ActivityLogPagination;
}

export interface ActivityLogFilter {
  start_date?: string;
  end_date?: string;
  action_type?: string;
  actor_type?: string;
}

export type ActivityActionType = 
  | 'seeding'
  | 'transplanting'
  | 'harvesting'
  | 'irrigation'
  | 'environmental_adjustment'
  | 'maintenance'
  | 'system_event'
  | 'user_action';

export type ActivityActorType = 
  | 'user'
  | 'system'
  | 'robot'
  | 'sensor'
  | 'scheduler';

// Domain logic for activity log management
export class ActivityLogModel {
  private activities: ActivityLogItem[] = [];
  private pagination: ActivityLogPagination = {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0
  };
  private filters: ActivityLogFilter = {};
  private isLoading = false;
  private hasMore = true;

  public setActivities(activities: ActivityLogItem[], append = false): void {
    if (append) {
      this.activities = [...this.activities, ...activities];
    } else {
      this.activities = activities;
    }
  }

  public getActivities(): ActivityLogItem[] {
    return this.activities;
  }

  public setPagination(pagination: ActivityLogPagination): void {
    this.pagination = pagination;
    this.hasMore = pagination.page < pagination.total_pages;
  }

  public getPagination(): ActivityLogPagination {
    return this.pagination;
  }

  public setFilters(filters: ActivityLogFilter): void {
    this.filters = filters;
  }

  public getFilters(): ActivityLogFilter {
    return this.filters;
  }

  public setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  public isLoadingData(): boolean {
    return this.isLoading;
  }

  public hasMoreActivities(): boolean {
    return this.hasMore;
  }

  public getNextPage(): number {
    return this.pagination.page + 1;
  }

  public reset(): void {
    this.activities = [];
    this.pagination = { page: 1, limit: 20, total: 0, total_pages: 0 };
    this.filters = {};
    this.hasMore = true;
  }

  // Format timestamp for display
  public formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }

  // Get formatted time for timeline display
  public getTimelineTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Get formatted date for timeline grouping
  public getTimelineDate(timestamp: string): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  // Get icon for activity type
  public getActivityIcon(actionType: string): string {
    const iconMap: Record<string, string> = {
      seeding: 'seed',
      transplanting: 'transfer',
      harvesting: 'harvest',
      irrigation: 'water',
      environmental_adjustment: 'settings',
      maintenance: 'tool',
      system_event: 'system',
      user_action: 'user'
    };
    
    return iconMap[actionType] || 'activity';
  }

  // Get color for activity type
  public getActivityColor(actionType: string): 'success' | 'info' | 'warning' | 'error' | 'default' {
    const colorMap: Record<string, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
      seeding: 'success',
      transplanting: 'info',
      harvesting: 'success',
      irrigation: 'info',
      environmental_adjustment: 'warning',
      maintenance: 'warning',
      system_event: 'default',
      user_action: 'info'
    };
    
    return colorMap[actionType] || 'default';
  }

  // Format actor name for display
  public formatActor(activity: ActivityLogItem): string {
    if (activity.actor_type === 'user') {
      return `User ${activity.actor_id}`;
    }
    if (activity.actor_type === 'system') {
      return 'System';
    }
    if (activity.actor_type === 'robot') {
      return `Robot ${activity.actor_id}`;
    }
    if (activity.actor_type === 'sensor') {
      return `Sensor ${activity.actor_id}`;
    }
    if (activity.actor_type === 'scheduler') {
      return 'Scheduler';
    }
    
    return activity.actor_id;
  }

  // Group activities by date for timeline display
  public getGroupedActivities(): Array<{ date: string; activities: ActivityLogItem[] }> {
    const groups = new Map<string, ActivityLogItem[]>();

    this.activities.forEach(activity => {
      const dateKey = this.getTimelineDate(activity.timestamp);
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(activity);
    });

    return Array.from(groups.entries()).map(([date, activities]) => ({
      date,
      activities: activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    }));
  }

  // Get unique action types for filtering
  public getUniqueActionTypes(): string[] {
    const actionTypes = this.activities.map(activity => activity.action_type);
    return Array.from(new Set(actionTypes)).sort();
  }

  // Get unique actor types for filtering
  public getUniqueActorTypes(): string[] {
    const actorTypes = this.activities.map(activity => activity.actor_type);
    return Array.from(new Set(actorTypes)).sort();
  }

  // Check if activity is recent (within last 24 hours)
  public isRecentActivity(timestamp: string): boolean {
    const activityTime = new Date(timestamp).getTime();
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return activityTime > oneDayAgo;
  }
}
