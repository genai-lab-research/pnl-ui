// Inventory Management Data Models

export interface InventoryMetrics {
  nursery_station_utilization: number; // 0-100
  cultivation_area_utilization: number; // 0-100
}

export interface InventoryMetricsQueryCriteria {
  date?: string; // YYYY-MM-DD format
}

// Crop Management Data Models

export interface CropLocation {
  type: string;
  tray_id?: string;
  panel_id?: string;
  row?: number;
  column?: number;
  channel?: number;
  position?: number;
}

export interface Crop {
  id: string;
  seed_type: string;
  seed_date: string; // ISO 8601 format
  transplanting_date_planned?: string; // ISO 8601 format
  harvesting_date_planned?: string; // ISO 8601 format
  transplanted_date?: string; // ISO 8601 format
  harvesting_date?: string; // ISO 8601 format
  age: number; // days, >= 0
  status: string;
  overdue_days: number; // >= 0
  location: CropLocation;
}

export interface CropFilterCriteria {
  seed_type?: string;
}