import React from 'react';

import { Box, SxProps, Theme, Typography } from '@mui/material';

export interface NewContainerInfoContainerProps {
  /**
   * The title for the information section
   */
  title: string;

  /**
   * The form fields or content
   */
  children: React.ReactNode;

  /**
   * Optional class name for custom styling
   */
  className?: string;

  /**
   * Optional sx props for custom styling
   */
  sx?: SxProps<Theme>;
}

/**
 * Container for grouping related form fields in the container creation flow
 */
export const NewContainerInfoContainer: React.FC<NewContainerInfoContainerProps> = ({
  title,
  children,
  className,
  sx,
}) => {
  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mb: 3,
        ...sx,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="medium"
        sx={{
          fontSize: '1.125rem',
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default NewContainerInfoContainer;
