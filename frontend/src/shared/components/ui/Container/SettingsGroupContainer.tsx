import React from 'react';
import { Box, Typography, Divider, SxProps, Theme } from '@mui/material';

export interface SettingsGroupContainerProps {
  /**
   * The title for the settings section
   */
  title: string;
  
  /**
   * The settings options/toggles
   */
  children: React.ReactNode;
  
  /**
   * Optional class name for custom styling
   */
  className?: string;
  
  /**
   * Whether to show the divider above the settings group
   * @default true
   */
  withDivider?: boolean;
  
  /**
   * Optional sx props for custom styling
   */
  sx?: SxProps<Theme>;
}

/**
 * Container for grouping related settings with a section title
 */
export const SettingsGroupContainer: React.FC<SettingsGroupContainerProps> = ({
  title,
  children,
  className,
  withDivider = true,
  sx,
}) => {
  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        mt: 3,
        mb: 3,
        ...sx
      }}
    >
      {withDivider && (
        <Divider sx={{ mb: 2.5 }} />
      )}
      
      <Typography 
        variant="h6" 
        fontWeight={500} 
        sx={{
          fontSize: '1rem',
          mb: 1.5,
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

export default SettingsGroupContainer;