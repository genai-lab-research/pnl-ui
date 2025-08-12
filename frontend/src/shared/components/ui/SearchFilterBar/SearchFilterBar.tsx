/** @jsxImportSource @emotion/react */
import React from 'react';
import { SearchFilterBarProps } from './types';
import { useSearchFilterBarClasses } from './hooks';
import {
  containerStyles,
  leftSectionStyles,
  rightSectionStyles,
  filtersContainerStyles,
  loadingStyles,
} from './styles';
import {
  SearchInput,
  FilterChip,
  ToggleSwitch,
  ClearButton,
} from './components';

/**
 * SearchFilterBar - A reusable search and filtering toolbar component
 * 
 * Features:
 * - Search input with icon
 * - Multiple filter chips with dropdown functionality
 * - Toggle switch for additional filtering
 * - Clear filters action button
 * - Fully responsive design
 * - Loading and disabled states
 * - Accessibility support
 */
const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  filters = [],
  toggleLabel = 'Toggle',
  toggleValue = false,
  onToggleChange,
  clearButtonLabel = 'Clear Filters',
  onClearFilters,
  variant = 'default',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ariaLabel,
}) => {
  const containerClasses = useSearchFilterBarClasses({ variant, size, className });

  // Loading state
  if (loading) {
    return (
      <div
        css={[containerStyles, loadingStyles]}
        className={containerClasses}
        role="toolbar"
        aria-label="Loading search and filters"
      >
        <div css={leftSectionStyles}>
          <div className="skeleton skeleton-search" />
          <div css={filtersContainerStyles}>
            {Array.from({ length: Math.max(4, filters.length) }).map((_, index) => (
              <div key={index} className="skeleton skeleton-chip" />
            ))}
          </div>
        </div>
        <div css={rightSectionStyles}>
          <div className="skeleton skeleton-button" />
        </div>
      </div>
    );
  }

  return (
    <div
      css={containerStyles}
      className={containerClasses}
      role="toolbar"
      aria-label={ariaLabel || 'Search and filter controls'}
    >
      {/* Left Section: Search + Filters */}
      <div css={leftSectionStyles}>
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          disabled={disabled}
          loading={loading}
        />

        {/* Filter Chips */}
        <div css={filtersContainerStyles}>
          {filters.map((filter, index) => (
            <FilterChip
              key={filter.label || index}
              label={filter.label}
              selectedValue={filter.selectedValue}
              onSelect={filter.onSelect}
              disabled={disabled || filter.disabled}
              loading={loading}
            />
          ))}
        </div>
      </div>

      {/* Right Section: Toggle + Clear Button */}
      <div css={rightSectionStyles}>
        <ToggleSwitch
          label={toggleLabel}
          value={toggleValue}
          onChange={onToggleChange}
          disabled={disabled}
          loading={loading}
        />

        <ClearButton
          label={clearButtonLabel}
          onClick={onClearFilters}
          disabled={disabled}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default SearchFilterBar;