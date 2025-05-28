import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Box, Divider, IconButton, SxProps, Theme, Typography } from '@mui/material';

export interface DrawerHeaderContainerProps {
  /**
   * The drawer title
   */
  title: string;

  /**
   * Function called when the close button is clicked
   */
  onClose: () => void;

  /**
   * Optional class name for custom styling
   */
  className?: string;

  /**
   * Whether to show the bottom divider
   * @default true
   */
  withDivider?: boolean;

  /**
   * Optional sx props for custom styling
   */
  sx?: SxProps<Theme>;
}

/**
 * DrawerHeaderContainer component for drawer headers with title and close button
 */
export const DrawerHeaderContainer: React.FC<DrawerHeaderContainerProps> = ({
  title,
  onClose,
  className,
  withDivider = true,
  sx,
}) => {
  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5,
          px: 2,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            fontSize: '1.375rem',
            letterSpacing: '-0.75px',
          }}
        >
          {title}
        </Typography>

        <IconButton aria-label="Close drawer" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {withDivider && <Divider sx={{ borderColor: 'divider' }} />}
    </Box>
  );
};

export default DrawerHeaderContainer;
