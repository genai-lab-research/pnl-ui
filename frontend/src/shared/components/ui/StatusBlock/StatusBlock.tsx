import React from 'react';
import { Box, Skeleton, Alert } from '@mui/material';
import { StatusBlockProps } from './types';
import {
  StatusBlockContainer,
  IconContainer,
  DescriptionText,
  StatusBadge,
  FooterContainer,
  LoadingContainer,
} from './styles';

/**
 * StatusBlock - A reusable component that displays an icon, description text, and status badge
 * 
 * Use this component to show status information in a consistent, horizontal layout.
 * Perfect for dashboard widgets, list items, or any status indicators.
 */
export const StatusBlock: React.FC<StatusBlockProps> = ({
  title,
  icon,
  status = 'Active',
  statusVariant = 'active',
  size = 'md',
  variant = 'default',
  loading = false,
  error,
  className,
  ariaLabel,
  onClick,
  disabled = false,
  footerSlot,
}) => {
  // Handle loading state
  if (loading) {
    return (
      <LoadingContainer className={className} aria-label={ariaLabel || 'Loading status block'}>
        <Skeleton 
          variant="circular" 
          width={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} 
          height={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} 
        />
        <Skeleton 
          variant="text" 
          sx={{ flex: 1, height: size === 'sm' ? 16 : size === 'lg' ? 24 : 20 }} 
        />
        <Skeleton 
          variant="rounded" 
          width={60} 
          height={size === 'sm' ? 18 : size === 'lg' ? 28 : 22} 
        />
      </LoadingContainer>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Alert severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <StatusBlockContainer
        variant={variant}
        size={size}
        disabled={disabled}
        clickable={!!onClick}
        className={className}
        onClick={!disabled ? onClick : undefined}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        aria-label={ariaLabel || `${title} - ${status}`}
      >
        {/* Icon */}
        {icon && (
          <IconContainer size={size}>
            {typeof icon === 'string' ? (
              <Box component="span" aria-hidden="true">
                {icon}
              </Box>
            ) : (
              icon
            )}
          </IconContainer>
        )}

        {/* Description */}
        <DescriptionText size={size} noWrap>
          {title}
        </DescriptionText>

        {/* Status Badge */}
        <StatusBadge
          label={status}
          variant={statusVariant}
          size={size}
          aria-label={`Status: ${status}`}
        />
      </StatusBlockContainer>

      {/* Footer slot */}
      {footerSlot && (
        <FooterContainer>
          {footerSlot}
        </FooterContainer>
      )}
    </Box>
  );
};

export default StatusBlock;
