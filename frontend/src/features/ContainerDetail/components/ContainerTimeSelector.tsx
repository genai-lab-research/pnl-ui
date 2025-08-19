import React from 'react';
import { TimeRangeSelector } from '../../../shared/components/ui/TimeRangeSelector';
import { ContainerTimeSelectorProps } from '../types/ui-models';
import { TIME_RANGE_OPTIONS } from '../types/time-range';

/**
 * ContainerTimeSelector - Domain component for time range selection in container views
 * 
 * This component provides a container-specific interface for selecting time ranges
 * (Week, Month, Quarter, Year) for filtering container metrics and data displays.
 * 
 * Wraps the TimeRangeSelector atomic component with container-specific props and time range options.
 */
export const ContainerTimeSelector: React.FC<ContainerTimeSelectorProps> = ({
  selectedTimeRange,
  onTimeRangeChange,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  error,
  containerId,
  customTimeRanges,
  showLabels = true,
  className,
}) => {
  // Use custom time ranges if provided, otherwise use default TIME_RANGE_OPTIONS
  const timeRangeOptions = customTimeRanges || TIME_RANGE_OPTIONS;
  
  // Convert time range options to TimeRangeSelector format
  const selectorOptions = timeRangeOptions.map(option => ({
    value: option.label, // TimeRangeSelector expects 'Week', 'Month', etc.
    label: showLabels ? option.label : option.value.toUpperCase(),
    disabled: false,
  }));

  // Handle time range selection change
  const handleTimeRangeChange = (value: string) => {
    // Convert back to lowercase for consistency with the rest of the app
    const lowerValue = value.toLowerCase() as any;
    onTimeRangeChange(lowerValue);
  };

  // Generate accessibility label
  const ariaLabel = `Time range selector for container ${containerId || 'data'} - currently selected: ${selectedTimeRange}`;

  // Convert selectedTimeRange to proper case for TimeRangeSelector
  const selectedValue = selectedTimeRange.charAt(0).toUpperCase() + selectedTimeRange.slice(1);

  return (
    <TimeRangeSelector
      selectedValue={selectedValue as any}
      onValueChange={handleTimeRangeChange}
      options={selectorOptions}
      size={size === 'sm' ? 'small' : size === 'md' ? 'medium' : 'large'}
      disabled={disabled || !!error}
      isLoading={loading}
      aria-label={ariaLabel}
      className={className}
    />
  );
};

export default ContainerTimeSelector;
