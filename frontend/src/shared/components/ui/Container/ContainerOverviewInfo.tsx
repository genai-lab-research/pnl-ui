import React from 'react';
import { Box, Paper } from '@mui/material';
import clsx from 'clsx';

export interface ContainerOverviewInfoProps {
  children: React.ReactNode;
  className?: string;
}

export const ContainerOverviewInfo: React.FC<ContainerOverviewInfoProps> = ({ 
  children,
  className,
}) => {
  return (
    <Paper
      className={clsx(
        'bg-white border border-gray-200 rounded-lg shadow-sm w-full',
        className
      )}
      elevation={0}
    >
      <Box className="p-4 w-full">
        {children}
      </Box>
    </Paper>
  );
};

export default ContainerOverviewInfo;