export type TimeRange = 'Week' | 'Month' | 'Quarter' | 'Year';

export interface TimeRangeSelectorProps {
  /**
   * The currently selected time range
   */
  selectedRange: TimeRange;
  
  /**
   * Callback function when a time range is selected
   */
  onRangeChange: (range: TimeRange) => void;
  
  /**
   * Optional className for styling
   */
  className?: string;
}