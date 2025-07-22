export interface CropData {
  id: string;
  seed_type: string;
  age: number;
  status: string;
  seed_date: string;
  harvesting_date_planned: string;
  overdue_days?: number;
  image?: string;
}

export interface TimelineData {
  date: string;
  value: number;
}

export interface MetricData {
  name: string;
  unit: string;
  currentValue: number;
  minValue: number;
  maxValue: number;
  data: TimelineData[];
}

export interface CropDetailModalProps {
  open: boolean;
  onClose: () => void;
  crop: CropData | null;
  cropId?: string;
}