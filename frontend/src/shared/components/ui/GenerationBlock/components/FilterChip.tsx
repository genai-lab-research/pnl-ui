import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FilterChipProps, FilterChipOption } from '../types';
import { FilterChipContainer, ChipStateLayer, ChipLabel, ChipIcon, DropdownContainer, DropdownOption, ChipLoadingSpinner } from '../styles';

const ChevronDownIcon: React.FC = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.25 6.75L9 10.5l3.75-3.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FilterChip: React.FC<FilterChipProps> = ({
  chip,
  onClick,
  onOptionSelect,
  className,
  isLoading = false
}) => {
  const [localSelectedOption, setLocalSelectedOption] = useState<FilterChipOption | undefined>(chip.selectedOption);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  
  // Update local state when prop value changes
  useEffect(() => {
    setLocalSelectedOption(chip.selectedOption);
  }, [chip.selectedOption]);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (chip.options && chip.options.length > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      onClick?.(chip.id);
    }
  };

  // Add debouncing for filter changes
  const timeoutRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedOptionSelect = useCallback((chipId: string, option: FilterChipOption) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onOptionSelect?.(chipId, option);
    }, 100); // 100ms debounce delay (shorter than search since it's a direct selection)
  }, [onOptionSelect]);

  const handleOptionSelect = (option: FilterChipOption) => {
    // Update local state immediately
    setLocalSelectedOption(option);
    // Debounced notification to parent component
    debouncedOptionSelect(chip.id, option);
    setIsDropdownOpen(false);
  };

  // Use local state for immediate UI update
  const displayLabel = localSelectedOption ? localSelectedOption.label : chip.label;

  return (
    <FilterChipContainer className={className} ref={containerRef}>
      <ChipStateLayer onClick={handleClick}>
        <ChipLabel>{displayLabel}</ChipLabel>
        {isLoading ? (
          <ChipLoadingSpinner />
        ) : (
          <ChipIcon>
            <ChevronDownIcon />
          </ChipIcon>
        )}
      </ChipStateLayer>
      {isDropdownOpen && chip.options && chip.options.length > 0 && (
        <DropdownContainer>
          {chip.options.map((option) => (
            <DropdownOption
              key={option.id}
              isSelected={chip.selectedOption?.id === option.id}
              onClick={() => handleOptionSelect(option)}
            >
              {option.label}
            </DropdownOption>
          ))}
        </DropdownContainer>
      )}
    </FilterChipContainer>
  );
};