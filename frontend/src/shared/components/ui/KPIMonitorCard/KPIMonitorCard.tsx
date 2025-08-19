import React from 'react';
import { Box, Skeleton, Alert } from '@mui/material';
import { KPIMonitorCardProps } from './types';
import { useKPIMonitorCard } from './hooks';
import { getIconByName } from './utils';
import {
  StyledContainer,
  StyledTitleText,
  StyledValueContainer,
  StyledIconContainer,
  StyledValueText,
  LoadingContainer,
  FooterContainer,
} from './styles';

/**
 * KPIMonitorCard - A reusable component for displaying KPI metrics with icons and values
 * 
 * Use this component to show key performance indicators, monitoring values, 
 * or any metric data in a consistent, compact card format.
 * Perfect for dashboards, control panels, or metric displays.
 */
export const KPIMonitorCard: React.FC<KPIMonitorCardProps> = (props) => {
  const {
    title,
    subtitle,
    variant = 'default',
    size = 'md',
    loading = false,
    error,
    footerSlot,
    chartData,
    chartType,
    className,
    onClick,
    disabled = false,
    iconSlot,
    iconName,
  } = props;

  // Use custom hook for component logic
  const { mainValue, targetValueFormatted, generatedAriaLabel, shouldShowIcon, deltaInfo } = useKPIMonitorCard(props);
  // Handle loading state
  if (loading) {
    return (
      <LoadingContainer 
        className={className} 
        variant={variant}
        size={size}
        disabled={disabled}
        clickable={false}
        aria-label={generatedAriaLabel || 'Loading KPI monitor card'}
      >
        <Skeleton 
          variant="text" 
          width="60%" 
          height={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} 
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton 
            variant="circular" 
            width={size === 'sm' ? 20 : size === 'lg' ? 32 : 28} 
            height={size === 'sm' ? 20 : size === 'lg' ? 32 : 28} 
          />
          <Skeleton 
            variant="text" 
            width={80} 
            height={size === 'sm' ? 24 : size === 'lg' ? 40 : 32} 
          />
        </Box>
      </LoadingContainer>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Alert severity="error" sx={{ width: '100%', maxWidth: '208px' }}>
        {error}
      </Alert>
    );
  }

  // Render icon using utility function
  const renderIcon = () => {
    if (iconSlot) {
      return iconSlot;
    }
    return getIconByName(iconName);
  };

  return (
    <Box>
      <StyledContainer
        variant={variant}
        size={size}
        disabled={disabled}
        clickable={!!onClick}
        className={className}
        onClick={!disabled ? onClick : undefined}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        aria-label={generatedAriaLabel}
        onKeyDown={(e) => {
          if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {/* Title */}
        <StyledTitleText size={size}>
          {title}
        </StyledTitleText>

        {/* Value Container with Icon and Values */}
        <StyledValueContainer>
          {/* Icon on the left */}
          {shouldShowIcon && (
            <StyledIconContainer size={size}>
              {renderIcon()}
            </StyledIconContainer>
          )}

          {/* Main value */}
          {mainValue && (
            <StyledValueText size={size}>
              {mainValue}
            </StyledValueText>
          )}
          
          {/* Target value (sublabel) on the right */}
          {targetValueFormatted && (
            <Box component="span" sx={{ 
              fontSize: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px',
              color: (theme) => theme.palette.text.secondary,
              fontWeight: 400,
              alignSelf: 'flex-end',
              paddingBottom: '2px',
            }}>
              {targetValueFormatted}
            </Box>
          )}
        </StyledValueContainer>

        {/* Subtitle (if provided) */}
        {subtitle && (
          <StyledTitleText size={size} sx={{ opacity: 0.7, fontSize: '12px' }}>
            {subtitle}
          </StyledTitleText>
        )}

        {/* Delta indicator (if provided) */}
        {deltaInfo && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 0.5,
            fontSize: (theme) => theme.typography.caption.fontSize,
            color: deltaInfo.color,
          }}>
            <span>{deltaInfo.symbol}</span>
            <span>{deltaInfo.value}</span>
          </Box>
        )}

        {/* Chart (if provided) */}
        {chartData && chartType && (
          <Box sx={{ 
            height: '20px', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: '#6B7280'
          }}>
            {/* Placeholder for mini chart - would integrate with chart library */}
            [Mini {chartType} chart]
          </Box>
        )}
      </StyledContainer>

      {/* Footer slot */}
      {footerSlot && (
        <FooterContainer>
          {footerSlot}
        </FooterContainer>
      )}
    </Box>
  );
};

export default KPIMonitorCard;
