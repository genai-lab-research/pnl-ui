import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

export interface InformationGroupElementsContainerProps {
  /**
   * The form fields or content elements
   */
  children: React.ReactNode;
  
  /**
   * Optional class name for custom styling
   */
  className?: string;
  
  /**
   * Space between elements 
   * @default 'medium'
   */
  spacing?: 'small' | 'medium' | 'large';
  
  /**
   * Optional sx props for custom styling
   */
  sx?: SxProps<Theme>;
}

/**
 * Container for form fields or elements arranged vertically
 */
export const InformationGroupElementsContainer: React.FC<InformationGroupElementsContainerProps> = ({
  children,
  className,
  spacing = 'medium',
  sx,
}) => {
  // Define spacing values based on the spacing prop
  const spacingValues = {
    small: 1,
    medium: 2,
    large: 3,
  };
  
  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: spacingValues[spacing],
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

export default InformationGroupElementsContainer;