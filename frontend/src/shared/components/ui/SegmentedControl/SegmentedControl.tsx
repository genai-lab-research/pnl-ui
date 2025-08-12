/** @jsxImportSource @emotion/react */
import React, { useCallback, useMemo } from 'react';
import { SegmentedControlProps } from './types';
import { useSegmentClasses, useKeyboardNavigation } from './hooks';
import { containerStyles, segmentGroupStyles } from './styles';
import { SegmentButton, LoadingSkeleton, ErrorMessage } from './components';

/**
 * SegmentedControl - A reusable segmented control component for selecting between multiple options
 * 
 * @component
 * @example
 * ```tsx
 * <SegmentedControl
 *   options={[
 *     { id: 'physical', label: 'Physical' },
 *     { id: 'virtual', label: 'Virtual' }
 *   ]}
 *   selectedId="physical"
 *   onChange={handleChange}
 * />
 * ```
 * 
 * Features:
 * - Fully responsive design with flexible sizing and breakpoint handling
 * - Multiple visual variants (default, outlined, compact)
 * - Customizable sizes (sm, md, lg) with consistent spacing
 * - Full keyboard navigation support (Arrow keys, Home, End, Space, Enter)
 * - Loading states with accessible skeleton placeholders
 * - Comprehensive accessibility with proper ARIA attributes and roles
 * - Error state handling with live region announcements
 * - Icon slot support for enhanced visual communication
 * - Disabled state handling with proper focus management
 * - Full width support for different layout requirements
 * - Theme integration ready for consistent design systems
 */
const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedId,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  loading = false,
  error,
  ariaLabel = 'Segmented control',
  className = '',
  borderRadius,
  disableAnimations = false,
}) => {
  const containerClasses = useSegmentClasses({ 
    variant, 
    size, 
    fullWidth, 
    className, 
    error 
  });
  const { handleKeyDown } = useKeyboardNavigation({ options, selectedId, onChange });

  // Memoized calculations for performance
  const skeletonCount = useMemo(() => 
    Math.max(2, Math.min(options.length || 2, 4)), 
    [options.length]
  );

  // Optimized click handler with useCallback for performance
  const handleSegmentClick = useCallback((optionId: string, disabled?: boolean) => {
    if (!disabled && optionId !== selectedId) {
      onChange(optionId);
    }
  }, [selectedId, onChange]);

  // Loading state with proper skeleton count
  if (loading) {
    return (
      <LoadingSkeleton
        size={size}
        variant={variant}
        containerClasses={containerClasses}
        ariaLabel={ariaLabel}
        skeletonCount={skeletonCount}
      />
    );
  }

  // Enhanced error state with proper ARIA relationship
  const errorId = error ? 'segmented-control-error' : undefined;

  const containerStylesWithRadius = borderRadius
    ? [containerStyles, { borderRadius }]
    : containerStyles;

  return (
    <div>
      <div
        css={containerStylesWithRadius}
        className={containerClasses}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-describedby={errorId}
        aria-invalid={!!error}
        style={disableAnimations ? { transition: 'none' } : undefined}
      >
        <div css={segmentGroupStyles}>
          {options.map((option, index) => {
            const isSelected = option.id === selectedId;
            
            return (
              <SegmentButton
                key={option.id}
                option={option}
                isSelected={isSelected}
                index={index}
                totalCount={options.length}
                size={size}
                variant={variant}
                onClick={handleSegmentClick}
                onKeyDown={handleKeyDown}
                disableAnimations={disableAnimations}
                borderRadius={borderRadius}
              />
            );
          })}
        </div>
      </div>
      
      <ErrorMessage error={error || ''} />
    </div>
  );
};

export default SegmentedControl;