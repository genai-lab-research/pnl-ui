/**
 * Utility functions for formatting metric values
 */

import type { MetricType, MetricTrend, TrendDirection } from '../types/metrics';

// Temperature formatting
export function formatTemperature(value: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
  if (unit === 'fahrenheit') {
    value = (value * 9/5) + 32;
  }
  return `${value.toFixed(1)}°${unit === 'celsius' ? 'C' : 'F'}`;
}

// Humidity formatting
export function formatHumidity(value: number): string {
  return `${value.toFixed(0)}%`;
}

// CO2 formatting
export function formatCO2(value: number): string {
  return `${value.toFixed(0)} ppm`;
}

// Yield formatting
export function formatYield(value: number, unit: 'kg' | 'lbs' = 'kg'): string {
  if (unit === 'lbs') {
    value = value * 2.20462;
  }
  return `${value.toFixed(1)} ${unit}`;
}

// Space utilization formatting
export function formatSpaceUtilization(value: number): string {
  return `${value.toFixed(0)}%`;
}

// Generic metric formatter
export function formatMetricValue(
  value: number,
  metricType: MetricType,
  options?: {
    temperatureUnit?: 'celsius' | 'fahrenheit';
    yieldUnit?: 'kg' | 'lbs';
  }
): string {
  switch (metricType) {
    case 'airTemperature':
      return formatTemperature(value, options?.temperatureUnit);
    case 'humidity':
      return formatHumidity(value);
    case 'co2':
      return formatCO2(value);
    case 'yield':
      return formatYield(value, options?.yieldUnit);
    case 'spaceUtilization':
      return formatSpaceUtilization(value);
    default:
      return value.toFixed(2);
  }
}

// Format metric trend
export function formatMetricTrend(trend: MetricTrend): {
  value: string;
  change: string;
  direction: TrendDirection;
  color: string;
} {
  const formattedValue = formatMetricValue(trend.currentValue, trend.metric);
  const changePrefix = trend.trend === 'up' ? '+' : trend.trend === 'down' ? '-' : '';
  const changeValue = Math.abs(trend.changePercentage);
  const change = `${changePrefix}${changeValue.toFixed(1)}%`;

  let color = 'gray';
  if (trend.trend === 'up') {
    // For some metrics, up is good (yield), for others it might be bad (CO2)
    color = ['yield', 'spaceUtilization'].includes(trend.metric) ? 'green' : 'orange';
  } else if (trend.trend === 'down') {
    color = ['yield', 'spaceUtilization'].includes(trend.metric) ? 'red' : 'green';
  }

  return {
    value: formattedValue,
    change,
    direction: trend.trend,
    color,
  };
}

// Get metric display name
export function getMetricDisplayName(metricType: MetricType): string {
  const displayNames: Record<MetricType, string> = {
    airTemperature: 'Air Temperature',
    humidity: 'Humidity',
    co2: 'CO₂',
    yield: 'Yield',
    spaceUtilization: 'Space Utilization',
  };

  return displayNames[metricType] || metricType;
}

// Get metric unit
export function getMetricUnit(
  metricType: MetricType,
  options?: {
    temperatureUnit?: 'celsius' | 'fahrenheit';
    yieldUnit?: 'kg' | 'lbs';
  }
): string {
  switch (metricType) {
    case 'airTemperature':
      return options?.temperatureUnit === 'fahrenheit' ? '°F' : '°C';
    case 'humidity':
    case 'spaceUtilization':
      return '%';
    case 'co2':
      return 'ppm';
    case 'yield':
      return options?.yieldUnit || 'kg';
    default:
      return '';
  }
}

// Get metric icon name (for use with icon components)
export function getMetricIconName(metricType: MetricType): string {
  const iconMap: Record<MetricType, string> = {
    airTemperature: 'thermometer',
    humidity: 'water_drop',
    co2: 'air',
    yield: 'agriculture',
    spaceUtilization: 'space_dashboard',
  };

  return iconMap[metricType] || 'analytics';
}

// Get metric status color based on value and thresholds
export function getMetricStatusColor(
  metricType: MetricType,
  value: number,
  thresholds?: {
    min?: number;
    max?: number;
    optimal?: number;
  }
): 'success' | 'warning' | 'error' | 'info' {
  if (!thresholds) {
    return 'info';
  }

  const { min, max, optimal } = thresholds;

  // Check if value is within acceptable range
  if (min !== undefined && value < min) {
    return 'error';
  }
  if (max !== undefined && value > max) {
    return 'error';
  }

  // Check if value is close to optimal
  if (optimal !== undefined) {
    const deviation = Math.abs(value - optimal) / optimal;
    if (deviation < 0.1) {
      return 'success';
    } else if (deviation < 0.2) {
      return 'warning';
    }
  }

  return 'info';
}

// Format large numbers with appropriate units
export function formatLargeNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

// Calculate percentage change
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}