import React from 'react';
import { Box, Typography, Paper, SxProps, Theme } from '@mui/material';

export interface InformationGroupContainerProps {
  /**
   * The title for the information group
   */
  title: string;
  
  /**
   * Information fields or content
   */
  children: React.ReactNode;
  
  /**
   * Optional class name for custom styling
   */
  className?: string;
  
  /**
   * Whether to apply elevation to the container
   * @default false
   */
  elevated?: boolean;
  
  /**
   * Optional sx props for custom styling
   */
  sx?: SxProps<Theme>;
}

/**
 * Container for grouping related information fields with a title
 */
export const InformationGroupContainer: React.FC<InformationGroupContainerProps> = ({
  title,
  children,
  className,
  elevated = false,
  sx,
}) => {
  const ContainerComponent = elevated ? Paper : Box;
  
  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        mb: 3,
        ...sx
      }}
    >
      <Typography 
        variant="subtitle1" 
        fontWeight="medium" 
        gutterBottom
        sx={{
          fontSize: '0.9375rem',
          mb: 1,
        }}
      >
        {title}
      </Typography>
      
      <ContainerComponent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: elevated ? 2 : 1.5,
          p: elevated ? 2 : 0,
          borderRadius: 1,
        }}
        elevation={elevated ? 1 : 0}
      >
        {children}
      </ContainerComponent>
    </Box>
  );
};

export default InformationGroupContainer;