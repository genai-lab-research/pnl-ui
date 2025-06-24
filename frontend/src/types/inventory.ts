// Inventory Management Data Models

// Location Types
export interface TrayLocation {
  shelf: string; // "upper" or "lower"
  slot_number: number; // >= 0
}

export interface PanelLocation {
  wall: string; // "wall_1", "wall_2", "wall_3", "wall_4"
  slot_number: number; // >= 0
}

export interface CropLocation {
  type: "tray" | "panel";
  tray_id?: string; // Required if type is "tray"
  panel_id?: string; // Required if type is "panel"
  row: number; // >= 0
  column: number; // >= 0
  channel: number; // >= 0
  position: number; // >= 0
}

// Core Entities
export interface CropMetrics {
  id: number;
  crop_id: string;
  recorded_at: string; // ISO 8601 format
  
  // Growth metrics
  height_cm?: number;
  leaf_count?: number;
  stem_diameter_mm?: number;
  leaf_area_cm2?: number;
  biomass_g?: number;
  
  // Health indicators
  health_score?: number; // 0-100
  disease_detected?: boolean;
  pest_detected?: boolean;
  stress_level?: number; // 0-100
  
  // Environmental metrics
  temperature_c?: number;
  humidity_percent?: number; // 0-100
  light_intensity_umol?: number;
  ph_level?: number; // 0-14
  ec_level?: number;
  
  // Nutritional metrics
  nitrogen_ppm?: number;
  phosphorus_ppm?: number;
  potassium_ppm?: number;
  calcium_ppm?: number;
  magnesium_ppm?: number;
}

export interface CropStatistics {
  id: number;
  crop_id: string;
  
  // Growth statistics
  avg_daily_growth_rate?: number; // cm/day
  max_recorded_height?: number;
  total_leaf_count?: number;
  growth_stage?: string; // seedling, vegetative, flowering, fruiting
  
  // Yield predictions
  predicted_yield_g?: number;
  predicted_harvest_date?: string; // ISO 8601 format
  yield_quality_score?: number; // 0-100
  
  // Performance metrics
  survival_rate?: number; // 0-100
  resource_efficiency?: number; // 0-100
  time_to_harvest_days?: number;
  
  // Environmental adaptation
  temperature_tolerance?: number; // 0-100
  humidity_tolerance?: number; // 0-100
  light_efficiency?: number; // 0-100
  
  // Health history
  disease_resistance?: number; // 0-100
  pest_resistance?: number; // 0-100
  overall_health_trend?: string; // improving, stable, declining
  
  // Cultivation details
  variety?: string;
  genetic_traits?: Record<string, any>;
  cultivation_method?: string; // hydroponic, aeroponic, soil
  fertilizer_program?: string;
  irrigation_schedule?: string;
  
  // Quality metrics
  nutritional_content?: Record<string, any>;
  taste_profile?: Record<string, any>;
  appearance_score?: number; // 0-100
  shelf_life_days?: number;
  
  // Notes and observations
  cultivation_notes?: string;
  harvest_notes?: string;
  special_observations?: string;
}

export interface Crop {
  id: string;
  seed_type: string;
  seed_date: string; // ISO 8601 format
  transplanting_date_planned: string; // ISO 8601 format
  harvesting_date_planned: string; // ISO 8601 format
  transplanted_date?: string; // ISO 8601 format
  harvesting_date?: string; // ISO 8601 format
  age: number; // >= 0
  status: string;
  overdue_days: number; // >= 0
  location: CropLocation;
  metrics?: CropMetrics[];
  statistics?: CropStatistics;
  recent_metrics?: CropMetrics;
  metrics_history?: CropMetrics[];
}

export interface Tray {
  id: string;
  rfid_tag: string;
  utilization_percentage: number; // 0-100
  crop_count: number; // >= 0
  location: TrayLocation;
  crops: Crop[];
  is_empty: boolean;
  provisioned_at: string; // ISO 8601 format
}

export interface Panel {
  id: string;
  rfid_tag: string;
  utilization_percentage: number; // 0-100
  crop_count: number; // >= 0
  location: PanelLocation;
  crops: Crop[];
  is_empty: boolean;
  provisioned_at: string; // ISO 8601 format
}

// Inventory Areas
export interface NurseryStation {
  utilization_percentage: number; // 0-100
  upper_shelf: Tray[];
  lower_shelf: Tray[];
  off_shelf_trays: Tray[];
}

export interface CultivationArea {
  utilization_percentage: number; // 0-100
  wall_1: Panel[];
  wall_2: Panel[];
  wall_3: Panel[];
  wall_4: Panel[];
  off_wall_panels: Panel[];
}

// Request/Response Types
export interface CreateTrayRequest {
  rfid_tag: string;
  shelf: string;
  slot_number: number;
}

// Filter Criteria
export interface InventoryFilterCriteria {
  date?: string; // YYYY-MM-DD format
}

export interface CropFilterCriteria {
  seed_type?: string;
  growth_stage?: string;
  health_status?: string;
  min_health_score?: number; // 0-100
  max_health_score?: number; // 0-100
}