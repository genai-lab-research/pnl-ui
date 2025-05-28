import React from 'react';

import { Box, Paper } from '@mui/material';
import clsx from 'clsx';

export interface ContainerMediumProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const ContainerMedium: React.FC<ContainerMediumProps> = ({
  children,
  className,
  noPadding = false,
}) => {
  return (
    <Paper
      className={clsx(
        'rounded-lg border border-gray-200 bg-white shadow-sm',
        !noPadding && 'p-4',
        className,
      )}
      elevation={0}
    >
      <Box className="w-full">{children}</Box>
    </Paper>
  );
};

export default ContainerMedium;
