// Crop Timelapse Data Models based on p8_datamodels.md

export interface CropLocation {
  type: 'tray' | 'panel';
  tray_id?: number;
  panel_id?: number;
  row?: number;
  column?: number;
  channel?: number;
  position?: number;
}

export interface CropMetadata {
  id: number;
  seed_type_id?: number;
  seed_type: string;
  variety?: string;
  supplier?: string;
  batch_id?: string;
  location: CropLocation;
}

export interface LifecycleMilestones {
  seed_date?: string;
  transplanting_date_planned?: string;
  transplanting_date?: string;
  harvesting_date_planned?: string;
  harvesting_date?: string;
}

export interface GrowthMetrics {
  radius?: number;
  width?: number;
  height?: number;
  area?: number;
  area_estimated?: number;
  weight?: number;
  accumulated_light_hours?: number;
  accumulated_water_hours?: number;
}

export interface EnvironmentalMetrics {
  air_temperature?: number;
  humidity?: number;
  co2?: number;
  water_temperature?: number;
  ph?: number;
  ec?: number;
}

export interface TimelapseFrame {
  timestamp: string;
  crop_age_days: number;
  image_url?: string;
  lifecycle_status?: string;
  health_status?: string;
  growth_metrics: GrowthMetrics;
  environmental_metrics: EnvironmentalMetrics;
}

export interface CropHistoryEntry {
  crop_id: number;
  timestamp: string;
  event?: string;
  performed_by?: string;
  notes?: string;
}

export interface CropTimelapse {
  crop_metadata: CropMetadata;
  lifecycle_milestones: LifecycleMilestones;
  timelapse_frames: TimelapseFrame[];
  notes?: string;
  history: CropHistoryEntry[];
}

export interface CropSnapshot {
  id: number;
  timestamp?: string;
  crop_id: number;
  lifecycle_status?: string;
  health_status?: string;
  recipe_version_id?: number;
  location?: Record<string, unknown>;
  measurements_id?: number;
  accumulated_light_hours?: number;
  accumulated_water_hours?: number;
  image_url?: string;
}

export interface CropSnapshotCreateRequest {
  lifecycle_status?: string;
  health_status?: string;
  recipe_version_id?: number;
  location?: Record<string, unknown>;
  measurements_id?: number;
  accumulated_light_hours?: number;
  accumulated_water_hours?: number;
  image_url?: string;
}

export interface MetricDefinition {
  unit: string;
  description: string;
}

export interface MetricDefinitions {
  area: MetricDefinition;
  area_estimated: MetricDefinition;
  weight: MetricDefinition;
  accumulated_light_hours: MetricDefinition;
  accumulated_water_hours: MetricDefinition;
}

export interface GrowthDataPoint {
  timestamp?: string;
  crop_age_days: number;
  area?: number;
  area_estimated?: number;
  weight?: number;
  accumulated_light_hours?: number;
  accumulated_water_hours?: number;
  air_temperature?: number;
  humidity?: number;
  co2?: number;
  water_temperature?: number;
  ph?: number;
  ec?: number;
}

export interface GrowthChartData {
  chart_data: GrowthDataPoint[];
  metric_definitions: MetricDefinitions;
}

export interface CropDetails {
  id: number;
  seed_type_id?: number;
  seed_date?: string;
  transplanting_date_planned?: string;
  transplanting_date?: string;
  harvesting_date_planned?: string;
  harvesting_date?: string;
  lifecycle_status?: string;
  health_check?: string;
  current_location?: Record<string, unknown>;
  last_location?: Record<string, unknown>;
  measurements_id?: number;
  image_url?: string;
  recipe_version_id?: number;
  accumulated_light_hours?: number;
  accumulated_water_hours?: number;
  notes?: string;
}

export interface CropMeasurements {
  id: number;
  radius?: number;
  width?: number;
  height?: number;
  area?: number;
  area_estimated?: number;
  weight?: number;
}

export interface CropMeasurementUpdateRequest {
  radius?: number;
  width?: number;
  height?: number;
  area?: number;
  area_estimated?: number;
  weight?: number;
}

export interface CropNotesUpdateRequest {
  notes: string;
}

export interface CropNotesUpdateResponse {
  success: boolean;
  message: string;
  updated_at: string;
}

export interface CropHistoryCreateRequest {
  event: string;
  performed_by: string;
  notes?: string;
}

export interface CropSnapshotsQueryParams {
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export interface CropGrowthMetricsQueryParams {
  start_date?: string;
  end_date?: string;
  metrics?: string[];
}

export interface CropHistoryQueryParams {
  limit?: number;
  start_date?: string;
  end_date?: string;
}