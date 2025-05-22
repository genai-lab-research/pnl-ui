import React from 'react';
import { Chip as MuiChip, ChipProps as MuiChipProps, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export interface FilterChipProps extends Omit<MuiChipProps, 'onClick'> {
  /**
   * Label displayed on the chip
   */
  label: string;
  
  /**
   * Whether the dropdown is open
   */
  isOpen?: boolean;
  
  /**
   * Click handler
   */
  onClick?: () => void;
  
  /**
   * Whether the chip is currently selected/active
   */
  selected?: boolean;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * FilterChip component for filter dropdowns
 */
export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isOpen = false,
  onClick,
  selected = false,
  className,
  ...props
}) => {
  return (
    <MuiChip
      label={
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 0.5,
        }}>
          <span>{label}</span>
          <KeyboardArrowDownIcon 
            fontSize="small"
            sx={{ 
              transition: 'transform 0.2s',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
              marginLeft: '2px',
              fontSize: '18px',
            }}
          />
        </Box>
      }
      onClick={onClick}
      className={className}
      sx={{
        borderRadius: '4px',
        backgroundColor: selected ? 'primary.main' : 'action.selected',
        color: selected ? 'primary.contrastText' : 'text.primary',
        fontWeight: 500,
        fontSize: '0.8125rem',
        '&:hover': {
          backgroundColor: selected ? 'primary.dark' : 'action.hover',
        },
        '& .MuiChip-label': {
          paddingLeft: '12px',
          paddingRight: '12px',
        },
      }}
      {...props}
    />
  );
};

export default FilterChip;