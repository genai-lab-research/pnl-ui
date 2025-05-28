import React from 'react';

import Button from '@mui/material/Button';

export interface ClearFiltersButtonProps {
  /**
   * Optional click handler
   */
  onClick?: () => void;

  /**
   * Optional custom class name
   */
  className?: string;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * ClearFiltersButton component for resetting filters
 */
export const ClearFiltersButton: React.FC<ClearFiltersButtonProps> = ({
  onClick,
  className,
  disabled = false,
}) => {
  return (
    <Button
      variant="outlined"
      color="inherit"
      onClick={onClick}
      className={className}
      disabled={disabled}
      sx={{
        borderRadius: '6px',
        textTransform: 'none',
        fontWeight: 500,
        borderColor: 'divider',
        color: '#424242',
        px: 2,
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'background.paper',
        },
      }}
    >
      Clear Filters
    </Button>
  );
};

export default ClearFiltersButton;
