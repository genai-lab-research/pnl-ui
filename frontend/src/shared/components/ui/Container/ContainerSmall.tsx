import React from 'react';

import { Box, Paper } from '@mui/material';
import clsx from 'clsx';

export interface ContainerSmallProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const ContainerSmall: React.FC<ContainerSmallProps> = ({
  children,
  className,
  noPadding = false,
}) => {
  return (
    <Paper
      className={clsx(
        'rounded-md border border-gray-200 bg-white shadow-sm',
        !noPadding && 'p-3',
        className,
      )}
      elevation={0}
    >
      <Box className="w-full">{children}</Box>
    </Paper>
  );
};

export default ContainerSmall;
