import type { 
  PerformanceMetrics
} from '../types';

export class ContainerMetricsOverviewViewModel {

  private selectedTimeRange: 'week' | 'month' | 'quarter' | 'year' = 'week';
  private selectedContainerType: 'all' | 'physical' | 'virtual' = 'all';

  // Business logic methods
  calculateMetricTrends(currentData: PerformanceMetrics, previousData?: PerformanceMetrics): {
    physicalTrend: 'up' | 'down' | 'stable';
    virtualTrend: 'up' | 'down' | 'stable';
  } {
    if (!previousData) {
      return { physicalTrend: 'stable', virtualTrend: 'stable' };
    }

    const physicalTrend = this.calculateTrend(
      currentData.physical.yield.average,
      previousData.physical.yield.average
    );
    
    const virtualTrend = this.calculateTrend(
      currentData.virtual.yield.average,
      previousData.virtual.yield.average
    );

    return { physicalTrend, virtualTrend };
  }

  private calculateTrend(current: number, previous: number): 'up' | 'down' | 'stable' {
    const threshold = 0.05; // 5% threshold for considering it stable
    const change = (current - previous) / previous;

    if (Math.abs(change) < threshold) return 'stable';
    return change > 0 ? 'up' : 'down';
  }

  validateTimeRange(range: string): boolean {
    return ['week', 'month', 'quarter', 'year'].includes(range);
  }

  getOptimalRefreshInterval(timeRange: 'week' | 'month' | 'quarter' | 'year'): number {
    switch (timeRange) {
      case 'week':
        return 60000; // 1 minute
      case 'month':
        return 300000; // 5 minutes
      case 'quarter':
        return 900000; // 15 minutes
      case 'year':
        return 3600000; // 1 hour
      default:
        return 300000;
    }
  }
}