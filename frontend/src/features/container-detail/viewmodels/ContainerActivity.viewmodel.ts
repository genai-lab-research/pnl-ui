// Container Activity ViewModel - Manages activity logs and timeline display
import { 
  ContainerActivityState,
  ActivityFilters,
  ActivityLogPagination,
  ActivityItemModel,
  ContainerDetailError,
} from '../types';
import { ActivityLog } from '../../../types/containers';
import { containerDetailService } from '../services';
import { transformActivityToItemModels } from '../services/dataTransformers';

/**
 * ViewModel for container activity logs and timeline
 */
export class ContainerActivityViewModel {
  private state: ContainerActivityState;
  private containerId: number;
  private listeners: Set<() => void> = new Set();

  constructor(containerId: number, initialActivities: ActivityLog[] = []) {
    this.containerId = containerId;
    this.state = {
      activities: initialActivities,
      pagination: {
        page: 1,
        limit: 20,
        total: initialActivities.length,
        totalPages: 1,
      },
      filters: {},
      isLoading: false,
      error: null,
    };
  }

  // State Management

  /**
   * Load activity logs with current filters and pagination
   */
  async loadActivities(): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const result = await containerDetailService.loadActivityLogs(
        this.containerId,
        this.state.pagination.page,
        this.state.pagination.limit,
        this.state.filters
      );

      this.setState({
        activities: result.activities,
        pagination: result.pagination,
        isLoading: false,
      });

    } catch (error: any) {
      this.setState({
        isLoading: false,
        error: { type: 'LOAD_ERROR', message: error.message || 'Failed to load activity logs', timestamp: new Date().toISOString(), retryable: true } as ContainerDetailError,
      });
    }
  }

  /**
   * Load more activities (infinite scroll)
   */
  async loadMoreActivities(): Promise<void> {
    if (this.state.isLoading || !this.hasMoreActivities()) return;

    const nextPage = this.state.pagination.page + 1;
    this.setState({ isLoading: true });

    try {
      const result = await containerDetailService.loadActivityLogs(
        this.containerId,
        nextPage,
        this.state.pagination.limit,
        this.state.filters
      );

      this.setState({
        activities: [...this.state.activities, ...result.activities],
        pagination: result.pagination,
        isLoading: false,
      });

    } catch (error: any) {
      this.setState({
        isLoading: false,
        error: { type: 'LOAD_ERROR', message: error.message || 'Failed to load more activities', timestamp: new Date().toISOString(), retryable: true } as ContainerDetailError,
      });
    }
  }

  /**
   * Set activity filters
   */
  async setFilters(filters: Partial<ActivityFilters>): Promise<void> {
    const newFilters = { ...this.state.filters, ...filters };
    
    this.setState({
      filters: newFilters,
      pagination: { ...this.state.pagination, page: 1 }, // Reset to first page
    });

    await this.loadActivities();
  }

  /**
   * Clear all filters
   */
  async clearFilters(): Promise<void> {
    this.setState({
      filters: {},
      pagination: { ...this.state.pagination, page: 1 },
    });

    await this.loadActivities();
  }

  /**
   * Go to specific page
   */
  async goToPage(page: number): Promise<void> {
    if (page < 1 || page > this.state.pagination.totalPages) return;

    this.setState({
      pagination: { ...this.state.pagination, page },
    });

    await this.loadActivities();
  }

  /**
   * Change page size
   */
  async setPageSize(limit: number): Promise<void> {
    this.setState({
      pagination: { ...this.state.pagination, limit, page: 1 },
    });

    await this.loadActivities();
  }

  /**
   * Refresh activities
   */
  async refresh(): Promise<void> {
    await this.loadActivities();
  }

  /**
   * Add new activity (for real-time updates)
   */
  addActivity(activity: ActivityLog): void {
    this.setState({
      activities: [activity, ...this.state.activities],
      pagination: {
        ...this.state.pagination,
        total: this.state.pagination.total + 1,
      },
    });
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Getters for UI Components

  /**
   * Get activity items for display
   */
  getActivityItems(): ActivityItemModel[] {
    return transformActivityToItemModels(this.state.activities);
  }

  /**
   * Get grouped activities by date
   */
  getGroupedActivities(): Array<{
    date: string;
    activities: ActivityItemModel[];
  }> {
    const activities = this.getActivityItems();
    const grouped = new Map<string, ActivityItemModel[]>();

    activities.forEach(activity => {
      const date = new Date(activity.timestamp).toDateString();
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(activity);
    });

    return Array.from(grouped.entries())
      .map(([date, activities]) => ({ date, activities }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Get recent activities (last 24 hours)
   */
  getRecentActivities(): ActivityItemModel[] {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return this.getActivityItems().filter(activity => 
      new Date(activity.timestamp) > yesterday
    );
  }

  /**
   * Get activity summary by type
   */
  getActivitySummary(): Array<{
    type: string;
    count: number;
    percentage: number;
  }> {
    const typeCounts = new Map<string, number>();
    const total = this.state.activities.length;

    this.state.activities.forEach(activity => {
      const type = activity.action_type;
      typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
    });

    return Array.from(typeCounts.entries())
      .map(([type, count]) => ({
        type,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get filter options based on current data
   */
  getFilterOptions(): {
    actionTypes: string[];
    actorTypes: string[];
    dateRanges: Array<{ label: string; value: { startDate: string; endDate?: string } }>;
  } {
    const actionTypes = Array.from(new Set(
      this.state.activities.map(a => a.action_type)
    )).sort();

    const actorTypes = Array.from(new Set(
      this.state.activities.map(a => a.actor_type)
    )).sort();

    const now = new Date();
    const dateRanges = [
      {
        label: 'Last 24 hours',
        value: {
          startDate: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        },
      },
      {
        label: 'Last 7 days',
        value: {
          startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
      {
        label: 'Last 30 days',
        value: {
          startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
    ];

    return { actionTypes, actorTypes, dateRanges };
  }

  /**
   * Get current filter state
   */
  getCurrentFilters(): ActivityFilters {
    return { ...this.state.filters };
  }

  /**
   * Get pagination model
   */
  getPaginationModel() {
    return {
      currentPage: this.state.pagination.page,
      totalPages: this.state.pagination.totalPages,
      totalItems: this.state.pagination.total,
      itemsPerPage: this.state.pagination.limit,
      onPageChange: (page: number) => this.goToPage(page),
      onItemsPerPageChange: (limit: number) => this.setPageSize(limit),
    };
  }

  /**
   * Check if there are more activities to load
   */
  hasMoreActivities(): boolean {
    return this.state.pagination.page < this.state.pagination.totalPages;
  }

  /**
   * Check if currently loading
   */
  isLoading(): boolean {
    return this.state.isLoading;
  }

  /**
   * Get error state
   */
  getError(): string | null {
    return this.state.error?.message || null;
  }

  /**
   * Check if filters are active
   */
  hasActiveFilters(): boolean {
    const filters = this.state.filters;
    return !!(filters.actionType || filters.actorType || filters.startDate || filters.endDate);
  }

  /**
   * Get activity statistics
   */
  getActivityStats(): {
    total: number;
    today: number;
    thisWeek: number;
    averagePerDay: number;
  } {
    const total = this.state.activities.length;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayCount = this.state.activities.filter(activity =>
      new Date(activity.timestamp) >= today
    ).length;

    const thisWeekCount = this.state.activities.filter(activity =>
      new Date(activity.timestamp) >= weekAgo
    ).length;

    const averagePerDay = thisWeekCount / 7;

    return {
      total,
      today: todayCount,
      thisWeek: thisWeekCount,
      averagePerDay: Math.round(averagePerDay * 10) / 10,
    };
  }

  // Private Methods

  private setState(updates: Partial<ContainerActivityState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in ContainerActivityViewModel listener:', error);
      }
    });
  }
}
