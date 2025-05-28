import React from 'react';

import { InputAdornment, InputBase, Paper } from '@mui/material';

import { SearchIcon } from '../Icon';

export interface SearchInputProps {
  /**
   * Placeholder text
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
   * Width of the search input
   * @default '100%'
   */
  width?: string | number;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * SearchInput component with search icon
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  width = '100%',
  className,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <Paper
      component="div"
      className={className}
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        px: 2,
        py: 0.75,
      }}
    >
      <InputBase
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        fullWidth
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon
              sx={{
                color: disabled ? 'text.disabled' : 'text.secondary',
                fontSize: 20,
              }}
            />
          </InputAdornment>
        }
        sx={{
          fontSize: '0.875rem',
          '& .MuiInputBase-input': {
            padding: '8px 0',
          },
        }}
      />
    </Paper>
  );
};

export default SearchInput;
