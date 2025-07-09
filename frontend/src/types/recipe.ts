// Recipe Management Data Models

export interface RecipeMaster {
  id: number;
  name: string;
  crop_type: string;
  notes?: string;
  versions?: RecipeVersion[];
}

export interface RecipeVersion {
  id: number;
  recipe_id?: number;
  version: string;
  valid_from: string; // ISO datetime string
  valid_to?: string; // ISO datetime string
  tray_density?: number;
  air_temperature?: number;
  humidity?: number;
  co2?: number;
  water_temperature?: number;
  ec?: number;
  ph?: number;
  water_hours?: number;
  light_hours?: number;
  created_by: string;
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

export interface Crop {
  id: number;
  seed_type_id?: number;
  seed_date?: string; // ISO date string
  transplanting_date_planned?: string; // ISO date string
  transplanting_date?: string; // ISO date string
  harvesting_date_planned?: string; // ISO date string
  harvesting_date?: string; // ISO date string
  lifecycle_status?: string;
  health_check?: string;
  current_location?: Record<string, any>; // JSON object
  last_location?: Record<string, any>; // JSON object
  measurements_id?: number;
  image_url?: string;
  recipe_version_id?: number;
  accumulated_light_hours?: number;
  accumulated_water_hours?: number;
  notes?: string;
}

export interface CropHistory {
  crop_id: number;
  timestamp: string; // ISO datetime string
  event?: string;
  performed_by?: string;
  notes?: string;
}

export interface CropSnapshot {
  id: number;
  timestamp?: string; // ISO datetime string
  crop_id?: number;
  lifecycle_status?: string;
  health_status?: string;
  recipe_version_id?: number;
  location?: Record<string, any>; // JSON object
  measurements_id?: number;
  accumulated_light_hours?: number;
  accumulated_water_hours?: number;
  image_url?: string;
}

// Request/Create types
export interface RecipeCreateRequest {
  name: string;
  crop_type: string;
  notes?: string;
}

export interface RecipeVersionCreateRequest {
  version: string;
  valid_from: string; // ISO datetime string
  valid_to?: string; // ISO datetime string
  tray_density?: number;
  air_temperature?: number;
  humidity?: number;
  co2?: number;
  water_temperature?: number;
  ec?: number;
  ph?: number;
  water_hours?: number;
  light_hours?: number;
  created_by: string;
}

export interface CropCreateRequest {
  seed_type_id?: number;
  seed_date?: string; // ISO date string
  transplanting_date_planned?: string; // ISO date string
  harvesting_date_planned?: string; // ISO date string
  lifecycle_status?: string;
  health_check?: string;
  current_location?: Record<string, any>; // JSON object
  recipe_version_id?: number;
  notes?: string;
}

export interface CropMeasurementsCreateRequest {
  radius?: number;
  width?: number;
  height?: number;
  area?: number;
  area_estimated?: number;
  weight?: number;
}

export interface CropHistoryCreateRequest {
  event?: string;
  performed_by?: string;
  notes?: string;
}

export interface CropSnapshotCreateRequest {
  lifecycle_status?: string;
  health_status?: string;
  recipe_version_id?: number;
  location?: Record<string, any>; // JSON object
  measurements_id?: number;
  accumulated_light_hours?: number;
  accumulated_water_hours?: number;
  image_url?: string;
}

// Filter criteria types
export interface RecipeFilterCriteria {
  search?: string;
  crop_type?: string;
  created_by?: string;
  active_only?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CropFilterCriteria {
  search?: string;
  seed_type_id?: number;
  lifecycle_status?: string;
  health_check?: string;
  recipe_version_id?: number;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CropSnapshotFilterCriteria {
  start_date?: string; // ISO datetime string
  end_date?: string; // ISO datetime string
}

// Response types
export interface RecipeApiResponse<T> {
  data: T;
  message?: string;
}

export interface RecipePaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface RecipeDeleteResponse {
  message: string;
}

// API Error types
export interface RecipeApiError {
  message: string;
  code?: string;
  details?: any;
}