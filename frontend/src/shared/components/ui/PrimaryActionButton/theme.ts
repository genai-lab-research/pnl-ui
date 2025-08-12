/**
 * Theme constants for PrimaryActionButton component
 * Centralized design tokens based on Figma specifications
 * Button design: semi-transparent blue with white text
 */

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
} as const;

export const colors = {
  // Primary colors from Figma design
  primary: '#3545EE',
  primaryHover: '#2A37CC',
  primaryActive: '#1F29AA',
  
  // Text colors
  textLight: '#FAFAFA',      // White text from Figma spec
  textDark: '#27272A',
  textMuted: '#6b7280',
  
  // Background variants
  background: {
    default: 'rgba(53, 69, 238, 0.5)',     // 50% opacity as per Figma
    solid: '#3545EE',
    transparent: 'transparent',
  },
  
  // Border colors
  borderPrimary: '#3545EE',
  borderLight: '#E4E4E7',
  borderTransparent: 'transparent',
  
  // State colors
  focus: '#3b82f6',
  error: '#ef4444',
  success: '#22c55e',
  
  // Loading and disabled states
  loading: 'currentColor',
  disabled: 'rgba(0, 0, 0, 0.6)',
} as const;

export const typography = {
  fontFamily: "'Inter', sans-serif",
  
  sizes: {
    sm: '12px',
    base: '14px',    // Figma specification
    lg: '16px',
  },
  
  weights: {
    medium: 500,     // Figma specification
    semibold: 600,
  },
  
  lineHeights: {
    sm: '16px',
    base: '20px',    // Figma specification
    lg: '24px',
  },
  
  letterSpacing: {
    normal: '0px',   // Figma specification
    wide: '0.025em',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',       // Gap between icon and text
  md: '12px',      // Horizontal padding from Figma
  lg: '16px',
  xl: '24px',
} as const;

export const borderRadius = {
  base: '6px',     // Figma specification
  small: '5px',
  large: '8px',
} as const;

export const transitions = {
  fast: '0.15s ease',
  normal: '0.2s ease',
  slow: '0.3s ease',
} as const;

export const sizes = {
  button: {
    sm: {
      padding: '6px 8px',
      fontSize: typography.sizes.sm,
      lineHeight: typography.lineHeights.sm,
      minHeight: '28px',
      gap: '6px',
    },
    base: {
      padding: '10px 12px',    // Figma specification
      fontSize: typography.sizes.base,
      lineHeight: typography.lineHeights.base,
      minHeight: '40px',       // Figma specification
      gap: spacing.sm,
    },
    lg: {
      padding: '12px 16px',
      fontSize: typography.sizes.lg,
      lineHeight: typography.lineHeights.lg,
      minHeight: '48px',
      gap: '10px',
    },
  },
  
  icon: {
    sm: '14px',
    base: '16px',
    lg: '20px',
  },
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px rgba(53, 69, 238, 0.2)',
  hover: '0 2px 8px rgba(53, 69, 238, 0.3)',
  active: '0 1px 2px rgba(53, 69, 238, 0.4)',
  elevated: '0 4px 12px rgba(53, 69, 238, 0.3)',
} as const;

export const zIndex = {
  base: 1,
  elevated: 10,
  modal: 1000,
} as const;