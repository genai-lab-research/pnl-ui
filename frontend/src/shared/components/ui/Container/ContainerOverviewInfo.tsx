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
      className={clsx('w-full rounded-lg border border-gray-200 bg-white shadow-sm', className)}
      elevation={0}
    >
      <Box className="w-full p-4">{children}</Box>
    </Paper>
  );
};

export default ContainerOverviewInfo;
