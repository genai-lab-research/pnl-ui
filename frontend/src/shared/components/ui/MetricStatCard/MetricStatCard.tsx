import React from 'react';
import { Skeleton, Alert } from '@mui/material';
import { MetricStatCardProps } from './types';
import { getPublicIconPath, getIconAltText, isValidPublicIcon, PublicIconName } from '../../../utils/iconUtils';
import {
  StyledContainer,
  StyledTitleText,
  StyledValueContainer,
  StyledIconContainer,
  StyledValueText,
  LoadingContainer,
  ErrorContainer,
  FooterContainer,
} from './styles';

// Default icon component for garden cart - fallback SVG (used when no public icon is available)
const DefaultGardenCartIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M2 2H4.5L6.5 14H18.5L21 6H8M6.5 14L5 6M6.5 14H18.5M6.5 18.5C6.5 19.3284 5.82843 20 5 20C4.17157 20 3.5 19.3284 3.5 18.5C3.5 17.6716 4.17157 17 5 17C5.82843 17 6.5 17.6716 6.5 18.5ZM20 18.5C20 19.3284 19.3284 20 18.5 20C17.6716 20 17 19.3284 17 18.5C17 17.6716 17.6716 17 18.5 17C19.3284 17 20 17.6716 20 18.5Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * MetricStatCard - A reusable component for displaying metric statistics with icons and values
 * 
 * Use this component to show metrics, KPIs, or statistical data in a consistent, 
 * compact card format. Perfect for dashboards, control panels, or metric displays.
 * 
 * Features:
 * - Responsive design that adapts to different screen sizes
 * - Multiple size variants (sm, md, lg)
 * - Visual variants (default, compact, outlined, elevated)
 * - Loading and error states
 * - Customizable icons and footer content
 * - Theme integration with consistent styling
 */
export const MetricStatCard: React.FC<MetricStatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  delta,
  deltaDirection,
  iconName,
  iconSlot,
  variant = 'default',
  size = 'md',
  loading = false,
  error,
  footerSlot,
  chartData,
  chartType,
  ariaLabel,
  className,
  onClick,
  disabled = false,
}) => {
  // Generate display value combining value, unit, and delta
  const displayValue = React.useMemo(() => {
    if (!value && !delta) return '';
    
    let result = '';
    if (value) {
      result += String(value);
      if (unit) result += unit;
    }
    
    if (delta) {
      result += ` ${delta}`;
    }
    
    return result;
  }, [value, unit, delta]);

  // Generate accessible label
  const generatedAriaLabel = React.useMemo(() => {
    if (ariaLabel) return ariaLabel;
    
    let label = `${title}`;
    if (displayValue) label += `: ${displayValue}`;
    if (subtitle) label += `, ${subtitle}`;
    if (error) label += `, Error: ${error}`;
    
    return label;
  }, [ariaLabel, title, displayValue, subtitle, error]);

  // Determine if component is clickable
  const isClickable = Boolean(onClick && !disabled);

  // Handle loading state
  if (loading) {
    return (
      <LoadingContainer 
        className={className} 
        variant={variant}
        size={size}
        disabled={disabled}
        clickable={false}
        role="status"
        aria-label="Loading metric data"
      >
        <Skeleton variant="text" width="60%" height={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Skeleton variant="circular" width={size === 'sm' ? 24 : size === 'lg' ? 32 : 28} height={size === 'sm' ? 24 : size === 'lg' ? 32 : 28} />
          <Skeleton variant="text" width="80%" height={size === 'sm' ? 28 : size === 'lg' ? 36 : 32} />
        </div>
        {footerSlot && <Skeleton variant="text" width="100%" height={16} />}
      </LoadingContainer>
    );
  }

  // Handle error state
  if (error) {
    return (
      <ErrorContainer className={className} role="alert" aria-label={`Error: ${error}`}>
        <Alert severity="error" variant="outlined">
          {error}
        </Alert>
      </ErrorContainer>
    );
  }

  // Render icon
  const renderIcon = () => {
    const iconSize = size === 'sm' ? 24 : size === 'lg' ? 32 : 28;
    
    if (iconSlot) {
      return (
        <StyledIconContainer size={size}>
          {iconSlot}
        </StyledIconContainer>
      );
    }
    
    // Try to use public icon first
    if (iconName && isValidPublicIcon(iconName)) {
      return (
        <StyledIconContainer size={size}>
          <img 
            src={getPublicIconPath(iconName)}
            alt={getIconAltText(iconName)}
            width={iconSize}
            height={iconSize}
            style={{ objectFit: 'contain' }}
          />
        </StyledIconContainer>
      );
    }
    
    // Handle legacy garden_cart icon name or default to cart
    if (iconName === 'garden_cart' || !iconName) {
      return (
        <StyledIconContainer size={size}>
          <img 
            src={getPublicIconPath('cart')}
            alt="Garden Cart"
            width={iconSize}
            height={iconSize}
            style={{ objectFit: 'contain' }}
          />
        </StyledIconContainer>
      );
    }
    
    // Fallback for unknown icon names - use default SVG
    return (
      <StyledIconContainer size={size}>
        <DefaultGardenCartIcon size={iconSize} />
      </StyledIconContainer>
    );
  };

  return (
    <StyledContainer
      className={className}
      variant={variant}
      size={size}
      disabled={disabled}
      clickable={isClickable}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : 'article'}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={generatedAriaLabel}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      {/* Title */}
      <StyledTitleText size={size}>
        {title}
      </StyledTitleText>
      
      {/* Value container with icon and value */}
      <StyledValueContainer>
        {renderIcon()}
        <StyledValueText size={size}>
          {displayValue}
        </StyledValueText>
      </StyledValueContainer>
      
      {/* Footer slot for additional content */}
      {footerSlot && (
        <FooterContainer>
          {footerSlot}
        </FooterContainer>
      )}
    </StyledContainer>
  );
};
