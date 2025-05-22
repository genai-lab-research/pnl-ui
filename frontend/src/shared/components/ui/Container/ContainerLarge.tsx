import React from 'react';
import { Box, Paper } from '@mui/material';
import clsx from 'clsx';

export interface ContainerLargeProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  title?: React.ReactNode;
  actions?: React.ReactNode;
}

export const ContainerLarge: React.FC<ContainerLargeProps> = ({ 
  children,
  className,
  noPadding = false,
  title,
  actions,
}) => {
  return (
    <Paper
      className={clsx(
        'bg-white border border-gray-200 rounded-lg shadow-sm w-full',
        className
      )}
      elevation={0}
    >
      {(title || actions) && (
        <Box className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <Box>{title}</Box>
          {actions && <Box>{actions}</Box>}
        </Box>
      )}
      <Box className={clsx(!noPadding && 'p-6', 'w-full')}>
        {children}
      </Box>
    </Paper>
  );
};

export default ContainerLarge;