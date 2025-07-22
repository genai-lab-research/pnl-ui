// Nursery Station Data Models based on p6_datamodels.md

export interface UtilizationSummary {
  total_utilization_percentage: number;
}

export interface NurseryLayout {
  upper_shelf: TraySlot[];
  lower_shelf: TraySlot[];
}

export interface TraySlot {
  slot_number: number;
  tray?: Tray | null;
}

export interface Tray {
  id: number;
  container_id: number;
  rfid_tag?: string;
  location?: TrayLocation;
  utilization_pct?: number;
  provisioned_at?: string;
  status?: string;
  capacity?: number;
  tray_type?: string;
  crops?: NurseryCrop[];
}

export interface NurseryCrop {
  id: number;
  seed_type_id?: number;
  row: number;
  column: number;
  seed_type: string;
  age_days: number;
  health_check?: string;
  seed_date?: string;
  transplanting_date_planned?: string;
  overdue_days?: number;
  current_location?: Record<string, unknown>;
  lifecycle_status?: string;
}

export interface OffShelfTray {
  id: number;
  container_id: number;
  rfid_tag?: string;
  utilization_pct?: number;
  status?: string;
  last_location?: Record<string, unknown>;
  capacity?: number;
  tray_type?: string;
}

export interface TrayLocation {
  shelf: 'upper' | 'lower';
  slot_number: number;
}

export interface NurseryStationLayout {
  utilization_summary: UtilizationSummary;
  layout: NurseryLayout;
  off_shelf_trays: OffShelfTray[];
}

export interface TraySnapshot {
  id: number;
  timestamp?: string;
  container_id: number;
  rfid_tag?: string;
  location?: Record<string, unknown>;
  crop_count?: number;
  utilization_percentage?: number;
  status?: string;
}

export interface TimelineEvent {
  type: 'tray_added' | 'tray_removed' | 'tray_moved' | 'crop_transplanted';
  description: string;
  tray_id?: number;
  timestamp: string;
}

export interface DateRange {
  start_date: string;
  end_date: string;
  current_date: string;
}

export interface TimelineData {
  timeline: TraySnapshot[];
  date_range: DateRange;
}

export interface AvailableSlot {
  shelf: 'upper' | 'lower';
  slot_number: number;
  location_description: string;
}

export interface AvailableSlotsResponse {
  available_slots: AvailableSlot[];
}

export interface TrayMovementRequest {
  tray_id: number;
  target_shelf: 'upper' | 'lower';
  target_slot: number;
  moved_by: string;
}

export interface TrayLocationUpdateRequest {
  location: TrayLocation;
  moved_by: string;
}

export interface TrayLocationUpdateResponse {
  success: boolean;
  message: string;
  tray: Tray;
}

export interface TrayUpdateRequest {
  location?: Record<string, unknown>;
  utilization_pct?: number;
  status?: string;
  capacity?: number;
  tray_type?: string;
}

export interface NurseryStationSummary {
  total_slots: number;
  occupied_slots: number;
  utilization_percentage: number;
  total_trays: number;
  off_shelf_trays: number;
  total_crops: number;
  overdue_crops: number;
  last_updated: string;
}

export interface TraySnapshotCreateRequest {
  rfid_tag: string;
  location: Record<string, unknown>;
  crop_count: number;
  utilization_percentage: number;
  status: string;
}