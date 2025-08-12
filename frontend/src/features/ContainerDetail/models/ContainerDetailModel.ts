/**
 * Container Detail Domain Model
 * Contains business logic and calculations for container data
 */

import type {
  CropSummaryRow,
  ActivityLogEntry,
  ContainerInfo,
  DashboardMetrics,
  ContainerSettings,
} from '../types/container-detail';
import type {
  MetricSnapshot,
  MetricTrend,
  TrendDirection,
  MetricThresholds,
} from '../types/metrics';

export class ContainerDetailModel {
  // Metric thresholds for validation and alerts
  private static readonly METRIC_THRESHOLDS: MetricThresholds = {
    airTemperature: {
      min: 18,
      max: 28,
      optimal: 23,
    },
    humidity: {
      min: 40,
      max: 70,
      optimal: 55,
    },
    co2: {
      min: 400,
      max: 1200,
      optimal: 800,
    },
  };

  /**
   * Calculate metric trends by comparing current and previous values
   */
  static calculateMetricTrends(
    currentMetrics: DashboardMetrics,
    previousMetrics: DashboardMetrics | null
  ): Map<string, MetricTrend> {
    const trends = new Map<string, MetricTrend>();

    if (!previousMetrics) {
      return trends;
    }

    // Air Temperature
    trends.set('airTemperature', this.calculateTrend(
      'airTemperature',
      currentMetrics.airTemperature,
      previousMetrics.airTemperature
    ));

    // Humidity
    trends.set('humidity', this.calculateTrend(
      'humidity',
      currentMetrics.humidity,
      previousMetrics.humidity
    ));

    // CO2
    trends.set('co2', this.calculateTrend(
      'co2',
      currentMetrics.co2,
      previousMetrics.co2
    ));

    // Yield
    trends.set('yield', this.calculateTrend(
      'yield',
      currentMetrics.yield.total,
      previousMetrics.yield.total
    ));

    // Space Utilization
    const currentUtilization = (currentMetrics.spaceUtilization.nurseryStation + 
                               currentMetrics.spaceUtilization.cultivationArea) / 2;
    const previousUtilization = (previousMetrics.spaceUtilization.nurseryStation + 
                                previousMetrics.spaceUtilization.cultivationArea) / 2;
    
    trends.set('spaceUtilization', this.calculateTrend(
      'spaceUtilization',
      currentUtilization,
      previousUtilization
    ));

    return trends;
  }

  /**
   * Calculate individual metric trend
   */
  private static calculateTrend(
    metricName: string,
    currentValue: number,
    previousValue: number
  ): MetricTrend {
    const change = currentValue - previousValue;
    const changePercentage = previousValue !== 0 
      ? (change / previousValue) * 100 
      : 0;

    let trend: TrendDirection = 'stable';
    if (Math.abs(changePercentage) < 1) {
      trend = 'stable';
    } else if (change > 0) {
      trend = 'up';
    } else {
      trend = 'down';
    }

    return {
      metric: metricName as MetricType,
      currentValue,
      previousValue,
      trend,
      changePercentage: Math.round(changePercentage * 10) / 10, // Round to 1 decimal
    };
  }

  /**
   * Check if metrics are within acceptable thresholds
   */
  static checkMetricThresholds(metrics: DashboardMetrics): Map<string, boolean> {
    const results = new Map<string, boolean>();

    results.set('airTemperature', 
      metrics.airTemperature >= this.METRIC_THRESHOLDS.airTemperature.min &&
      metrics.airTemperature <= this.METRIC_THRESHOLDS.airTemperature.max
    );

    results.set('humidity',
      metrics.humidity >= this.METRIC_THRESHOLDS.humidity.min &&
      metrics.humidity <= this.METRIC_THRESHOLDS.humidity.max
    );

    results.set('co2',
      metrics.co2 >= this.METRIC_THRESHOLDS.co2.min &&
      metrics.co2 <= this.METRIC_THRESHOLDS.co2.max
    );

    return results;
  }

  /**
   * Calculate total crop count across all types
   */
  static calculateTotalCropCount(crops: CropSummaryRow[]): number {
    return crops.reduce((total, crop) => 
      total + crop.nurseryStationCount + crop.cultivationAreaCount, 0
    );
  }

  /**
   * Calculate total overdue crops
   */
  static calculateTotalOverdueCrops(crops: CropSummaryRow[]): number {
    return crops.reduce((total, crop) => total + crop.overdueCount, 0);
  }

  /**
   * Get crops that need attention (have overdue items)
   */
  static getCropsNeedingAttention(crops: CropSummaryRow[]): CropSummaryRow[] {
    return crops.filter(crop => crop.overdueCount > 0)
      .sort((a, b) => b.overdueCount - a.overdueCount);
  }

  /**
   * Group activities by date
   */
  static groupActivitiesByDate(activities: ActivityLogEntry[]): Map<string, ActivityLogEntry[]> {
    const grouped = new Map<string, ActivityLogEntry[]>();

    activities.forEach(activity => {
      const dateKey = activity.timestamp.toDateString();
      const existing = grouped.get(dateKey) || [];
      existing.push(activity);
      grouped.set(dateKey, existing);
    });

    return grouped;
  }

  /**
   * Filter activities by time range
   */
  static filterActivitiesByTimeRange(
    activities: ActivityLogEntry[],
    startDate: Date,
    endDate: Date
  ): ActivityLogEntry[] {
    return activities.filter(activity => 
      activity.timestamp >= startDate && activity.timestamp <= endDate
    );
  }

  /**
   * Calculate container health score based on metrics
   */
  static calculateHealthScore(metrics: DashboardMetrics): number {
    const thresholds = this.checkMetricThresholds(metrics);
    let score = 100;

    // Deduct points for metrics outside thresholds
    thresholds.forEach((isWithinThreshold, metric) => {
      if (!isWithinThreshold) {
        score -= 20;
      }
    });

    // Additional deductions based on space utilization
    const avgUtilization = (metrics.spaceUtilization.nurseryStation + 
                           metrics.spaceUtilization.cultivationArea) / 2;
    
    if (avgUtilization < 30) {
      score -= 10; // Under-utilized
    } else if (avgUtilization > 90) {
      score -= 5; // Over-utilized
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate average metric values from snapshots
   */
  static calculateAverageMetrics(snapshots: MetricSnapshot[]): Partial<MetricSnapshot> | null {
    if (snapshots.length === 0) {
      return null;
    }

    const sum = snapshots.reduce((acc, snapshot) => ({
      airTemperature: acc.airTemperature + snapshot.airTemperature,
      humidity: acc.humidity + snapshot.humidity,
      co2: acc.co2 + snapshot.co2,
      yieldKg: acc.yieldKg + snapshot.yieldKg,
      spaceUtilizationPct: acc.spaceUtilizationPct + snapshot.spaceUtilizationPct,
    }), {
      airTemperature: 0,
      humidity: 0,
      co2: 0,
      yieldKg: 0,
      spaceUtilizationPct: 0,
    });

    const count = snapshots.length;

    return {
      airTemperature: sum.airTemperature / count,
      humidity: sum.humidity / count,
      co2: sum.co2 / count,
      yieldKg: sum.yieldKg / count,
      spaceUtilizationPct: sum.spaceUtilizationPct / count,
    };
  }

  /**
   * Validate container settings before update
   */
  static validateContainerSettings(settings: Partial<ContainerSettings>): string[] {
    const errors: string[] = [];

    if (settings.tenantId !== undefined && settings.tenantId <= 0) {
      errors.push('Invalid tenant ID');
    }

    if (settings.purpose && !['development', 'research', 'production'].includes(settings.purpose)) {
      errors.push('Invalid container purpose');
    }

    if (settings.location) {
      if (!settings.location.city || !settings.location.country) {
        errors.push('Location must include city and country');
      }
    }

    if (settings.notes !== undefined && settings.notes.length > 1000) {
      errors.push('Notes cannot exceed 1000 characters');
    }

    return errors;
  }

  /**
   * Calculate days since last activity
   */
  static daysSinceLastActivity(activities: ActivityLogEntry[]): number | null {
    if (activities.length === 0) {
      return null;
    }

    const mostRecent = activities.reduce((latest, activity) => 
      activity.timestamp > latest.timestamp ? activity : latest
    );

    const now = new Date();
    const diffMs = now.getTime() - mostRecent.timestamp.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Get container status color based on health
   */
  static getContainerStatusColor(container: ContainerInfo, healthScore: number): string {
    if (container.status === 'inactive') {
      return 'gray';
    }

    if (container.status === 'maintenance') {
      return 'orange';
    }

    if (healthScore >= 80) {
      return 'green';
    } else if (healthScore >= 60) {
      return 'yellow';
    } else {
      return 'red';
    }
  }

  /**
   * Format activity description for display
   */
  static formatActivityDescription(activity: ActivityLogEntry): string {
    const actor = activity.actorType === 'user' 
      ? `User ${activity.actorId}` 
      : activity.actorType === 'system'
      ? 'System'
      : `Device ${activity.actorId}`;

    return `${actor}: ${activity.description}`;
  }
}