import React from 'react';

import { Box } from '@mui/material';

import { FilterChipContainer, FilterOption } from './FilterChipContainer';

export interface FilterGroup {
  /**
   * Unique identifier for the filter group
   */
  id: string;
  /**
   * Display label for the filter group
   */
  label: string;
  /**
   * Available filter options
   */
  options: FilterOption[];
  /**
   * Currently selected option value
   */
  selectedValue?: string;
  /**
   * Whether this filter group is disabled
   */
  disabled?: boolean;
}

export interface ChipGroupContainerProps {
  /**
   * Array of filter groups to display
   */
  filterGroups: FilterGroup[];

  /**
   * Handler for filter selection changes
   */
  onFilterChange?: (groupId: string, value: string) => void;

  /**
   * Horizontal gap between filter chips
   * @default 2 (16px)
   */
  gap?: number;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Width of each filter chip
   * @default '120px'
   */
  chipWidth?: string | number;
}

/**
 * ChipGroupContainer component for displaying multiple filter chips in a row
 */
export const ChipGroupContainer: React.FC<ChipGroupContainerProps> = ({
  filterGroups,
  onFilterChange,
  gap = 2,
  className,
  chipWidth = '120px',
}) => {
  const handleFilterChange = (groupId: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(groupId, value);
    }
  };

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap,
      }}
    >
      {filterGroups.map((group) => (
        <FilterChipContainer
          key={group.id}
          label={group.label}
          options={group.options}
          selectedValue={group.selectedValue}
          onChange={(value) => handleFilterChange(group.id, value)}
          disabled={group.disabled}
          width={chipWidth}
        />
      ))}
    </Box>
  );
};

export default ChipGroupContainer;
