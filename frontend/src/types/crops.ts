/**
 * Crop Management Data Models
 * Based on p2_datamodels.md and p2_routing.md specifications
 */

import { SeedType } from './containers';

// Crop Model
export interface Crop {
  id: number;
  seed_type_id: number;
  seed_date: string; // Date ISO string
  transplanting_date_planned: string | null; // Date ISO string
  transplanting_date: string | null; // Date ISO string
  harvesting_date_planned: string | null; // Date ISO string
  harvesting_date: string | null; // Date ISO string
  lifecycle_status: CropLifecycleStatus;
  health_check: CropHealthStatus;
  current_location: Record<string, any>;
  last_location: Record<string, any>;
  measurements_id: number | null;
  image_url: string | null;
  recipe_version_id: number | null;
  accumulated_light_hours: number;
  accumulated_water_hours: number;
  notes: string;
  
  // Relationships
  seed_type?: SeedType;
}

// Crop Lifecycle Status Enum
export type CropLifecycleStatus = 
  | 'seeded'
  | 'germinating'
  | 'seedling'
  | 'vegetative'
  | 'flowering'
  | 'fruiting'
  | 'ready_for_harvest'
  | 'harvested'
  | 'finished';

// Crop Health Status Enum
export type CropHealthStatus = 
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'critical'
  | 'unknown';

// Request types for API operations
export interface CreateCropRequest {
  seed_type_id: number;
  seed_date: string;
  transplanting_date_planned?: string;
  harvesting_date_planned?: string;
  lifecycle_status: CropLifecycleStatus;
  health_check: CropHealthStatus;
  current_location: Record<string, any>;
  measurements_id?: number;
  image_url?: string;
  recipe_version_id?: number;
  accumulated_light_hours?: number;
  accumulated_water_hours?: number;
  notes?: string;
}

export interface UpdateCropRequest {
  seed_type_id?: number;
  seed_date?: string;
  transplanting_date_planned?: string;
  transplanting_date?: string;
  harvesting_date_planned?: string;
  harvesting_date?: string;
  lifecycle_status?: CropLifecycleStatus;
  health_check?: CropHealthStatus;
  current_location?: Record<string, any>;
  last_location?: Record<string, any>;
  measurements_id?: number;
  image_url?: string;
  recipe_version_id?: number;
  accumulated_light_hours?: number;
  accumulated_water_hours?: number;
  notes?: string;
}

// Filter and query parameters
export interface CropFilterCriteria {
  seed_type_id?: number;
  lifecycle_status?: CropLifecycleStatus;
  health_check?: CropHealthStatus;
  seed_date_from?: string;
  seed_date_to?: string;
  harvesting_date_from?: string;
  harvesting_date_to?: string;
  skip?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Response types
export interface CropListResponse {
  crops: Crop[];
  total: number;
  skip: number;
  limit: number;
}

// Crop summary statistics
export interface CropSummaryStats {
  total_crops: number;
  by_lifecycle_status: Record<CropLifecycleStatus, number>;
  by_health_status: Record<CropHealthStatus, number>;
  average_accumulated_light_hours: number;
  average_accumulated_water_hours: number;
  crops_ready_for_harvest: number;
  crops_past_planned_harvest: number;
}

// Crop growth tracking
export interface CropGrowthData {
  crop_id: number;
  measurements: CropMeasurement[];
  growth_rate: number;
  expected_harvest_date: string;
  health_trend: 'improving' | 'stable' | 'declining';
}

export interface CropMeasurement {
  id: number;
  crop_id: number;
  measurement_date: string;
  height_cm: number;
  leaf_count: number;
  stem_diameter_mm: number;
  health_score: number; // 0-100
  notes?: string;
  image_url?: string;
}

// Crop care schedule
export interface CropCareSchedule {
  crop_id: number;
  scheduled_tasks: CropTask[];
  next_care_date: string;
  overdue_tasks: CropTask[];
}

export interface CropTask {
  id: number;
  crop_id: number;
  task_type: CropTaskType;
  scheduled_date: string;
  completed_date?: string;
  status: 'pending' | 'completed' | 'overdue' | 'cancelled';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
}

export type CropTaskType = 
  | 'watering'
  | 'fertilizing'
  | 'pruning'
  | 'harvesting'
  | 'transplanting'
  | 'health_check'
  | 'pest_control'
  | 'light_adjustment'
  | 'temperature_check';
