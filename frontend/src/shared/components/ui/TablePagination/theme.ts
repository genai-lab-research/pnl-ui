/**
 * Theme constants for TablePagination component
 * Centralized design tokens for consistency across the component
 */

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
} as const;

export const colors = {
  // Text colors based on Figma spec
  textPrimary: '#71717a',      // Page info text
  textSecondary: '#4c4e64',    // Previous button (26% opacity)
  textActive: '#6c778d',       // Next button
  
  // Border colors
  borderPrevious: 'rgba(76, 78, 100, 0.12)',  // Previous button border
  borderNext: 'rgba(109, 120, 141, 0.5)',     // Next button border
  borderDefault: '#e4e4e7',
  
  // Interaction states
  hoverBg: 'rgba(0, 0, 0, 0.02)',
  activeBg: 'rgba(0, 0, 0, 0.04)',
  focusRing: '#2563eb',
  
  // Loading skeleton
  skeleton: {
    base: '#f0f0f0',
    highlight: '#e0e0e0',
  },
  
  // Error states
  error: '#dc2626',
  errorBg: '#fef2f2',
  errorBorder: '#fecaca',
} as const;

export const typography = {
  fontFamily: "'Inter', sans-serif",
  
  sizes: {
    sm: '12px',
    base: '14px',  // Figma spec
    lg: '16px',
  },
  
  weights: {
    regular: 400,    // Page info text
    medium: 500,     // Button text
  },
  
  lineHeights: {
    sm: '16px',
    base: '20px',    // Page info line height
    lg: '24px',      // Button line height
  },
  
  letterSpacing: {
    normal: '0px',   // Page info
    wide: '0.4px',   // Button text
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
} as const;

export const borderRadius = {
  button: '6px',    // Figma spec for buttons
  sm: '4px',
  md: '8px',
} as const;

export const transitions = {
  fast: '0.15s ease',
  normal: '0.2s ease',
} as const;

export const sizes = {
  icon: {
    sm: '14px',
    base: '16px',
    lg: '20px',
  },
  button: {
    sm: {
      padding: '4px 8px',
      gap: '6px',
    },
    base: {
      padding: '7px 12px',    // Figma spec
      gap: '8px',
    },
    lg: {
      padding: '10px 16px',
      gap: '10px',
    },
  },
} as const;