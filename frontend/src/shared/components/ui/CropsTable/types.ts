export interface CropData {
  id?: string;
  seed_type: string;
  seed_date: string;
  transplanting_date_planned?: string;
  harvesting_date_planned?: string;
  transplanted_date?: string;
  harvesting_date?: string;
  age?: number;
  status?: string;
  overdue_days?: number;
  cultivation_area_count?: number;
  nursery_table_count?: number;
  location?: {
    type: string;
    tray_id?: string;
    panel_id?: string;
    row?: number;
    column?: number;
    channel?: number;
    position?: number;
  };
}

export interface CropsTableProps {
  /** Array of crop data to display */
  crops: CropData[];
  /** Loading state */
  loading?: boolean;
  /** Callback when a row is clicked */
  onRowClick?: (crop: CropData) => void;
  /** Additional styling props */
  sx?: object;
}