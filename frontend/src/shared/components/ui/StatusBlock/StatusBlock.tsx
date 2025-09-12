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
  status,
  statusVariant,
  size,
  variant,
  loading = false,
  error,
  className,
  ariaLabel,
  onClick,
  disabled = false,
  footerSlot,
}) => {
  // Set defaults within the function body to avoid type issues
  const effectiveStatus = status ?? 'Active';
  const effectiveStatusVariant = statusVariant ?? 'active';
  const effectiveSize = size ?? 'md';
  const effectiveVariant = variant ?? 'default';
  // Handle loading state
  if (loading) {
    return (
      <LoadingContainer className={className} aria-label={ariaLabel || 'Loading status block'}>
        <Skeleton 
          variant="circular" 
          width={effectiveSize === 'sm' ? 14 : effectiveSize === 'lg' ? 20 : 16} 
          height={effectiveSize === 'sm' ? 14 : effectiveSize === 'lg' ? 20 : 16} 
        />
        <Skeleton 
          variant="text" 
          sx={{ flex: 1, height: effectiveSize === 'sm' ? 16 : effectiveSize === 'lg' ? 24 : 20 }} 
        />
        <Skeleton 
          variant="rounded" 
          width={60} 
          height={effectiveSize === 'sm' ? 18 : effectiveSize === 'lg' ? 28 : 22} 
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
        variant={effectiveVariant}
        size={effectiveSize}
        disabled={disabled}
        clickable={!!onClick}
        className={className}
        onClick={!disabled ? onClick : undefined}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        aria-label={ariaLabel || `${title} - ${effectiveStatus}`}
      >
        {/* Icon */}
        {icon && (
          <IconContainer size={effectiveSize}>
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
        <DescriptionText size={effectiveSize} noWrap>
          {title}
        </DescriptionText>

        {/* Status Badge */}
        {effectiveStatus && (
          <StatusBadge
            label={effectiveStatus}
            variant={effectiveStatusVariant as any}
            size={effectiveSize as any}
            aria-label={`Status: ${effectiveStatus}`}
          />
        )}
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
