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
}