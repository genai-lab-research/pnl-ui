/**
 * Theme constants for InfoDisplayCard component
 * Centralized design tokens for consistency across the component
 */

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
} as const;

export const colors = {
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  
  // Text colors  
  textPrimary: '#09090b',
  textSecondary: '#6b7280',
  
  // Border colors
  borderDefault: '#e4e4e7',
  borderHover: '#d4d4d8',
  
  // Focus colors
  focus: '#3b82f6',
  
  // Status colors
  status: {
    active: '#479f67',
    inactive: '#6b7280',
    pending: '#f59e0b',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f97316',
  },
  
  // Status text colors
  statusText: {
    light: '#fafafa',
    dark: '#09090b',
  },
  
  // Background colors
  background: {
    card: '#ffffff',
    error: '#fef2f2',
  },
  
  // Loading skeleton
  skeleton: {
    base: '#f0f0f0',
    highlight: '#e0e0e0',
  },
} as const;

export const typography = {
  fontFamilies: {
    roboto: "'Roboto', sans-serif",
    inter: "'Inter', sans-serif",
  },
  
  fontSizes: {
    xs: '10px',
    sm: '12px', 
    base: '14px',
    lg: '16px',
  },
  
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeights: {
    xs: '14px',
    sm: '16px',
    base: '20px',
    lg: '24px',
  },
  
  letterSpacing: {
    normal: '0px',
    wide: '0.15px',
  },
} as const;

export const spacing = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  pill: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  lg: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
} as const;

export const transitions = {
  fast: '0.15s ease',
  normal: '0.2s ease',
  slow: '0.3s ease',
} as const;