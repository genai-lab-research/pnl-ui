import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TimeRangeSelectorProps, TimeRange, TimeRangeOption } from './types';
import {
  StyledTimeRangeSelector,
  OptionsContainer,
  TimeRangeOption as StyledTimeRangeOption,
  OptionLabel,
  TimeRangeLoadingSpinner,
} from './styles';

const DEFAULT_OPTIONS: TimeRangeOption[] = [
  { value: 'Week', label: 'Week' },
  { value: 'Month', label: 'Month' },
  { value: 'Quarter', label: 'Quarter' },
  { value: 'Year', label: 'Year' },
];

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedValue,
  onValueChange,
  options = DEFAULT_OPTIONS,
  disabled = false,
  className,
  size = 'medium',
  'aria-label': ariaLabel,
  isLoading = false,
}) => {
  const [localSelectedValue, setLocalSelectedValue] = useState<TimeRange>(selectedValue);
  
  // Update local state when prop value changes
  useEffect(() => {
    setLocalSelectedValue(selectedValue);
  }, [selectedValue]);
  // Add debouncing for time range changes
  const timeoutRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedValueChange = useCallback((value: TimeRange) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      onValueChange(value);
    }, 100); // 100ms debounce delay for direct selections
  }, [onValueChange]);

  const handleOptionClick = (value: TimeRange) => {
    if (!disabled) {
      // Update local state immediately
      setLocalSelectedValue(value);
      // Debounced notification to parent component
      debouncedValueChange(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, value: TimeRange) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOptionClick(value);
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const currentIndex = options.findIndex(option => option.value === selectedValue);
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (currentIndex + direction + options.length) % options.length;
      const nextOption = options[nextIndex];
      
      if (nextOption && !nextOption.disabled) {
        handleOptionClick(nextOption.value);
      }
    }
  };

  return (
    <StyledTimeRangeSelector 
      className={className} 
      size={size}
      role="radiogroup"
      aria-label={ariaLabel || 'Select time range'}
    >
      <OptionsContainer size={size}>
        {options.map((option) => {
          // Use local state for UI updates
          const isSelected = option.value === localSelectedValue;
          const isDisabled = disabled || option.disabled || isLoading;
          
          return (
            <StyledTimeRangeOption
              key={option.value}
              isSelected={isSelected}
              size={size}
              onClick={() => handleOptionClick(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              disabled={isDisabled}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isDisabled}
              tabIndex={isSelected ? 0 : -1}
              title={`Select ${option.label} time range`}
            >
              <OptionLabel>
                {option.label}
                {isSelected && isLoading && <TimeRangeLoadingSpinner />}
              </OptionLabel>
            </StyledTimeRangeOption>
          );
        })}
      </OptionsContainer>
    </StyledTimeRangeSelector>
  );
};

export default TimeRangeSelector;