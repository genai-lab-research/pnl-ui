/** @jsxImportSource @emotion/react */
import React, { useCallback } from 'react';
import {
  searchInputStyles,
  searchIconStyles,
  searchInputFieldStyles,
} from '../styles';
import SearchIcon from './SearchIcon';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * SearchInput - Reusable search input component
 * Includes search icon and proper accessibility
 */
const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  disabled = false,
  loading = false,
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || loading) return;
    onChange?.(e.target.value);
  }, [onChange, disabled, loading]);

  const isDisabled = disabled || loading;

  return (
    <div css={[searchInputStyles, isDisabled && { opacity: 0.6 }]}>
      <div css={searchIconStyles}>
        <SearchIcon />
      </div>
      <input
        css={searchInputFieldStyles}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={isDisabled}
        aria-label="Search input"
      />
    </div>
  );
};

export default SearchInput;