export interface UtilizationIndicatorProps {
  /**
   * The utilization percentage (0-100)
   */
  percentage: number;
  
  /**
   * Optional label text to display before the percentage
   * @default "Utilization:"
   */
  label?: string;
  
  /**
   * Optional className for additional styling
   */
  className?: string;
}