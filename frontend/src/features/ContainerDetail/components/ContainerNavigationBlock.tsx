import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronRight, ArrowBack } from '@mui/icons-material';

export interface ContainerNavigationBlockProps {
  /** Container identifier to display in the breadcrumb */
  containerId: string;
  /** Optional click handler for navigation */
  onNavigate?: () => void;
  /** Loading state */
  loading?: boolean;
  /** Additional CSS class name */
  className?: string;
}

/**
 * ContainerNavigationBlock - Domain component for container breadcrumb navigation
 * 
 * Displays a navigation breadcrumb showing "Container Dashboard / {containerId}"
 * with a forward arrow icon. Used in the container detail page header.
 */
export const ContainerNavigationBlock: React.FC<ContainerNavigationBlockProps> = ({
  containerId,
  onNavigate,
  loading = false,
  className,
}) => {
  return (
    <Box 
      className={className}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.5,
        opacity: loading ? 0.6 : 1,
        transition: 'opacity 0.2s'
      }}
    >
      <IconButton
        size="small"
        onClick={onNavigate}
        disabled={loading}
        sx={{ 
          padding: '4px',
          marginRight: '4px',
          color: '#6b7280',
          '&:hover': {
            backgroundColor: '#f3f4f6'
          }
        }}
      >
        <ArrowBack sx={{ fontSize: 18 }} />
      </IconButton>
      <Typography
        component="button"
        onClick={onNavigate}
        disabled={loading}
        sx={{
          fontSize: '13px',
          color: '#6b7280',
          fontWeight: 400,
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: loading ? 'default' : 'pointer',
          textDecoration: 'none',
          transition: 'color 0.2s',
          '&:hover': {
            color: loading ? '#6b7280' : '#374151',
            textDecoration: loading ? 'none' : 'underline'
          }
        }}
      >
        Container Dashboard
      </Typography>
      <ChevronRight sx={{ fontSize: 16, color: '#9ca3af' }} />
      <Typography
        sx={{
          fontSize: '13px',
          color: '#111827',
          fontWeight: 500
        }}
      >
        {containerId}
      </Typography>
    </Box>
  );
};

export default ContainerNavigationBlock;
