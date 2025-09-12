// Container Metrics ViewModel - Manages metrics display and real-time updates
import { ContainerMetricsDisplay, MetricCardModel, TimeRangeValue } from '../types';
import { 
  transformMetricsToDisplay,
  transformMetricsToCardModels,
  formatMetricValue,
} from '../services/dataTransformers';
import { DashboardMetrics } from '../../../api/containerApiService';

/**
 * ViewModel for container metrics display and management
 */
export class ContainerMetricsViewModel {
  private metrics: ContainerMetricsDisplay | null = null;
  private timeRange: TimeRangeValue = 'week';
  private isLoading = false;
  private error: string | null = null;
  private listeners: Set<() => void> = new Set();

  constructor(initialMetrics?: DashboardMetrics) {
    if (initialMetrics) {
      this.metrics = transformMetricsToDisplay(initialMetrics);
    }
  }

  // State Management

  /**
   * Update metrics data
   */
  updateMetrics(metricsData: DashboardMetrics): void {
    this.metrics = transformMetricsToDisplay(metricsData);
    this.notifyListeners();
  }

  /**
   * Set loading state
   */
  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.notifyListeners();
  }

  /**
   * Set error state
   */
  setError(error: string | null): void {
    this.error = error;
    this.notifyListeners();
  }

  /**
   * Update time range
   */
  setTimeRange(timeRange: TimeRangeValue): void {
    this.timeRange = timeRange;
    this.notifyListeners();
  }

  /**
   * Subscribe to changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Getters for UI Components

  /**
   * Get metric cards for KPI display
   */
  getMetricCards(): MetricCardModel[] {
    if (!this.metrics) return [];
    return transformMetricsToCardModels(this.metrics);
  }

  /**
   * Get air temperature card data
   */
  getTemperatureCard(): MetricCardModel | null {
    if (!this.metrics) return null;
    
    const temp = this.metrics.airTemperature;
    return {
      title: 'Air Temperature',
      icon: '🌡️',
      currentValue: temp.current,
      targetValue: temp.target,
      unit: temp.unit,
      format: 'temperature',
      trend: this.calculateTrend(temp.current, temp.target),
    };
  }

  /**
   * Get humidity card data
   */
  getHumidityCard(): MetricCardModel | null {
    if (!this.metrics) return null;
    
    const humidity = this.metrics.humidity;
    return {
      title: 'Humidity',
      icon: '💧',
      currentValue: humidity.current,
      targetValue: humidity.target,
      unit: humidity.unit,
      format: 'percentage',
      trend: this.calculateTrend(humidity.current, humidity.target),
    };
  }

  /**
   * Get CO2 card data
   */
  getCO2Card(): MetricCardModel | null {
    if (!this.metrics) return null;
    
    const co2 = this.metrics.co2;
    return {
      title: 'CO₂ Level',
      icon: '🫧',
      currentValue: co2.current,
      targetValue: co2.target,
      unit: co2.unit,
      format: 'decimal',
      trend: this.calculateTrend(co2.current, co2.target),
    };
  }

  /**
   * Get yield card data
   */
  getYieldCard(): MetricCardModel | null {
    if (!this.metrics) return null;
    
    const yieldData = this.metrics.yield;
    return {
      title: 'Total Yield',
      icon: '🌱',
      currentValue: yieldData.total,
      unit: 'kg',
      format: 'kg',
      trend: this.calculateYieldTrend(yieldData.chartData),
    };
  }

  /**
   * Get yield chart data for visualization
   */
  getYieldChartData() {
    if (!this.metrics?.yield.chartData) return [];
    
    return this.metrics.yield.chartData.map(point => ({
      date: new Date(point.date).toLocaleDateString(),
      value: point.value,
      isCurrentPeriod: point.is_current_period,
      isFuture: point.is_future,
    }));
  }

  /**
   * Get space utilization chart data
   */
  getUtilizationChartData() {
    if (!this.metrics?.spaceUtilization.chartData) return [];
    
    return this.metrics.spaceUtilization.chartData.map(point => ({
      date: new Date(point.date).toLocaleDateString(),
      nursery: point.nursery_value,
      cultivation: point.cultivation_value,
      isCurrentPeriod: point.is_current_period,
      isFuture: point.is_future,
    }));
  }

  /**
   * Get utilization summary
   */
  getUtilizationSummary() {
    if (!this.metrics) return null;
    
    const util = this.metrics.spaceUtilization;
    return {
      nurseryStation: {
        value: util.nurseryStation,
        formatted: formatMetricValue(util.nurseryStation, 'percentage'),
        status: this.getUtilizationStatus(util.nurseryStation),
      },
      cultivationArea: {
        value: util.cultivationArea,
        formatted: formatMetricValue(util.cultivationArea, 'percentage'),
        status: this.getUtilizationStatus(util.cultivationArea),
      },
      total: {
        value: (util.nurseryStation + util.cultivationArea) / 2,
        formatted: formatMetricValue((util.nurseryStation + util.cultivationArea) / 2, 'percentage'),
      },
    };
  }

  /**
   * Get current metrics status
   */
  getMetricsStatus(): {
    overall: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  } {
    if (!this.metrics) {
      return {
        overall: 'critical',
        issues: ['No metrics data available'],
        recommendations: ['Check system connectivity'],
      };
    }

    const issues: string[] = [];
    const recommendations: string[] = [];
    let criticalCount = 0;
    let warningCount = 0;

    // Check temperature
    if (this.metrics.airTemperature.status === 'critical') {
      criticalCount++;
      issues.push('Air temperature is outside safe range');
      recommendations.push('Check HVAC system and ventilation');
    } else if (this.metrics.airTemperature.status === 'warning') {
      warningCount++;
      issues.push('Air temperature needs attention');
      recommendations.push('Monitor temperature trends');
    }

    // Check humidity
    if (this.metrics.humidity.status === 'critical') {
      criticalCount++;
      issues.push('Humidity levels are critical');
      recommendations.push('Check dehumidifier/humidifier systems');
    } else if (this.metrics.humidity.status === 'warning') {
      warningCount++;
      issues.push('Humidity levels need monitoring');
      recommendations.push('Adjust humidity controls');
    }

    // Check CO2
    if (this.metrics.co2.status === 'critical') {
      criticalCount++;
      issues.push('CO₂ levels are dangerous');
      recommendations.push('Improve ventilation immediately');
    } else if (this.metrics.co2.status === 'warning') {
      warningCount++;
      issues.push('CO₂ levels elevated');
      recommendations.push('Increase air circulation');
    }

    const overall = criticalCount > 0 ? 'critical' : 
                   warningCount > 0 ? 'warning' : 'healthy';

    return { overall, issues, recommendations };
  }

  /**
   * Get time range display options
   */
  getTimeRangeOptions() {
    return [
      { label: 'Week', value: 'week', active: this.timeRange === 'week' },
      { label: 'Month', value: 'month', active: this.timeRange === 'month' },
      { label: 'Quarter', value: 'quarter', active: this.timeRange === 'quarter' },
      { label: 'Year', value: 'year', active: this.timeRange === 'year' },
    ];
  }

  /**
   * Check if metrics are stale
   */
  isDataStale(): boolean {
    // In a real app, would check timestamp of metrics data
    return false; // TODO: Implement based on last update time
  }

  /**
   * Get loading state
   */
  isLoadingMetrics(): boolean {
    return this.isLoading;
  }

  /**
   * Get error state
   */
  getError(): string | null {
    return this.error;
  }

  // Private Methods

  private calculateTrend(current: number, target?: number): {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    isPositive: boolean;
  } | undefined {
    if (!target) return undefined;
    
    const difference = current - target;
    const percentage = Math.abs((difference / target) * 100);
    
    if (Math.abs(difference) < target * 0.02) {
      return {
        direction: 'stable',
        percentage: 0,
        isPositive: true,
      };
    }
    
    return {
      direction: difference > 0 ? 'up' : 'down',
      percentage,
      isPositive: Math.abs(difference) < target * 0.1,
    };
  }

  private calculateYieldTrend(chartData: any[]): {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    isPositive: boolean;
  } {
    if (chartData.length < 2) {
      return { direction: 'stable', percentage: 0, isPositive: true };
    }

    const currentData = chartData.filter(d => d.is_current_period);
    const previousData = chartData.filter(d => !d.is_current_period && !d.is_future);
    
    if (currentData.length === 0 || previousData.length === 0) {
      return { direction: 'stable', percentage: 0, isPositive: true };
    }

    const currentAvg = currentData.reduce((sum, d) => sum + d.value, 0) / currentData.length;
    const previousAvg = previousData.slice(-currentData.length)
      .reduce((sum, d) => sum + d.value, 0) / Math.min(currentData.length, previousData.length);

    const difference = currentAvg - previousAvg;
    const percentage = Math.abs((difference / previousAvg) * 100);

    return {
      direction: difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable',
      percentage,
      isPositive: difference >= 0,
    };
  }

  private getUtilizationStatus(utilization: number): 'low' | 'optimal' | 'high' {
    if (utilization < 60) return 'low';
    if (utilization > 90) return 'high';
    return 'optimal';
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in ContainerMetricsViewModel listener:', error);
      }
    });
  }
}
