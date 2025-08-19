import React from 'react';
import { Skeleton, Alert } from '@mui/material';
import { DetailInfoCardProps } from './types';
import { getPublicIconPath, getIconAltText } from '../../../utils/iconUtils';
import {
  StyledContainer,
  StyledHeader,
  StyledDataGrid,
  StyledLabelColumn,
  StyledValueColumn,
  StyledDataLabel,
  StyledDataValue,
  StyledValueWithIcon,
  StyledIconContainer,
  StyledStatusBadge,
  StyledSection,
  StyledSectionHeader,
  StyledSectionContent,
  LoadingContainer,
  ErrorContainer,
  FooterContainer,
} from './styles';

// Default shipping container icon - fallback SVG
const DefaultShippingContainerIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M3 8V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V8M3 8L5 6H19L21 8M3 8H21M8 12H16M8 16H12" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * DetailInfoCard - A reusable component for displaying detailed information in a card format
 * 
 * Use this component to show structured data with labels and values, status badges,
 * and additional sections. Perfect for displaying entity details, configuration panels,
 * or information summaries.
 * 
 * Features:
 * - Responsive design that adapts to different screen sizes
 * - Multiple size variants (sm, md, lg)
 * - Visual variants (default, compact, outlined, elevated)
 * - Loading and error states
 * - Customizable status badges and sections
 * - Theme integration with consistent styling
 * - Proper accessibility support
 */
export const DetailInfoCard: React.FC<DetailInfoCardProps> = ({
  title,
  dataRows,
  statusBadge,
  sections,
  variant = 'default',
  size = 'md',
  loading = false,
  error,
  footerSlot,
  ariaLabel,
  className,
  onClick,
  disabled = false,
}) => {
  // Generate accessible label
  const generatedAriaLabel = React.useMemo(() => {
    if (ariaLabel) return ariaLabel;
    
    let label = `${title} information card`;
    if (statusBadge) label += `, status: ${statusBadge.text}`;
    if (error) label += `, Error: ${error}`;
    
    return label;
  }, [ariaLabel, title, statusBadge, error]);

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
        aria-label="Loading information"
      >
        <Skeleton variant="text" width="40%" height={size === 'sm' ? 20 : size === 'lg' ? 28 : 24} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} style={{ display: 'flex', gap: '24px' }}>
              <Skeleton variant="text" width="120px" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
            </div>
          ))}
        </div>
        {sections?.map((_, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton variant="text" width="30%" height={24} />
            <Skeleton variant="text" width="100%" height={60} />
          </div>
        ))}
        {footerSlot && <Skeleton variant="text" width="100%" height={40} />}
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

  // Render data value (with optional icon and status badge)
  const renderDataValue = (row: typeof dataRows[0], index: number) => {
    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;
    
    // Handle status badge specially
    if (statusBadge && row.label.toLowerCase().includes('status')) {
      return (
        <StyledStatusBadge 
          variant={statusBadge.variant} 
          size={size}
          key={`status-${index}`}
        >
          {statusBadge.text}
        </StyledStatusBadge>
      );
    }

    // Handle value with icon
    if (row.icon || (typeof row.value === 'string' && row.value.includes('Physical'))) {
      let icon = row.icon;
      
      // Use appropriate public icon based on content
      if (!icon && typeof row.value === 'string') {
        if (row.value.includes('Physical') || row.value.includes('Container')) {
          icon = (
            <img 
              src={getPublicIconPath('container')}
              alt={getIconAltText('container')}
              width={iconSize}
              height={iconSize}
              style={{ objectFit: 'contain' }}
            />
          );
        } else if (row.value.includes('Virtual')) {
          icon = (
            <img 
              src={getPublicIconPath('virtual')}
              alt={getIconAltText('virtual')}
              width={iconSize}
              height={iconSize}
              style={{ objectFit: 'contain' }}
            />
          );
        } else if (row.value.includes('Shipping')) {
          icon = (
            <img 
              src={getPublicIconPath('shipping')}
              alt={getIconAltText('shipping')}
              width={iconSize}
              height={iconSize}
              style={{ objectFit: 'contain' }}
            />
          );
        } else {
          // Default fallback to shipping container icon for physical items
          icon = <DefaultShippingContainerIcon size={iconSize} />;
        }
      }
      
      if (!icon) {
        icon = <DefaultShippingContainerIcon size={iconSize} />;
      }
      
      return (
        <StyledValueWithIcon key={`value-with-icon-${index}`}>
          <StyledIconContainer size={size}>
            {icon}
          </StyledIconContainer>
          <StyledDataValue size={size}>
            {row.value}
          </StyledDataValue>
        </StyledValueWithIcon>
      );
    }

    // Regular value
    return (
      <StyledDataValue size={size} key={`value-${index}`}>
        {row.value}
      </StyledDataValue>
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
      {/* Header */}
      <StyledHeader size={size}>
        {title}
      </StyledHeader>
      
      {/* Data Grid */}
      <StyledDataGrid>
        <StyledLabelColumn>
          {dataRows.map((row, index) => (
            <StyledDataLabel size={size} key={`label-${index}`}>
              {row.label}
            </StyledDataLabel>
          ))}
        </StyledLabelColumn>
        
        <StyledValueColumn>
          {dataRows.map((row, index) => renderDataValue(row, index))}
        </StyledValueColumn>
      </StyledDataGrid>

      {/* Additional Sections */}
      {sections?.map((section, index) => (
        <StyledSection key={`section-${index}`}>
          <StyledSectionHeader size={size}>
            {section.title}
          </StyledSectionHeader>
          <StyledSectionContent size={size}>
            {section.content}
          </StyledSectionContent>
        </StyledSection>
      ))}
      
      {/* Footer slot for additional content */}
      {footerSlot && (
        <FooterContainer>
          {footerSlot}
        </FooterContainer>
      )}
    </StyledContainer>
  );
};
