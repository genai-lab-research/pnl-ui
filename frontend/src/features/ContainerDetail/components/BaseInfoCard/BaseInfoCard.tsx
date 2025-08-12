import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { BaseInfoCardProps } from './BaseInfoCard.types';
import { styles } from './BaseInfoCard.styles';

export const BaseInfoCard: React.FC<BaseInfoCardProps> = ({
  title,
  children,
  variant = 'default',
  elevation = 1,
  className,
  sx = {}
}) => {
  return (
    <Paper 
      elevation={elevation}
      className={className}
      sx={{
        ...styles.root,
        ...(variant === 'outlined' && styles.outlined),
        ...sx
      }}
    >
      <Typography variant="h6" sx={styles.title}>
        {title}
      </Typography>
      <Box sx={styles.content}>
        {children}
      </Box>
    </Paper>
  );
};