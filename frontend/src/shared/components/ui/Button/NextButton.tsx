import React from 'react';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Button from '@mui/material/Button';

export interface NextButtonProps {
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
 * NextButton component for navigation
 */
export const NextButton: React.FC<NextButtonProps> = ({ onClick, className, disabled = false }) => {
  return (
    <Button
      variant="outlined"
      color="inherit"
      endIcon={<NavigateNextIcon />}
      onClick={onClick}
      className={className}
      disabled={disabled}
      sx={{
        borderRadius: '6px',
        textTransform: 'none',
        fontWeight: 500,
        borderColor: 'divider',
        color: 'text.primary',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'background.paper',
        },
      }}
    >
      Next
    </Button>
  );
};

export default NextButton;
