import React from 'react';

import { Box, Paper } from '@mui/material';
import clsx from 'clsx';

export interface TableContainerProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  elevated?: boolean;
}

export const TableContainer: React.FC<TableContainerProps> = ({
  children,
  className,
  bordered = true,
  elevated = false,
}) => {
  return (
    <Paper
      className={clsx('w-full overflow-auto', bordered && 'border border-gray-200', className)}
      elevation={elevated ? 1 : 0}
      sx={{
        borderRadius: '0.5rem',
      }}
    >
      <Box className="w-full">{children}</Box>
    </Paper>
  );
};

export default TableContainer;
