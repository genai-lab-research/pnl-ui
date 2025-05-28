import React, { ReactNode, useState } from 'react';

import { Box, Menu, MenuItem } from '@mui/material';

import { FilterChip } from '../Chip';

export interface FilterOption {
  /**
   * Unique value for the filter option
   */
  value: string;
  /**
   * Display label for the filter option
   */
  label: string;
}

export interface FilterChipContainerProps {
  /**
   * Label for the filter
   */
  label?: string;

  /**
   * Available filter options
   */
  options?: FilterOption[];

  /**
   * Currently selected option value
   */
  selectedValue?: string;

  /**
   * Handler for filter selection changes
   */
  onChange?: (value: string) => void;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Whether the filter chip is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Width of the filter chip
   */
  width?: string | number;

  /**
   * Child components to render
   */
  children?: ReactNode;
}

/**
 * FilterChipContainer component for dropdown filters
 */
export const FilterChipContainer: React.FC<FilterChipContainerProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  className,
  disabled = false,
  width = 'auto',
  children,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Check if we're in dropdown mode (with options) or container mode (with children)
  const isDropdownMode = options && options.length > 0;

  // Find the selected option or use the first one as default (only in dropdown mode)
  const selectedOption = isDropdownMode
    ? options!.find((opt) => opt.value === selectedValue) || options![0]
    : undefined;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionSelect = (value: string) => {
    if (onChange) {
      onChange(value);
    }
    handleClose();
  };

  // Render different UI based on the mode
  if (isDropdownMode) {
    // Dropdown mode (original implementation)
    return (
      <Box className={className} sx={{ width }}>
        <FilterChip
          label={selectedOption ? selectedOption.label : label}
          isOpen={open}
          onClick={handleClick as any}
          disabled={disabled}
          selected={open}
          sx={{
            width: '100%',
            '.MuiChip-label': {
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
            },
          }}
        />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1,
              minWidth: anchorEl?.clientWidth || 120,
              maxHeight: '300px',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              selected={option.value === selectedValue}
              sx={{
                fontSize: '0.875rem',
                py: 0.75,
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  } else {
    // Container mode - just render children in a flex container
    return (
      <Box
        className={className}
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          width,
        }}
      >
        {children}
      </Box>
    );
  }
};

export default FilterChipContainer;
