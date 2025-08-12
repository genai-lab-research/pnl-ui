// Performance API Adapter
// Adapts backend performance metrics API responses to domain models

import { containerService } from '../../../api';
import { PerformanceMetricsDomainModel, TimeRangeType } from '../models';
import { MetricsFilterCriteria } from '../../../types/metrics';

export interface PerformanceResult {
  performance: PerformanceMetricsDomainModel | null;
  error?: string;
}

export interface ContainerTrendResult {
  containerName: string;
  trendData: Array<{
    date: Date;
    yieldKg: number;
    spaceUtilizationPct: number;
    airTemperature: number;
    humidity: number;
    co2: number;
  }>;
  error?: string;
}

export class PerformanceApiAdapter {
  private static instance: PerformanceApiAdapter;

  private constructor() {}

  public static getInstance(): PerformanceApiAdapter {
    if (!PerformanceApiAdapter.instance) {
      PerformanceApiAdapter.instance = new PerformanceApiAdapter();
    }
    return PerformanceApiAdapter.instance;
  }

  /**
   * Get performance metrics with time range and container type filtering
   */
  async getPerformanceMetrics(
    timeRange: TimeRangeType = 'week',
    containerType: 'physical' | 'virtual' | 'all' = 'all',
    containerIds?: number[]
  ): Promise<PerformanceResult> {
    try {
      const filters: MetricsFilterCriteria = {
        timeRange,
        type: containerType,
        containerIds: containerIds?.join(',') || undefined
      };

      const response = await containerService.getPerformanceMetrics(filters);
      const performance = PerformanceMetricsDomainModel.fromApiResponse(response);
      
      return { performance };
    } catch (error) {
      return {
        performance: null,
        error: error instanceof Error ? error.message : 'Failed to fetch performance metrics'
      };
    }
  }

  /**
   * Get performance metrics for current dashboard state
   */
  async getDashboardMetrics(
    timeRange: TimeRangeType,
    appliedFilters?: {
      containerType?: 'physical' | 'virtual' | 'all';
      tenantId?: number;
      purpose?: string;
      status?: string;
    }
  ): Promise<PerformanceResult> {
    try {
      const filters: MetricsFilterCriteria = {
        timeRange,
        type: appliedFilters?.containerType || 'all'
      };

      // Note: Backend API might not support all filter combinations
      // In a real implementation, you might need to filter client-side
      // or enhance the backend API

      const response = await containerService.getPerformanceMetrics(filters);
      const performance = PerformanceMetricsDomainModel.fromApiResponse(response);
      
      return { performance };
    } catch (error) {
      return {
        performance: null,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard metrics'
      };
    }
  }

  /**
   * Get performance trend data for a specific container
   */
  async getContainerTrend(
    containerId: number,
    days: number = 30
  ): Promise<ContainerTrendResult> {
    try {
      const response = await containerService.getContainerMetrics(containerId, days);
      
      const trendData = response.trend_data.map(point => ({
        date: new Date(point.date),
        yieldKg: point.yield_kg,
        spaceUtilizationPct: point.space_utilization_pct,
        airTemperature: point.air_temperature,
        humidity: point.humidity,
        co2: point.co2
      }));

      return {
        containerName: response.container_name,
        trendData
      };
    } catch (error) {
      return {
        containerName: '',
        trendData: [],
        error: error instanceof Error ? error.message : 'Failed to fetch container trend data'
      };
    }
  }

  /**
   * Get performance comparison between physical and virtual containers
   */
  async getPerformanceComparison(
    timeRange: TimeRangeType = 'week'
  ): Promise<{
    physical: PerformanceMetricsDomainModel | null;
    virtual: PerformanceMetricsDomainModel | null;
    comparison: {
      yieldDifference: number;
      spaceUtilizationDifference: number;
      physicalAdvantage: boolean;
    } | null;
    error?: string;
  }> {
    try {
      const [physicalResult, virtualResult] = await Promise.all([
        this.getPerformanceMetrics(timeRange, 'physical'),
        this.getPerformanceMetrics(timeRange, 'virtual')
      ]);

      if (physicalResult.error || virtualResult.error) {
        return {
          physical: null,
          virtual: null,
          comparison: null,
          error: physicalResult.error || virtualResult.error
        };
      }

      const physical = physicalResult.performance;
      const virtual = virtualResult.performance;

      let comparison = null;
      if (physical && virtual && physical.physical?.yield && virtual.virtual?.yield && 
          physical.physical?.spaceUtilization && virtual.virtual?.spaceUtilization) {
        const yieldDifference = physical.physical.yield.average - virtual.virtual.yield.average;
        const spaceUtilizationDifference = 
          physical.physical.spaceUtilization.average - virtual.virtual.spaceUtilization.average;
        
        comparison = {
          yieldDifference,
          spaceUtilizationDifference,
          physicalAdvantage: yieldDifference > 0 && spaceUtilizationDifference > 0
        };
      }

      return {
        physical,
        virtual,
        comparison
      };
    } catch (error) {
      return {
        physical: null,
        virtual: null,
        comparison: null,
        error: error instanceof Error ? error.message : 'Failed to fetch performance comparison'
      };
    }
  }

  /**
   * Get aggregated performance metrics for dashboard cards
   */
  async getCardMetrics(
    timeRange: TimeRangeType,
    selectedContainerType: 'all' | 'physical' | 'virtual' = 'all'
  ): Promise<{
    physical: {
      count: number;
      avgYield: number;
      totalYield: number;
      avgSpaceUtilization: number;
      chartData: {
        yield: Array<{ date: string; value: number; isCurrent: boolean }>;
        spaceUtilization: Array<{ date: string; value: number; isCurrent: boolean }>;
      };
    };
    virtual: {
      count: number;
      avgYield: number;
      totalYield: number;
      avgSpaceUtilization: number;
      chartData: {
        yield: Array<{ date: string; value: number; isCurrent: boolean }>;
        spaceUtilization: Array<{ date: string; value: number; isCurrent: boolean }>;
      };
    };
    timeRange: {
      type: TimeRangeType;
      label: string;
      startDate: Date;
      endDate: Date;
    };
    selectedType: 'all' | 'physical' | 'virtual';
    error?: string;
  }> {
    try {
      const result = await this.getPerformanceMetrics(timeRange, 'all');
      
      if (result.error || !result.performance) {
        throw new Error(result.error || 'No performance data available');
      }

      const performance = result.performance;

      return {
        physical: {
          count: performance.physical.containerCount,
          avgYield: performance.physical.yield.average,
          totalYield: performance.physical.yield.total,
          avgSpaceUtilization: performance.physical.spaceUtilization.average,
          chartData: {
            yield: performance.physical.yield.chartData.map(point => ({
              date: point.date,
              value: point.value,
              isCurrent: point.is_current_period
            })),
            spaceUtilization: performance.physical.spaceUtilization.chartData.map(point => ({
              date: point.date,
              value: point.value,
              isCurrent: point.is_current_period
            }))
          }
        },
        virtual: {
          count: performance.virtual.containerCount,
          avgYield: performance.virtual.yield.average,
          totalYield: performance.virtual.yield.total,
          avgSpaceUtilization: performance.virtual.spaceUtilization.average,
          chartData: {
            yield: performance.virtual.yield.chartData.map(point => ({
              date: point.date,
              value: point.value,
              isCurrent: point.is_current_period
            })),
            spaceUtilization: performance.virtual.spaceUtilization.chartData.map(point => ({
              date: point.date,
              value: point.value,
              isCurrent: point.is_current_period
            }))
          }
        },
        timeRange: {
          type: performance.timeRange.type,
          label: performance.getTimeRangeLabel(),
          startDate: performance.timeRange.startDate,
          endDate: performance.timeRange.endDate
        },
        selectedType: selectedContainerType
      };
    } catch (error) {
      // Return empty structure with error
      return {
        physical: {
          count: 0,
          avgYield: 0,
          totalYield: 0,
          avgSpaceUtilization: 0,
          chartData: { yield: [], spaceUtilization: [] }
        },
        virtual: {
          count: 0,
          avgYield: 0,
          totalYield: 0,
          avgSpaceUtilization: 0,
          chartData: { yield: [], spaceUtilization: [] }
        },
        timeRange: {
          type: timeRange,
          label: 'Current Period',
          startDate: new Date(),
          endDate: new Date()
        },
        selectedType: selectedContainerType,
        error: error instanceof Error ? error.message : 'Failed to fetch card metrics'
      };
    }
  }

  /**
   * Validate if performance data is current
   */
  isDataCurrent(performance: PerformanceMetricsDomainModel): boolean {
    return !performance.isDataStale();
  }

  /**
   * Get supported time ranges
   */
  getSupportedTimeRanges(): Array<{ value: TimeRangeType; label: string }> {
    return [
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
      { value: 'quarter', label: 'Quarter' },
      { value: 'year', label: 'Year' }
    ];
  }
}

export const performanceApiAdapter = PerformanceApiAdapter.getInstance();
