/**
 * Types for the VerticalFarmingGenerationTimelineBlock component
 */

export interface VerticalFarmingGenerationTimelineBlockProps {
  /**
   * Array of data points representing daily generation values
   */
  data: number[];
  
  /**
   * Start date label (e.g., "01 Apr")
   */
  startDateLabel: string;
  
  /**
   * End date label (e.g., "15 Apr")
   */
  endDateLabel: string;
  
  /**
   * Optional tooltip date to highlight (e.g., "April 4")
   */
  tooltipDate?: string;
  
  /**
   * Indices of bars that should be highlighted (shown in accent color)
   */
  selectedBarIndices?: number[];
  
  /**
   * Optional className for additional styling
   */
  className?: string;
}