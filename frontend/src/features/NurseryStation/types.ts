import { NurseryStationLayout, TraySnapshot } from '../../types/nursery';

export interface NurseryStationProps {
  containerId?: number;
}

export interface NurseryStationState {
  layout: NurseryStationLayout | null;
  snapshots: TraySnapshot[];
  selectedDate: Date;
  loading: boolean;
  error: string | null;
}

export interface TraySlotProps {
  slotNumber: number;
  tray: {
    id: number;
    utilization_pct: number;
    crops?: { length: number }[];
    tray_type: string;
  } | null;
  onTrayClick?: (trayId: number) => void;
  onAddTray?: (slotNumber: number) => void;
}

export interface TrayGridProps {
  tray: {
    crops?: {
      age_days: number;
      overdue_days: number;
      health_check: string;
      seed_type: string;
      row: number;
      column: number;
      id: number;
    }[];
  };
  onCropClick?: (cropId: number) => void;
}

export interface OffShelfTraysProps {
  trays: {
    id: number;
    status: string;
    utilization_pct: number;
    tray_type: string;
    capacity: number;
    rfid_tag?: string;
    last_location?: string;
  }[];
  onTraySelect?: (trayId: number) => void;
}

export interface TimelapseControlsProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  snapshots: TraySnapshot[];
}