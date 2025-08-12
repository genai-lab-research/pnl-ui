/**
 * Theme constants for TextInput component
 * Centralized design tokens for consistency across the component
 */

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
} as const;

export const colors = {
  // Text colors based on Figma specs
  text: {
    primary: 'rgba(76, 78, 100, 0.87)',
    secondary: 'rgba(76, 78, 100, 0.6)',
    disabled: 'rgba(76, 78, 100, 0.38)',
    placeholder: 'rgba(76, 78, 100, 0.6)',
  },
  
  // Border colors
  border: {
    default: 'rgba(76, 78, 100, 0.22)',
    hover: 'rgba(76, 78, 100, 0.42)',
    focus: 'rgba(76, 78, 100, 0.87)',
    error: '#d32f2f',
  },
  
  // Background colors
  background: {
    default: 'transparent',
    filled: 'rgba(76, 78, 100, 0.04)',
    filledHover: 'rgba(76, 78, 100, 0.06)',
    disabled: 'rgba(76, 78, 100, 0.04)',
  },
  
  // Focus colors
  focus: {
    ring: 'rgba(76, 78, 100, 0.12)',
    errorRing: 'rgba(211, 47, 47, 0.12)',
  },
  
  // Error colors
  error: {
    text: '#d32f2f',
    border: '#d32f2f',
    background: '#fef2f2',
  },
  
  // Required indicator
  required: '#d32f2f',
  
  // Loading skeleton
  skeleton: {
    base: 'rgba(76, 78, 100, 0.08)',
    highlight: 'rgba(76, 78, 100, 0.12)',
  },
} as const;

export const typography = {
  fontFamily: "'Roboto', sans-serif",
  
  sizes: {
    sm: {
      fontSize: '12px',
      lineHeight: '20px',
    },
    md: {
      fontSize: '14px',
      lineHeight: '24px',
    },
    lg: {
      fontSize: '16px',
      lineHeight: '28px',
    },
  },
  
  weights: {
    regular: 400,
    medium: 500,
  },
  
  letterSpacing: '0.15px',
} as const;

export const spacing = {
  sm: {
    vertical: '6px',
    horizontal: '10px',
    height: '32px',
  },
  md: {
    vertical: '8px',
    horizontal: '12px',
    height: '40px',
  },
  lg: {
    vertical: '10px',
    horizontal: '14px',
    height: '48px',
  },
  gap: {
    xs: '4px',
    sm: '8px',
    md: '12px',
  },
} as const;

export const borderRadius = {
  default: '6px',
  filled: {
    top: '4px',
    bottom: '0px',
  },
} as const;

export const transitions = {
  all: '0.2s ease-in-out',
  fast: '0.15s ease-in-out',
} as const;

export const shadows = {
  focus: '0 0 0 2px',
  error: '0 0 0 2px',
} as const;

export const zIndex = {
  input: 1,
  label: 2,
} as const;