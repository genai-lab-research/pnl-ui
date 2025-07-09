export interface TimelapsCellData {
  /**
   * Indicates if the cell is active (highlighted)
   */
  isActive: boolean;
  
  /**
   * Indicates if the cell is a future cell (shown with reduced opacity)
   */
  isFuture?: boolean;
  
  /**
   * Optional date associated with this cell (for tooltip display)
   */
  date?: Date;
}

export interface TimelapsProps {
  /**
   * Array of cell data representing the timeline
   */
  cells: TimelapsCellData[];
  
  /**
   * Start date label (e.g., "05 Apr")
   */
  startDate: string;
  
  /**
   * End date label (e.g., "06 Jun")
   */
  endDate: string;
  
  /**
   * Index of the current day to show tooltip (optional)
   */
  currentDayIndex?: number;
  
  /**
   * Optional className for additional styling
   */
  className?: string;
}