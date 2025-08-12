/** @jsxImportSource @emotion/react */
import React, { useCallback } from 'react';
import { TemperatureMetricCardProps } from './types';
import SvgIcon from '../SvgIcon/SvgIcon';
import { useFormattedTemperature, useCardClasses } from './hooks';
import {
  cardStyles,
  titleStyles,
  valueContainerStyles,
  temperatureValueStyles,
  iconStyles,
  loadingStyles,
  errorStyles,
} from './styles';

/**
 * TemperatureMetricCard - A reusable card component for displaying temperature metrics
 * 
 * Features:
 * - Displays current and optionally target temperature values
 * - Fully responsive design that adapts to different screen sizes
 * - Support for multiple visual variants (default, compact, outlined, elevated)
 * - Customizable sizes (sm, md, lg)
 * - Loading and error states
 * - Accessibility support with proper ARIA labels
 * - Interactive support with keyboard navigation
 * - Icon support via slots or predefined thermometer icon
 */
const TemperatureMetricCard: React.FC<TemperatureMetricCardProps> = ({
  title,
  currentValue,
  targetValue,
  unit = '°C',
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
  const formattedTemperature = useFormattedTemperature({ currentValue, targetValue, unit });
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
        aria-label="Loading temperature data"
      >
        <div className="skeleton skeleton-title" />
        <div css={valueContainerStyles}>
          <div className="skeleton skeleton-value" />
        </div>
      </div>
    );
  }

  return (
    <div
      css={cardStyles}
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel || `${title}: ${formattedTemperature}`}
    >
      {/* Card Title */}
      <h3 css={titleStyles}>
        {title}
      </h3>
      
      {/* Temperature Value Container with Icon */}
      <div css={valueContainerStyles}>
        {(iconName || iconSlot) && (
          <div css={iconStyles}>
            {iconSlot || (
              iconName && (
                <SvgIcon
                  id={`temperature-icon-${iconName}`}
                  path={`/2615_207745/component_2615_207109.svg`}
                  width={28}
                  alt={`${title} thermometer icon`}
                />
              )
            )}
          </div>
        )}
        
        {/* Temperature Value */}
        <div>
          <p css={temperatureValueStyles}>
            {formattedTemperature}
          </p>
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

export default TemperatureMetricCard;