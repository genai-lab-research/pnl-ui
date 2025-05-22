import React from 'react';
import { Box, Paper } from '@mui/material';
import clsx from 'clsx';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'elevated';
  backgroundColor?: string;
}

export const Container: React.FC<ContainerProps> = ({ 
  children,
  className,
  noPadding = false,
  padding = 'medium',
  variant = 'outlined',
  backgroundColor = 'white',
}) => {
  // Determine padding class based on prop
  const paddingClass = noPadding 
    ? 'p-0' 
    : padding === 'none' 
    ? 'p-0' 
    : padding === 'small' 
    ? 'p-2' 
    : padding === 'large' 
    ? 'p-6' 
    : 'p-4';

  // Determine elevation based on variant
  const elevation = variant === 'elevated' ? 1 : 0;
  
  // Determine border class based on variant
  const borderClass = variant === 'outlined' ? 'border border-gray-200' : '';
  
  return (
    <Paper
      className={clsx(
        paddingClass,
        borderClass,
        'rounded-lg',
        className
      )}
      elevation={elevation}
      sx={{
        backgroundColor,
      }}
    >
      <Box className="w-full">
        {children}
      </Box>
    </Paper>
  );
};

export default Container;