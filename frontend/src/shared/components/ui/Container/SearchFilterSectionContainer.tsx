import React from 'react';

import { Box, Button, FormControlLabel, Switch } from '@mui/material';

import { SearchInput } from '../SearchInput';
import { ChipGroupContainer, FilterGroup } from './ChipGroupContainer';

export interface SearchFilterSectionContainerProps {
  /**
   * Search input placeholder
   * @default 'Search...'
   */
  searchPlaceholder?: string;

  /**
   * Current search value
   */
  searchValue?: string;

  /**
   * Handler for search value changes
   */
  onSearchChange?: (value: string) => void;

  /**
   * Handler for search submission
   */
  onSearch?: (value: string) => void;

  /**
   * Array of filter groups to display
   */
  filterGroups: FilterGroup[];

  /**
   * Handler for filter selection changes
   */
  onFilterChange?: (groupId: string, value: string) => void;

  /**
   * Boolean toggle flags
   */
  toggleFilters?: Array<{
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }>;

  /**
   * Click handler for the "Clear Filters" button
   */
  onClearFilters?: () => void;

  /**
   * Whether the search and filters are disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom class name
   */
  className?: string;
}

/**
 * SearchFilterSectionContainer component combining search, filters, and toggles
 */
export const SearchFilterSectionContainer: React.FC<SearchFilterSectionContainerProps> = ({
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  onSearch,
  filterGroups,
  onFilterChange,
  toggleFilters = [],
  onClearFilters,
  disabled = false,
  className,
}) => {
  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        flexWrap: 'wrap',
        gap: 2,
        p: 2,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {/* Search input */}
      <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '300px' } }}>
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          onSearch={onSearch}
          disabled={disabled}
        />
      </Box>

      {/* Filter chips */}
      {filterGroups.length > 0 && (
        <ChipGroupContainer
          filterGroups={filterGroups.map((group) => ({
            ...group,
            disabled: disabled || group.disabled,
          }))}
          onFilterChange={onFilterChange}
          chipWidth="140px"
        />
      )}

      {/* Toggle switches */}
      {toggleFilters.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'nowrap',
            alignItems: 'center',
          }}
        >
          {toggleFilters.map((filter) => (
            <FormControlLabel
              key={filter.id}
              control={
                <Switch
                  size="small"
                  checked={filter.checked}
                  onChange={(e) => filter.onChange(e.target.checked)}
                  disabled={disabled}
                />
              }
              label={filter.label}
              sx={{
                margin: 0,
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.875rem',
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Clear filters button */}
      {onClearFilters && (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={onClearFilters}
          disabled={disabled}
          sx={{
            minWidth: '120px',
            whiteSpace: 'nowrap',
          }}
        >
          Clear Filters
        </Button>
      )}
    </Box>
  );
};

export default SearchFilterSectionContainer;
