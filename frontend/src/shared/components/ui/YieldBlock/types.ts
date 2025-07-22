export interface YieldBlockProps {
  /**
   * The label text to display above the value
   */
  label?: string;
  
  /**
   * The main value to display (e.g., '51KG')
   */
  value: string;
  
  /**
   * The increment value to display (e.g., '+1.5Kg')
   */
  increment?: string;
  
  /**
   * Optional className for additional styling
   */
  className?: string;
}