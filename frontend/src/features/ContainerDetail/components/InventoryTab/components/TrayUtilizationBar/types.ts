export interface TrayUtilizationData {
  current: number;
  total: number;
  percentage: number;
  status: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated?: Date;
}

export interface TrayUtilizationBarConfig {
  thresholds?: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  colors?: {
    low: string;
    medium: string;
    high: string;
    critical: string;
  };
  showTrendIndicator?: boolean;
  enableRealTimeUpdates?: boolean;
  updateInterval?: number;
}