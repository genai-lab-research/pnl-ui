import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { ContainerStatusHeaderProps } from '../types/ui-models';
import { getTypeIconPath, getTypeIconAlt } from '../../../shared/components/ui/VerticalFarmingTable/utils/iconUtils';

/**
 * ContainerStatusHeader - Domain component for displaying container information with type, tenant, and status
 * 
 * Displays container information in a compact horizontal layout showing:
 * - Container type icon (physical/virtual)
 * - Container type label
 * - Tenant information
 * - Status badge
 */
export const ContainerStatusHeader: React.FC<ContainerStatusHeaderProps> = ({
  containerName,
  containerType = 'physical',
  tenantName,
  status = 'Active',
  statusVariant = 'active',
  loading = false,
  className
}) => {
  if (loading) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        gap={1} 
        className={className}
        sx={{ opacity: 0.6 }}
      >
        <Box 
          sx={{ 
            width: 20, 
            height: 20, 
            backgroundColor: '#e0e0e0', 
            borderRadius: '2px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} 
        />
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Map physical/virtual to the table icon types
  const iconType = containerType === 'physical' ? 'container' : 'virtual';
  const iconPath = getTypeIconPath(iconType);
  const iconAlt = getTypeIconAlt(iconType);

  // Status color mapping - using theme colors for consistency
  const getStatusColors = (variant: string) => {
    switch (variant) {
      case 'active':
        return {
          backgroundColor: '#e8f5e8', // Light green background
          color: '#479F67', // Theme success color
          borderColor: '#c3e6c3'
        };
      case 'inactive':
        return {
          backgroundColor: '#f3f4f6', // Light gray background
          color: '#6B7280', // Theme inactive color
          borderColor: '#d1d5db'
        };
      case 'maintenance':
        return {
          backgroundColor: '#fef3e2', // Light orange background
          color: '#F97316', // Theme warning color
          borderColor: '#fed7aa'
        };
      case 'error':
        return {
          backgroundColor: '#fee2e2', // Light red background
          color: '#f44336', // Theme danger color
          borderColor: '#fecaca'
        };
      default:
        return {
          backgroundColor: '#f3f4f6', // Light gray background
          color: '#6B7280', // Theme inactive color
          borderColor: '#d1d5db'
        };
    }
  };

  return (
    <Box 
      display="flex" 
      alignItems="center" 
      gap={1} 
      className={className}
      sx={{
        padding: '6px 12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        border: '1px solid #e5e7eb'
      }}
    >
      {/* Container Type Icon */}
      <Box
        component="img"
        src={iconPath}
        alt={iconAlt}
        sx={{
          width: 16,
          height: 16,
          flexShrink: 0
        }}
      />
      
      {/* Container Type Label */}
      <Typography 
        variant="body2" 
        sx={{ 
          fontSize: '13px',
          fontWeight: 500,
          color: '#374151',
          textTransform: 'capitalize'
        }}
      >
        {containerType} container
      </Typography>

      {/* Separator */}
      <Box
        sx={{
          width: '1px',
          height: '12px',
          backgroundColor: '#d1d5db',
          flexShrink: 0
        }}
      />

      {/* Tenant Name */}
      {tenantName && (
        <>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '13px',
              color: '#6b7280'
            }}
          >
            {tenantName}
          </Typography>

          {/* Separator */}
          <Box
            sx={{
              width: '1px',
              height: '12px',
              backgroundColor: '#d1d5db',
              flexShrink: 0
            }}
          />
        </>
      )}

      {/* Status Badge */}
      <Chip
        label={status}
        size="small"
        sx={{
          height: '20px',
          fontSize: '11px',
          fontWeight: 600,
          backgroundColor: getStatusColors(statusVariant).backgroundColor,
          color: getStatusColors(statusVariant).color,
          border: `1px solid ${getStatusColors(statusVariant).borderColor}`,
          '& .MuiChip-label': {
            padding: '0 6px'
          }
        }}
      />
    </Box>
  );
};

export default ContainerStatusHeader;
