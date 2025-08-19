/**
 * Metric Snapshots Data Models
 * Based on p2_datamodels.md and p2_routing.md specifications
 */

// Metric Snapshot Model
export interface MetricSnapshot {
  id: number;
  container_id: number;
  timestamp: string;
  air_temperature: number;
  humidity: number;
  co2: number;
  yield_kg: number;
  space_utilization_pct: number;
  additional_metrics?: AdditionalMetrics;
}

// Additional metrics that might be captured
export interface AdditionalMetrics {
  soil_temperature?: number;
  soil_moisture?: number;
  ph_level?: number;
  light_intensity?: number;
  water_consumption_liters?: number;
  energy_consumption_kwh?: number;
  nutrient_levels?: NutrientLevels;
  air_quality?: AirQualityMetrics;
  growth_metrics?: GrowthMetrics;
}

export interface NutrientLevels {
  nitrogen_ppm?: number;
  phosphorus_ppm?: number;
  potassium_ppm?: number;
  calcium_ppm?: number;
  magnesium_ppm?: number;
  sulfur_ppm?: number;
  iron_ppm?: number;
}

export interface AirQualityMetrics {
  oxygen_pct?: number;
  carbon_monoxide_ppm?: number;
  particulate_matter_25?: number;
  particulate_matter_10?: number;
  volatile_organic_compounds?: number;
}

export interface GrowthMetrics {
  average_plant_height_cm?: number;
  leaf_area_index?: number;
  biomass_kg?: number;
  growth_rate_cm_per_day?: number;
  flowering_percentage?: number;
  fruit_count?: number;
}

// Filter and query parameters for metric snapshots
export interface MetricSnapshotFilterCriteria {
  container_id?: number | number[];
  start_date?: string;
  end_date?: string;
  metric_types?: MetricType[];
  min_temperature?: number;
  max_temperature?: number;
  min_humidity?: number;
  max_humidity?: number;
  min_co2?: number;
  max_co2?: number;
  aggregation?: MetricAggregation;
  interval?: MetricInterval;
  skip?: number;
  limit?: number;
  sort?: MetricSortField;
  order?: 'asc' | 'desc';
}

export type MetricType = 
  | 'air_temperature'
  | 'humidity'
  | 'co2'
  | 'yield_kg'
  | 'space_utilization_pct'
  | 'soil_temperature'
  | 'soil_moisture'
  | 'ph_level'
  | 'light_intensity'
  | 'water_consumption'
  | 'energy_consumption';

export type MetricAggregation = 
  | 'raw'
  | 'hourly_avg'
  | 'daily_avg'
  | 'weekly_avg'
  | 'monthly_avg'
  | 'min'
  | 'max'
  | 'sum'
  | 'count';

export type MetricInterval = 
  | '1m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '6h'
  | '12h'
  | '1d'
  | '1w'
  | '1M';

export type MetricSortField = 
  | 'timestamp'
  | 'air_temperature'
  | 'humidity'
  | 'co2'
  | 'yield_kg'
  | 'space_utilization_pct';

// Response types
export interface MetricSnapshotListResponse {
  snapshots: MetricSnapshot[];
  total: number;
  skip: number;
  limit: number;
  aggregation_info?: AggregationInfo;
}

export interface AggregationInfo {
  aggregation_type: MetricAggregation;
  interval: MetricInterval;
  data_points_aggregated: number;
  time_range: {
    start: string;
    end: string;
  };
}

// Metric analytics and statistics
export interface MetricStatistics {
  container_id: number;
  metric_type: MetricType;
  time_period: {
    start: string;
    end: string;
  };
  statistics: {
    min: number;
    max: number;
    average: number;
    median: number;
    standard_deviation: number;
    variance: number;
    percentiles: {
      p25: number;
      p50: number;
      p75: number;
      p90: number;
      p95: number;
      p99: number;
    };
  };
  trend: MetricTrend;
  anomalies: MetricAnomaly[];
}

export interface MetricTrend {
  direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  slope: number;
  r_squared: number;
  confidence_level: number;
  trend_strength: 'strong' | 'moderate' | 'weak';
}

export interface MetricAnomaly {
  timestamp: string;
  value: number;
  expected_value: number;
  deviation_percentage: number;
  anomaly_type: 'spike' | 'drop' | 'outlier';
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: string;
}

// Metric thresholds and alerts
export interface MetricThreshold {
  id: number;
  container_id: number;
  metric_type: MetricType;
  threshold_type: 'min' | 'max' | 'range';
  min_value?: number;
  max_value?: number;
  warning_threshold?: number;
  critical_threshold?: number;
  enabled: boolean;
  alert_frequency: 'immediate' | 'hourly' | 'daily';
  notification_methods: Array<'email' | 'push' | 'sms' | 'webhook'>;
  created_at: string;
  updated_at: string;
}

export interface CreateMetricThresholdRequest {
  container_id: number;
  metric_type: MetricType;
  threshold_type: 'min' | 'max' | 'range';
  min_value?: number;
  max_value?: number;
  warning_threshold?: number;
  critical_threshold?: number;
  alert_frequency?: 'immediate' | 'hourly' | 'daily';
  notification_methods?: Array<'email' | 'push' | 'sms' | 'webhook'>;
}

// Metric comparisons and benchmarking
export interface MetricComparison {
  comparison_type: 'container_vs_container' | 'time_period' | 'against_benchmark';
  baseline: MetricDataSet;
  comparison: MetricDataSet;
  differences: MetricDifference[];
  summary: ComparisonSummary;
}

export interface MetricDataSet {
  identifier: string;
  name: string;
  time_period: {
    start: string;
    end: string;
  };
  metrics: Record<MetricType, number>;
}

export interface MetricDifference {
  metric_type: MetricType;
  baseline_value: number;
  comparison_value: number;
  absolute_difference: number;
  percentage_difference: number;
  significance: 'negligible' | 'minor' | 'moderate' | 'major';
}

export interface ComparisonSummary {
  overall_performance: 'better' | 'worse' | 'similar';
  key_improvements: MetricType[];
  key_concerns: MetricType[];
  recommendations: string[];
}

// Real-time metric streaming
export interface MetricStreamData {
  container_id: number;
  timestamp: string;
  metrics: Partial<Record<MetricType, number>>;
  quality_score: number;
  data_source: string;
}

export interface MetricStreamSubscription {
  subscription_id: string;
  container_ids: number[];
  metric_types: MetricType[];
  update_frequency: MetricInterval;
  callback_url?: string;
  created_at: string;
  last_update: string;
}
