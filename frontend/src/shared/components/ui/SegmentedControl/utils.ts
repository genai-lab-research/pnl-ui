/**
 * Utility functions for SegmentedControl component
 */

/**
 * Responsive breakpoint utilities
 */
export const breakpoints = {
  mobile: '30rem',  // 480px
  tablet: '48rem',  // 768px
  desktop: '64rem', // 1024px
} as const;

/**
 * Generate media query string for responsive styles
 */
export const mediaQuery = (breakpoint: keyof typeof breakpoints) => {
  return `@media (max-width: ${breakpoints[breakpoint]})`;
};

/**
 * Calculate optimal segment width based on container and option count
 */
export const calculateSegmentWidth = (containerWidth: number, optionsCount: number): string => {
  const minSegmentWidth = 60; // Minimum width in pixels
  const calculatedWidth = containerWidth / optionsCount;
  
  if (calculatedWidth < minSegmentWidth) {
    return `${minSegmentWidth}px`;
  }
  
  return `${100 / optionsCount}%`;
};

/**
 * Generate accessibility attributes for segment items
 */
export const getSegmentAriaAttributes = (
  option: { id: string; label: string; disabled?: boolean },
  isSelected: boolean,
  totalCount: number,
  currentIndex: number
) => {
  return {
    'aria-checked': isSelected,
    'aria-label': option.label,
    'aria-setsize': totalCount,
    'aria-posinset': currentIndex + 1,
    'aria-disabled': option.disabled || undefined,
  };
};

/**
 * Check if option is valid for selection
 */
export const isSelectableOption = (option: { disabled?: boolean }) => {
  return !option.disabled;
};

/**
 * Theme color utilities (can be extended to use app theme)
 */
export const colors = {
  primary: '#455168',
  primaryLight: '#455168CC', // 80% opacity
  secondary: '#6D788D',
  secondaryLight: '#6D788D80', // 80% opacity
  white: '#FFFFFF',
  error: '#dc2626',
  focus: '#3545EE',
} as const;

/**
 * Size configuration mapping
 */
export const sizeConfig = {
  sm: {
    padding: '0.5rem 0.75rem',
    fontSize: '0.8125rem',
    lineHeight: '1rem',
    minHeight: '1.75rem',
  },
  md: {
    padding: '0.625rem 0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    minHeight: '1.875rem',
  },
  lg: {
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    minHeight: '2.5rem',
  },
} as const;