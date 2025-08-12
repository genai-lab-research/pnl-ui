/** @jsxImportSource @emotion/react */
import React from 'react';
import { containerStyles, segmentGroupStyles, segmentItemStyles, loadingStyles } from '../styles';

export interface LoadingSkeletonProps {
  size: 'sm' | 'md' | 'lg';
  variant: string;
  containerClasses: string;
  ariaLabel: string;
  skeletonCount?: number;
}

/**
 * Loading skeleton component for SegmentedControl
 * Provides visual feedback while data is loading
 */
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  size,
  variant,
  containerClasses,
  ariaLabel,
  skeletonCount = 2,
}) => {
  return (
    <div 
      css={[containerStyles, loadingStyles]} 
      className={containerClasses} 
      role="radiogroup" 
      aria-label={`${ariaLabel} (loading)`}
      aria-busy="true"
    >
      <div css={segmentGroupStyles}>
        {[...Array(skeletonCount)].map((_, index) => (
          <div
            key={`skeleton-${index}`}
            css={segmentItemStyles}
            className={`size-${size} variant-${variant}`}
            role="presentation"
            aria-hidden="true"
          >
            <div className="skeleton skeleton-segment" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;