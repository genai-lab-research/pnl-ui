// Inventory types for Container Inventory Tab

export interface SlotLocation {
  shelf?: 'upper' | 'lower';
  wall?: 'wall_1' | 'wall_2' | 'wall_3' | 'wall_4';
  slot_number: number;
}

export interface CropData {
  id: string;
  seed_type: string;
  row?: number;
  column?: number;
  channel?: number;
  position?: number;
  age_days: number;
  seeded_date: string;
  planned_transplanting_date?: string;
  transplanted_date?: string;
  planned_harvesting_date?: string;
  overdue_days: number;
  health_status: 'healthy' | 'treatment_required' | 'to_be_disposed';
  size: 'small' | 'medium' | 'large';
}

export interface TrayData {
  id: string;
  utilization_percentage: number;
  crop_count: number;
  utilization_level: 'low' | 'medium' | 'high';
  rfid_tag: string;
  crops: CropData[];
}

export interface TraySlot {
  slot_number: number;
  occupied: boolean;
  tray: TrayData | null;
}

export interface ShelfData {
  slots: TraySlot[];
}

export interface NurseryStationData {
  utilization_percentage: number;
  upper_shelf: ShelfData;
  lower_shelf: ShelfData;
  off_shelf_trays: TrayData[];
}

export interface ChannelData {
  channel_number: number;
  crops: CropData[];
}

export interface PanelData {
  id: string;
  utilization_percentage: number;
  crop_count: number;
  utilization_level: 'low' | 'medium' | 'high';
  rfid_tag: string;
  channels: ChannelData[];
}

export interface PanelSlot {
  slot_number: number;
  occupied: boolean;
  panel: PanelData | null;
}

export interface WallData {
  wall_number: number;
  name: string;
  slots: PanelSlot[];
}

export interface CultivationAreaData {
  utilization_percentage: number;
  walls: WallData[];
  overflow_panels: PanelData[];
}

export interface TrayCreate {
  rfid_tag: string;
  location: {
    shelf: 'upper' | 'lower';
    slot_number: number;
  };
}

export interface TrayResponse {
  id: string;
  rfid_tag: string;
  location: {
    shelf: 'upper' | 'lower';
    slot_number: number;
  };
  provisioned_at: string;
  status: string;
}

export interface PanelCreate {
  rfid_tag: string;
  location: {
    wall: 'wall_1' | 'wall_2' | 'wall_3' | 'wall_4';
    slot_number: number;
  };
}

export interface PanelResponse {
  id: string;
  rfid_tag: string;
  location: {
    wall: 'wall_1' | 'wall_2' | 'wall_3' | 'wall_4';
    slot_number: number;
  };
  provisioned_at: string;
  status: string;
}

export interface CropHistoryEvent {
  date: string;
  event: 'seeded' | 'growth_update' | 'transplanted' | 'harvested';
  location: {
    type: 'tray' | 'panel';
    tray_id?: string;
    panel_id?: string;
    row?: number;
    column?: number;
    channel?: number;
    position?: number;
  };
  health_status: 'healthy' | 'treatment_required' | 'to_be_disposed';
  size: 'small' | 'medium' | 'large';
  notes?: string;
}

export interface CropHistory {
  crop_id: string;
  history: CropHistoryEvent[];
}

// New provisioning types for location-based APIs
export interface TrayProvisionRequest {
  rfid_tag: string;
  notes?: string;
}

export interface PanelProvisionRequest {
  rfid_tag: string;
  notes?: string;
}

export interface TrayProvisionResponse {
  id: string;
  rfid_tag: string;
  container_id: string;
  shelf: 'upper' | 'lower' | null;
  slot_number: number | null;
  location_display: string;
  notes?: string;
  created: string;
  message: string;
}

export interface PanelProvisionResponse {
  id: string;
  rfid_tag: string;
  container_id: string;
  wall: 'wall_1' | 'wall_2' | null;
  slot_number: number | null;
  location_display: string;
  notes?: string;
  created: string;
  message: string;
}