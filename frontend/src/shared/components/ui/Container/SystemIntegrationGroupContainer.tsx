import React from 'react';
import { Box, Typography, FormGroup, SxProps, Theme } from '@mui/material';

export interface SystemIntegrationGroupContainerProps {
  /**
   * The title for the system integration section
   */
  title: string;
  
  /**
   * The integration options (typically checkboxes)
   */
  children: React.ReactNode;
  
  /**
   * Optional description for the integration group
   */
  description?: string;
  
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
 * Container for system integration options with a title and description
 */
export const SystemIntegrationGroupContainer: React.FC<SystemIntegrationGroupContainerProps> = ({
  title,
  children,
  description,
  className,
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
      <Typography 
        variant="h6" 
        fontWeight={500} 
        sx={{
          fontSize: '1rem',
          mb: description ? 0.5 : 1.5,
        }}
      >
        {title}
      </Typography>
      
      {description && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mb: 1.5 }}
        >
          {description}
        </Typography>
      )}
      
      <FormGroup sx={{ ml: -1 }}>
        {children}
      </FormGroup>
    </Box>
  );
};

export default SystemIntegrationGroupContainer;