// Data Transformation Utilities for Container Detail
import { 
  ContainerOverviewResponse,
  ActivityLogsResponse,
  DashboardMetrics,
  ContainerInfo,
} from '../../../api/containerApiService';
import { ActivityLog } from '../../../types/containers';
import {
  ContainerDetailData,
  ContainerMetricsDisplay,
  ContainerActivityState,
  YieldChartData,
  UtilizationChartData,
  MetricCardModel,
} from '../types';

/**
 * Transform API response to domain data model
 */
export function transformContainerOverview(response: ContainerOverviewResponse): ContainerDetailData {
  return {
    container: normalizeContainerData(response.container),
    dashboard: response.dashboard_metrics,
    crops: response.crops_summary,
    recentActivity: response.recent_activity,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Normalize container data to ensure ecosystem_settings are properly formatted
 */
function normalizeContainerData(container: any): any {
  if (!container) return container;
  
  // Normalize ecosystem_settings to handle both object and string formats
  if (container.ecosystem_settings) {
    const normalizeEcosystemValue = (value: any): string | null => {
      if (!value) return null;
      if (typeof value === 'string') return value;
      if (typeof value === 'object') {
        // Handle object format from backend seed data
        if (value.enabled === true) {
          // Return a default environment string for enabled integrations
          return 'production';
        } else if (value.enabled === false) {
          return null;
        }
        // Fallback to environment property if it exists
        return value.environment || null;
      }
      return null;
    };

    container.ecosystem_settings = {
      ...container.ecosystem_settings,
      fa: normalizeEcosystemValue(container.ecosystem_settings.fa),
      pya: normalizeEcosystemValue(container.ecosystem_settings.pya),
      aws: normalizeEcosystemValue(container.ecosystem_settings.aws),
      mbai: normalizeEcosystemValue(container.ecosystem_settings.mbai),
    };
  }
  
  return container;
}

/**
 * Transform dashboard metrics to UI display format
 */
export function transformMetricsToDisplay(metrics: DashboardMetrics): ContainerMetricsDisplay {
  return {
    airTemperature: {
      current: metrics.air_temperature,
      target: 22, // TODO: Get from container settings
      unit: '°C',
      status: getMetricStatus(metrics.air_temperature, 18, 25),
    },
    humidity: {
      current: metrics.humidity,
      target: 65, // TODO: Get from container settings
      unit: '%',
      status: getMetricStatus(metrics.humidity, 50, 80),
    },
    co2: {
      current: metrics.co2,
      target: 400, // TODO: Get from container settings
      unit: 'ppm',
      status: getMetricStatus(metrics.co2, 300, 500),
    },
    yield: transformYieldMetrics(metrics.yield_metrics),
    spaceUtilization: transformUtilizationMetrics(metrics.space_utilization),
  };
}

/**
 * Transform yield metrics for chart display
 */
function transformYieldMetrics(yieldMetrics: any): YieldChartData {
  return {
    average: yieldMetrics.average,
    total: yieldMetrics.total,
    chartData: yieldMetrics.chart_data?.map((point: any) => ({
      date: point.date,
      value: point.value,
      is_current_period: point.is_current_period,
      is_future: point.is_future,
    })) || [],
  };
}

/**
 * Transform space utilization metrics for chart display
 */
function transformUtilizationMetrics(utilizationMetrics: any): UtilizationChartData {
  return {
    nurseryStation: utilizationMetrics.nursery_station,
    cultivationArea: utilizationMetrics.cultivation_area,
    chartData: utilizationMetrics.chart_data?.map((point: any) => ({
      date: point.date,
      nursery_value: point.nursery_value,
      cultivation_value: point.cultivation_value,
      is_current_period: point.is_current_period,
      is_future: point.is_future,
    })) || [],
  };
}

/**
 * Transform activity logs response to UI state
 */
export function transformActivityLogsResponse(response: ActivityLogsResponse): ContainerActivityState {
  return {
    activities: response.activities,
    pagination: {
      page: response.pagination.page,
      limit: response.pagination.limit,
      total: response.pagination.total,
      totalPages: response.pagination.total_pages,
    },
    filters: {},
    isLoading: false,
    error: null,
  };
}

/**
 * Transform metrics to KPI Monitor Card models
 */
export function transformMetricsToCardModels(metrics: ContainerMetricsDisplay): MetricCardModel[] {
  return [
    {
      title: 'Air Temperature',
      icon: '🌡️', // TODO: Replace with actual icon component
      currentValue: metrics.airTemperature.current,
      targetValue: metrics.airTemperature.target,
      unit: metrics.airTemperature.unit,
      format: 'temperature',
      trend: calculateTrend(metrics.airTemperature.current, metrics.airTemperature.target),
    },
    {
      title: 'Humidity',
      icon: '💧', // TODO: Replace with actual icon component
      currentValue: metrics.humidity.current,
      targetValue: metrics.humidity.target,
      unit: metrics.humidity.unit,
      format: 'percentage',
      trend: calculateTrend(metrics.humidity.current, metrics.humidity.target),
    },
    {
      title: 'CO₂ Level',
      icon: '🫧', // TODO: Replace with actual icon component
      currentValue: metrics.co2.current,
      targetValue: metrics.co2.target,
      unit: metrics.co2.unit,
      format: 'decimal',
      trend: calculateTrend(metrics.co2.current, metrics.co2.target),
    },
    {
      title: 'Yield',
      icon: '🌱', // TODO: Replace with actual icon component
      currentValue: metrics.yield.total,
      unit: 'kg',
      format: 'kg',
      trend: {
        direction: 'up',
        percentage: 12.5, // TODO: Calculate from chart data
        isPositive: true,
      },
    },
  ];
}

/**
 * Transform activity logs to activity item models
 */
export function transformActivityToItemModels(activities: ActivityLog[]): Array<{
  id: number;
  title: string;
  timestamp: string;
  author: string;
  avatarColor?: string;
  actionType: string;
}> {
  return activities.map((activity) => ({
    id: activity.id,
    title: activity.description,
    timestamp: formatActivityTimestamp(activity.timestamp),
    author: activity.actor_id,
    avatarColor: getAvatarColorForActionType(activity.action_type),
    actionType: activity.action_type,
  }));
}

/**
 * Get metric status based on current value and thresholds
 */
function getMetricStatus(current: number, min: number, max: number): 'normal' | 'warning' | 'critical' {
  if (current < min * 0.8 || current > max * 1.2) return 'critical';
  if (current < min || current > max) return 'warning';
  return 'normal';
}

/**
 * Calculate trend information
 */
function calculateTrend(current: number, target?: number): {
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
    isPositive: Math.abs(difference) < target * 0.1, // Within 10% is considered positive
  };
}

/**
 * Format activity timestamp for display
 */
function formatActivityTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;
  
  if (diffHours < 1) {
    const minutes = Math.floor(diffMs / (1000 * 60));
    return `${minutes} minutes ago`;
  }
  
  if (diffDays < 1) {
    return `${Math.floor(diffHours)} hours ago`;
  }
  
  if (diffDays < 7) {
    return `${Math.floor(diffDays)} days ago`;
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get avatar color based on activity action type
 */
function getAvatarColorForActionType(actionType: string): string {
  const colorMap: Record<string, string> = {
    create: '#479F67', // Green
    update: '#3545EE', // Blue
    delete: '#EF4444', // Red
    warning: '#F59E0B', // Yellow
    error: '#EF4444',  // Red
    system: '#6B7280', // Gray
    environment: '#10B981', // Emerald
    harvest: '#F59E0B', // Amber
    maintenance: '#8B5CF6', // Purple
  };
  
  return colorMap[actionType.toLowerCase()] || '#479F67';
}

/**
 * Format metric values with appropriate precision
 */
export function formatMetricValue(value: number, format: 'temperature' | 'percentage' | 'decimal' | 'kg'): string {
  switch (format) {
    case 'temperature':
      return `${value.toFixed(1)}°C`;
    case 'percentage':
      return `${value.toFixed(0)}%`;
    case 'kg':
      return `${value.toFixed(2)} kg`;
    case 'decimal':
    default:
      return value.toFixed(1);
  }
}

/**
 * Validate container settings form data
 */
export function validateContainerSettings(settings: any): {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};
  
  if (!settings.tenant_id || settings.tenant_id <= 0) {
    errors.tenant_id = 'Tenant is required';
  }
  
  if (!settings.purpose) {
    errors.purpose = 'Purpose is required';
  }
  
  if (settings.notes && settings.notes.length > 1000) {
    errors.notes = 'Notes must be less than 1000 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings: Object.keys(warnings).length > 0 ? warnings : undefined,
  };
}
