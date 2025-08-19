import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SearchInputProps } from '../types';
import { SearchInputContainer, SearchIcon, SearchInput as StyledSearchInput, LoadingSpinner } from '../styles';

const MagnifyingGlassIcon: React.FC = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
      fill="currentColor"
    />
  </svg>
);

export const SearchInput: React.FC<SearchInputProps> = ({
  value = '',
  onChange,
  placeholder = 'Search containers...',
  className,
  isLoading = false
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue); // Update local state immediately
    onChange?.(newValue); // Call parent immediately, let parent handle debouncing
  };

  return (
    <SearchInputContainer className={className}>
      <SearchIcon>
        <MagnifyingGlassIcon />
      </SearchIcon>
      <StyledSearchInput
        type="text"
        value={localValue}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
      {isLoading && <LoadingSpinner />}
    </SearchInputContainer>
  );
};