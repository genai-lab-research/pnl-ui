/** @jsxImportSource @emotion/react */
import React from 'react';
import { FilterChipProps } from '../types';
import { useFilterChip } from '../hooks';
import { filterChipStyles, filterChipLabelStyles, filterChipIconStyles } from '../styles';
import ChevronDownIcon from './ChevronDownIcon';

interface FilterChipComponentProps extends FilterChipProps {
  disabled?: boolean;
  loading?: boolean;
}

/**
 * FilterChip - Individual filter chip component
 * Represents a selectable filter option with dropdown indicator
 */
const FilterChip: React.FC<FilterChipComponentProps> = ({
  label,
  selectedValue,
  onSelect,
  disabled = false,
  loading = false,
}) => {
  const { handleClick, handleKeyDown } = useFilterChip(
    selectedValue,
    onSelect,
    disabled || loading
  );

  const isDisabled = disabled || loading;

  return (
    <div
      css={[
        filterChipStyles,
        isDisabled && { opacity: 0.6, pointerEvents: 'none' }
      ]}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={`${label} filter`}
      aria-expanded="false"
      aria-haspopup="listbox"
    >
      <span css={filterChipLabelStyles}>{label}</span>
      <div css={filterChipIconStyles}>
        <ChevronDownIcon />
      </div>
    </div>
  );
};

export default FilterChip;