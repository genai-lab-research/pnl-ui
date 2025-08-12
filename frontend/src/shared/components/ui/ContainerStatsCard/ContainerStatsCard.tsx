/** @jsxImportSource @emotion/react */
import React, { useCallback } from 'react';
import { ContainerStatsCardProps } from './types';
import { useCardClasses } from './hooks';
import { ChartSection } from './components';
import {
  cardStyles,
  headerStyles,
  titleStyles,
  badgeStyles,
  chartsContainerStyles,
  loadingStyles,
  errorStyles,
} from './styles';

/**
 * ContainerStatsCard - A reusable card component for displaying container statistics with mini bar charts
 * 
 * Features:
 * - Displays multiple metrics with individual bar charts
 * - Responsive design that adapts to different screen sizes
 * - Support for multiple visual variants and sizes
 * - Loading and error states
 * - Accessibility support with proper ARIA labels
 * - Interactive support with keyboard navigation
 */
const ContainerStatsCard: React.FC<ContainerStatsCardProps> = ({
  title,
  totalCount,
  charts = [],
  variant = 'default',
  size = 'md',
  loading = false,
  error,
  footerSlot,
  ariaLabel,
  className = '',
  onClick,
}) => {
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
        aria-label="Loading container statistics"
      >
        <div css={headerStyles}>
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-badge" />
        </div>
        <div css={chartsContainerStyles}>
          <div className="skeleton skeleton-chart" />
          <div className="skeleton skeleton-chart" />
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
      aria-label={ariaLabel || `${title} statistics`}
    >
      {/* Header with title and count badge */}
      <header css={headerStyles}>
        <h2 css={titleStyles}>{title}</h2>
        {totalCount !== undefined && (
          <div css={badgeStyles} aria-label={`Total: ${totalCount}`}>
            {totalCount}
          </div>
        )}
      </header>

      {/* Charts Container */}
      {charts.length > 0 && (
        <div css={chartsContainerStyles}>
          {charts.map((chart, index) => (
            <ChartSection key={`${chart.title}-${index}`} chart={chart} />
          ))}
        </div>
      )}

      {/* Footer Slot */}
      {footerSlot && (
        <div>
          {footerSlot}
        </div>
      )}
    </div>
  );
};

export default ContainerStatsCard;