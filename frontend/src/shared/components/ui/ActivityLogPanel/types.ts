export interface ActivityLogEntry {
  id?: string;
  description: string;
  timestamp: string;
  user?: string;
  type?: 'seeding' | 'transplanting' | 'harvesting' | 'maintenance' | 'system' | 'other';
}

export interface ActivityLogPanelProps {
  /** Array of activity log entries */
  activities: ActivityLogEntry[];
  /** Panel title */
  title?: string;
  /** Maximum height for scrollable content */
  maxHeight?: number;
  /** Loading state */
  loading?: boolean;
  /** Additional styling props */
  sx?: object;
}