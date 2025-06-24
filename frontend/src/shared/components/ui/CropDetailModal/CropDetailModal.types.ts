import { CropMetrics, CropStatistics } from '../../../types/inventory';

export interface CropData {
  id: string;
  seed_type: string;
  age: number;
  status: string;
  seed_date: string;
  harvesting_date_planned: string;
  overdue_days?: number;
  image?: string;
  metrics?: CropMetrics[];
  statistics?: CropStatistics;
  recent_metrics?: CropMetrics;
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

export interface HealthMetrics {
  health_score?: number;
  disease_detected?: boolean;
  pest_detected?: boolean;
  stress_level?: number;
}

export interface GrowthMetrics {
  height_cm?: number;
  leaf_count?: number;
  biomass_g?: number;
  growth_stage?: string;
}

export interface EnvironmentalMetrics {
  temperature_c?: number;
  humidity_percent?: number;
  light_intensity_umol?: number;
  ph_level?: number;
}

export interface YieldPrediction {
  predicted_yield_g?: number;
  predicted_harvest_date?: string;
  yield_quality_score?: number;
  time_to_harvest_days?: number;
}

export interface CropDetailModalProps {
  open: boolean;
  onClose: () => void;
  crop: CropData | null;
  cropId?: string;
  containerId?: string;
}