import React from 'react';

import { Box } from '@mui/material';

import { SearchInput } from '../SearchInput';

export interface SearchInputContainerProps {
  /**
   * Search input placeholder
   * @default 'Search...'
   */
  placeholder?: string;

  /**
   * Current search value
   */
  value?: string;

  /**
   * Handler for search value changes
   */
  onChange?: (value: string) => void;

  /**
   * Handler for search submissions (when Enter is pressed)
   */
  onSearch?: (value: string) => void;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Optional children to render alongside the search input
   */
  children?: React.ReactNode;
}

/**
 * SearchInputContainer component with search input and optional content
 */
export const SearchInputContainer: React.FC<SearchInputContainerProps> = ({
  placeholder,
  value,
  onChange,
  onSearch,
  disabled = false,
  className,
  children,
}) => {
  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <SearchInput
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onSearch={onSearch}
          disabled={disabled}
        />
      </Box>
      {children && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{children}</Box>}
    </Box>
  );
};

export default SearchInputContainer;
