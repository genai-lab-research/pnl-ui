/** @jsxImportSource @emotion/react */
import React, { useCallback } from 'react';
import { BaseMetricCardProps } from './types';
import {
  cardStyles,
  contentStyles,
  titleStyles,
  valueContainerStyles,
  primaryValueStyles,
  secondaryValueStyles,
  changeIndicatorStyles,
  iconStyles,
  loadingStyles,
  errorStyles
} from './styles';

/**
 * BaseMetricCard - A reusable base component for all metric cards
 * 
 * Features:
 * - Consistent layout with icon, title, values, and change indicators
 * - Support for primary and secondary values
 * - Change indicators with positive/negative styling
 * - Loading and error states
 * - Fully accessible with ARIA labels
 * - Responsive design
 */
const BaseMetricCard: React.FC<BaseMetricCardProps> = ({
  title,
  icon,
  value,
  secondaryValue,
  changeValue,
  isPositiveChange = true,
  transparent = false,
  loading = false,
  error,
  className = '',
  onClick,
  ariaLabel
}) => {
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
        {error}
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div
        css={[cardStyles, loadingStyles]}
        className={className}
        role="status"
        aria-label="Loading metric data"
      >
        <div css={iconStyles}>
          <div className="skeleton" style={{ width: 24, height: 24, borderRadius: '50%' }} />
        </div>
        <div css={contentStyles}>
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-value" />
        </div>
      </div>
    );
  }

  const classes = [className];
  if (onClick) {
    classes.push('clickable');
  }
  if (transparent) {
    classes.push('transparent');
  }

  return (
    <div
      css={cardStyles}
      className={classes.filter(Boolean).join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel || `${title}: ${value}${secondaryValue ? ` / ${secondaryValue}` : ''}${changeValue ? ` ${changeValue}` : ''}`}
    >
      {/* Icon */}
      <div css={iconStyles}>
        {icon}
      </div>

      {/* Content */}
      <div css={contentStyles}>
        {/* Title */}
        <h3 css={titleStyles}>{title}</h3>

        {/* Values */}
        <div css={valueContainerStyles}>
          <span css={primaryValueStyles}>{value}</span>
          {secondaryValue && (
            <>
              <span css={secondaryValueStyles}>/</span>
              <span css={secondaryValueStyles}>{secondaryValue}</span>
            </>
          )}
          {changeValue && (
            <span 
              css={changeIndicatorStyles} 
              className={isPositiveChange ? 'positive' : 'negative'}
            >
              {changeValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BaseMetricCard;