export interface GridViewTrayCropsProps {
  /** Slot number to display */
  slotNumber?: number;
  /** Tray ID identifier */
  trayId?: string;
  /** Progress percentage (0-100) */
  progressPercentage?: number;
  /** Number of rows in the grid */
  gridRows?: number;
  /** Number of columns in the grid */
  gridColumns?: number;
  /** Total number of crops */
  totalCrops?: number;
  /** Additional CSS class */
  className?: string;
}