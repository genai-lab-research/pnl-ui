// Application theme configuration
export const theme = {
  colors: {
    // Primary colors
    primary: '#4CAF50',
    secondary: '#FFC107',
    
    // Action colors
    action: '#3545EE',
    actionHover: '#2938d4',
    actionActive: '#1e2bb8',
    actionDisabled: '#a8b3cf',
    
    // Background colors
    background: '#f8f9fa',
    backgroundSecondary: '#F5F5F7',
    backgroundWhite: '#ffffff',
    
    // Text colors
    textPrimary: '#000000',
    textSecondary: '#4C4E64',
    textMuted: '#71717A',
    textOnPrimary: '#FAFAFA',
    textOnSecondary: '#18181B',
    
    // Border colors
    borderPrimary: '#E9EDF4',
    borderSecondary: '#C1C1C5',
    borderMuted: '#CAC4D0',
    
    // Status colors
    success: '#479F67',
    warning: '#F97316',
    danger: '#f44336',
    info: '#2196F3',
    inactive: '#6B7280',
    created: '#E5E7EB',
    
    // Interactive colors
    hover: 'rgba(73, 69, 79, 0.08)',
    active: 'rgba(73, 69, 79, 0.12)',
    focus: '#4CAF50',
  },
  
  fonts: {
    primary: 'Inter, sans-serif',
    secondary: 'Roboto, sans-serif',
  },
  
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
  },
  
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeights: {
    tight: '16px',
    normal: '20px',
    relaxed: '24px',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    pill: '9999px',
  },
  
  shadows: {
    sm: '0 1px 3px 0 rgba(76, 78, 100, 0.1)',
    md: '0 0 2px 0 rgba(65, 64, 69, 0.25)',
    table: '0 1px 3px 0 #4C4E64, 0 1px 1px 0 #4C4E64, 0 2px 1px -1px #4C4E64',
  },
  
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
};

export const mediaQueries = {
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
  xxl: `@media (min-width: ${theme.breakpoints.xxl})`,
};

export type Theme = typeof theme;