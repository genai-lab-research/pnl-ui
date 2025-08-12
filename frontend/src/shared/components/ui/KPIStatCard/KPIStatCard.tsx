/** @jsxImportSource @emotion/react */
import React, { useCallback } from 'react';
import { KPIStatCardProps } from './types';
import SvgIcon from '../SvgIcon/SvgIcon';
import { useFormattedValue, useCardClasses } from './hooks';
import {
  cardStyles,
  titleStyles,
  valueContainerStyles,
  valueStyles,
  deltaStyles,
  iconStyles,
  loadingStyles,
  errorStyles,
} from './styles';

/**
 * KPIStatCard - A reusable card component for displaying key performance indicators
 * 
 * Features:
 * - Fully responsive design that adapts to different screen sizes
 * - Support for multiple visual variants (default, compact, outlined, elevated)
 * - Customizable sizes (sm, md, lg)
 * - Loading and error states
 * - Accessibility support with proper ARIA labels
 * - Interactive support with keyboard navigation
 * - Delta values with directional styling
 * - Icon support via slots or predefined icons
 */
const KPIStatCard: React.FC<KPIStatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  delta,
  deltaDirection = 'flat',
  iconName,
  iconSlot,
  variant = 'default',
  size = 'md',
  loading = false,
  error,
  footerSlot,
  ariaLabel,
  className = '',
  onClick,
}) => {
  const formattedValue = useFormattedValue({ value, unit, delta, deltaDirection });
  const cardClasses = useCardClasses({ variant, size, onClick, className });

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);

  // Error state
  if (error) {
    return (
      <div css={[cardStyles, errorStyles]} className={className}>
        <p>Error: {error}</p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div
        css={[cardStyles, loadingStyles]}
        className={cardClasses}
        role="status"
        aria-label="Loading metric data"
      >
        <div className="skeleton skeleton-title" />
        <div css={valueContainerStyles}>
          <div className="skeleton skeleton-value" />
        </div>
      </div>
    );
  }

  const deltaClass = delta !== undefined ? `delta-${deltaDirection}` : '';

  return (
    <div
      css={cardStyles}
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel || `${title}: ${formattedValue}`}
    >
      {/* Card Title */}
      <h3 css={titleStyles}>
        {title}
      </h3>
      
      {/* Value Container with Icon */}
      <div css={valueContainerStyles}>
        {(iconName || iconSlot) && (
          <div css={iconStyles}>
            {iconSlot || (
              iconName && (
                <SvgIcon
                  id={`kpi-icon-${iconName}`}
                  path={`/2615_207747/component_2615_207128.svg`}
                  width={28}
                  alt={`${title} icon`}
                />
              )
            )}
          </div>
        )}
        
        {/* Value and Delta */}
        <div>
          <p css={[valueStyles, delta !== undefined && deltaStyles]} className={deltaClass}>
            {formattedValue}
          </p>
          {subtitle && (
            <p css={[titleStyles, { opacity: 0.7, fontSize: '0.75rem' }]}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {/* Footer Slot */}
      {footerSlot && (
        <div>
          {footerSlot}
        </div>
      )}
    </div>
  );
};

export default KPIStatCard;