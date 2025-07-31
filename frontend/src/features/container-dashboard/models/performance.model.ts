// Performance Metrics Domain Model
// Business logic for performance data analysis

import { PerformanceMetrics, DataPoint } from '../../../types/metrics';

export type TimeRangeType = 'week' | 'month' | 'quarter' | 'year';

export interface PerformanceData {
  containerCount: number;
  yield: {
    average: number;
    total: number;
    chartData: DataPoint[];
  };
  spaceUtilization: {
    average: number;
    chartData: DataPoint[];
  };
}

export class PerformanceMetricsDomainModel {
  constructor(
    public readonly physical: PerformanceData,
    public readonly virtual: PerformanceData,
    public readonly timeRange: {
      type: TimeRangeType;
      startDate: Date;
      endDate: Date;
    },
    public readonly generatedAt: Date
  ) {}

  static fromApiResponse(metrics: any): PerformanceMetricsDomainModel {
    return new PerformanceMetricsDomainModel(
      {
        containerCount: metrics.physical.container_count,
        yield: {
          average: metrics.physical.yield_?.average || metrics.physical.yield?.average,
          total: metrics.physical.yield_?.total || metrics.physical.yield?.total,
          chartData: metrics.physical.yield_?.chart_data || metrics.physical.yield?.chart_data || []
        },
        spaceUtilization: {
          average: metrics.physical.space_utilization.average,
          chartData: metrics.physical.space_utilization.chart_data
        }
      },
      {
        containerCount: metrics.virtual.container_count,
        yield: {
          average: metrics.virtual.yield_?.average || metrics.virtual.yield?.average,
          total: metrics.virtual.yield_?.total || metrics.virtual.yield?.total,
          chartData: metrics.virtual.yield_?.chart_data || metrics.virtual.yield?.chart_data || []
        },
        spaceUtilization: {
          average: metrics.virtual.space_utilization.average,
          chartData: metrics.virtual.space_utilization.chart_data
        }
      },
      {
        type: metrics.time_range.type as TimeRangeType,
        startDate: new Date(metrics.time_range.start_date),
        endDate: new Date(metrics.time_range.end_date)
      },
      new Date(metrics.generated_at)
    );
  }

  // Business logic methods
  getTotalContainers(): number {
    return this.physical.containerCount + this.virtual.containerCount;
  }

  getPhysicalRatio(): number {
    const total = this.getTotalContainers();
    return total > 0 ? this.physical.containerCount / total : 0;
  }

  getVirtualRatio(): number {
    const total = this.getTotalContainers();
    return total > 0 ? this.virtual.containerCount / total : 0;
  }

  getTotalYield(): number {
    return this.physical.yield.total + this.virtual.yield.total;
  }

  getAverageYield(): number {
    const totalContainers = this.getTotalContainers();
    if (totalContainers === 0) return 0;
    
    const weightedAverage = 
      (this.physical.yield.average * this.physical.containerCount) +
      (this.virtual.yield.average * this.virtual.containerCount);
    
    return weightedAverage / totalContainers;
  }

  getAverageSpaceUtilization(): number {
    const totalContainers = this.getTotalContainers();
    if (totalContainers === 0) return 0;
    
    const weightedAverage = 
      (this.physical.spaceUtilization.average * this.physical.containerCount) +
      (this.virtual.spaceUtilization.average * this.virtual.containerCount);
    
    return weightedAverage / totalContainers;
  }

  getPerformanceByType(type: 'physical' | 'virtual'): PerformanceData {
    return type === 'physical' ? this.physical : this.virtual;
  }

  getCurrentPeriodData(type: 'physical' | 'virtual', metric: 'yield' | 'spaceUtilization'): DataPoint | null {
    const data = this.getPerformanceByType(type);
    const chartData = metric === 'yield' ? data.yield.chartData : data.spaceUtilization.chartData;
    return chartData.find(point => point.is_current_period) || null;
  }

  getTrendDirection(type: 'physical' | 'virtual', metric: 'yield' | 'spaceUtilization'): 'up' | 'down' | 'stable' {
    const data = this.getPerformanceByType(type);
    const chartData = metric === 'yield' ? data.yield.chartData : data.spaceUtilization.chartData;
    
    if (chartData.length < 2) return 'stable';
    
    const recent = chartData.slice(-2);
    const [previous, current] = recent;
    
    if (current.value > previous.value * 1.05) return 'up';
    if (current.value < previous.value * 0.95) return 'down';
    return 'stable';
  }

  getTimeRangeLabel(): string {
    switch (this.timeRange.type) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'quarter':
        return 'This Quarter';
      case 'year':
        return 'This Year';
      default:
        return 'Current Period';
    }
  }

  isDataStale(): boolean {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    return this.generatedAt < fiveMinutesAgo;
  }

  hasData(): boolean {
    return this.getTotalContainers() > 0;
  }
}
