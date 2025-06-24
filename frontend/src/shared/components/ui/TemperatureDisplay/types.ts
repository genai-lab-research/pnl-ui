export interface TemperatureDisplayProps {
  /**
   * Current temperature value
   */
  currentTemperature: number;

  /**
   * Target temperature value
   */
  targetTemperature: number;

  /**
   * Temperature unit (°C, °F, etc.)
   */
  unit?: string;

  /**
   * Title to display (defaults to "Air Temperature")
   */
  title?: string;

  /**
   * Optional className for additional styling
   */
  className?: string;
}
