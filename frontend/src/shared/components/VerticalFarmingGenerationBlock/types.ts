/**
 * Types for the VerticalFarmingGenerationBlock component
 */

export interface VerticalFarmingGenerationBlockProps {
  /**
   * Area label to display in the top panel
   */
  areaLabel: string;
  
  /**
   * Unit of measurement for the area (e.g., "m²")
   */
  areaUnit: string;
  
  /**
   * Left value to display
   */
  leftValue: string;
  
  /**
   * Right value to display
   */
  rightValue: string;
  
  /**
   * Alert value to display in the bubble (if present)
   */
  alertValue?: string;
  
  /**
   * Data points for the graph
   */
  graphData: number[];
  
  /**
   * Optional className for additional styling
   */
  className?: string;
}