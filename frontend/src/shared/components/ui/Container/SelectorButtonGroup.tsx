import React from 'react';

import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

export interface SelectorOption {
  /**
   * Unique identifier for the option
   */
  id: string;
  /**
   * Display label for the option
   */
  label: string;
  /**
   * Optional disabled state
   */
  disabled?: boolean;
}

export interface SelectorButtonGroupProps {
  /**
   * Options to display in the selector
   */
  options: SelectorOption[];

  /**
   * Currently selected option id
   */
  selectedId: string;

  /**
   * Handler for selection changes
   */
  onChange: (value: string) => void;

  /**
   * Size of the button group
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Custom class name
   */
  className?: string;
}

/**
 * SelectorButtonGroup container for tab-style option selection
 */
export const SelectorButtonGroup: React.FC<SelectorButtonGroupProps> = ({
  options,
  selectedId,
  onChange,
  size = 'medium',
  className,
}) => {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    // Prevent deselection
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <Box className={className}>
      <ToggleButtonGroup
        value={selectedId}
        exclusive
        onChange={handleChange}
        aria-label="selector button group"
        size={size}
        sx={{
          borderRadius: 1,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          '& .MuiToggleButtonGroup-grouped': {
            margin: 0,
            border: 0,
            borderRadius: 0,
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
            '&:not(:first-of-type)': {
              borderLeft: '1px solid',
              borderColor: 'divider',
            },
            '&:first-of-type': {
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
            },
            '&:last-of-type': {
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
            },
          },
        }}
      >
        {options.map((option) => (
          <ToggleButton
            key={option.id}
            value={option.id}
            disabled={option.disabled}
            sx={{
              textTransform: 'none',
              px: 3,
              fontWeight: selectedId === option.id ? 500 : 400,
              color: 'text.primary',
              '&.Mui-selected': {
                color: 'primary.contrastText',
              },
              '&.Mui-disabled': {
                color: 'text.disabled',
              },
            }}
          >
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default SelectorButtonGroup;
