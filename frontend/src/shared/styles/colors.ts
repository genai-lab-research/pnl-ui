// Color Palette for Vertical Farming Control Panel UI
// Centralized color definitions to maintain consistency across components

export const colors = {
  // Primary Colors
  primary: {
    main: '#3545EE',      // Main primary blue
    dark: '#2638D9',      // Darker primary for hover states
    light: '#9747FF',     // Light primary purple
    contrast: '#FFFFFF',  // White text on primary backgrounds
  },

  // Secondary Colors
  secondary: {
    main: '#4C4E64',      // Main secondary gray-blue
    dark: '#3D3F52',      // Darker secondary
    light: '#6C778D',     // Light secondary
    contrast: '#FFFFFF',  // White text on secondary backgrounds
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',   // Main white background
    secondary: '#F8F9FA', // Light gray background
    tertiary: '#F3F4F6',  // Slightly darker light gray
    paper: '#FAFAFA',     // Paper/card background
    overlay: '#F9FAFB',   // Overlay background
    disabled: '#F7F7F7',  // Disabled state background
    container: '#F7F9FE', // Container background
    panel: '#F7F9FD',     // Panel background
  },

  // Text Colors
  text: {
    primary: '#000000',   // Main black text
    secondary: '#09090B', // Near black text
    tertiary: '#49454F',  // Medium gray text
    disabled: '#71717A',  // Disabled text color
    muted: '#6B7280',     // Muted text
    light: '#4B5563',     // Light text
    contrast: '#FFFFFF',  // White text for dark backgrounds
    subtitle: '#374151',  // Subtitle text
    caption: '#0F1729',   // Caption text
  },

  // Border Colors
  border: {
    primary: '#E4E4E7',   // Main border color
    secondary: '#E5E7EB', // Secondary border
    tertiary: '#E9EDF4',  // Tertiary border
    light: '#F1F1F1',     // Light border
    medium: '#E6EAF1',    // Medium border
    dark: '#455168',      // Dark border
    input: '#e0e0e0',     // Input border
    inputError: '#f44336', // Input error border
    inputFocus: '#1976d2', // Input focus border
  },

  // Status Colors
  status: {
    success: '#30CA45',   // Success green
    successAlt: '#10B981', // Alternative success green
    successDark: '#479F67', // Dark success green
    warning: '#FFA328',   // Warning orange
    warningAlt: '#F59E0B', // Alternative warning
    error: '#DC2626',     // Error red
    errorAlt: '#DC3545',  // Alternative error red
    info: '#1976d2',      // Info blue
    healthy: '#2FCA44',   // Healthy status
  },

  // Interactive Colors
  interactive: {
    hover: '#E7EBF2',     // Hover state
    active: '#CFD5DC',    // Active state
    focus: '#1976d2',     // Focus state
    selected: '#e3f2fd',  // Selected state
    disabled: '#EAEDF4',  // Disabled state
  },

  // Shadow Colors (RGBA values for transparency)
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
    card: 'rgba(0, 0, 0, 0.06)',
    panel: 'rgba(0, 0, 0, 0.08)',
  },

  // Opacity Variants (commonly used RGBA patterns)
  opacity: {
    black05: 'rgba(0, 0, 0, 0.05)',
    black10: 'rgba(0, 0, 0, 0.1)',
    black20: 'rgba(0, 0, 0, 0.2)',
    black50: 'rgba(0, 0, 0, 0.5)',
    white88: 'rgba(255, 255, 255, 0.88)',
    white90: 'rgba(255, 255, 255, 0.9)',
    primary04: 'rgba(53, 69, 238, 0.04)',
    secondary12: 'rgba(76, 78, 100, 0.12)',
    secondary22: 'rgba(76, 78, 100, 0.22)',
    secondary26: 'rgba(76, 78, 100, 0.26)',
    secondary50: 'rgba(76, 78, 100, 0.5)',
    secondary60: 'rgba(76, 78, 100, 0.6)',
    secondary87: 'rgba(76, 78, 100, 0.87)',
    textMuted50: 'rgba(9, 9, 11, 0.5)',
    borderGray10: 'rgba(73, 69, 79, 0.1)',
    borderGray50: 'rgba(69, 81, 104, 0.5)',
    buttonGray05: 'rgba(73, 69, 79, 0.05)',
    buttonGray10: 'rgba(73, 69, 79, 0.1)',
    inputDisabled50: 'rgba(109, 120, 141, 0.5)',
    messageShadow: 'rgba(129, 142, 161, 0.08)',
  },

  // Special Colors
  special: {
    transparent: 'transparent',
    inherit: 'inherit',
    currentColor: 'currentColor',
  },

  // Gradient Colors
  gradient: {
    successLinear: 'linear-gradient(90deg, #30CA45 0%, #30CA45 100%)',
    primaryButton: 'rgba(53, 69, 238, 1)',
    primaryButtonHover: 'rgba(38, 56, 217, 1)',
  },

  // Component Specific Colors
  component: {
    switchTrack: '#1976d2',
    switchThumb: '#FAFAFA',
    chatBubbleUser: '#4C4E64',
    chatBubbleBot: '#F3F4F6',
    avatarPlaceholder: '#666',
    cropVisualization: '#E7EBF2',
  }
} as const;

// Export individual color categories for easier importing
export const {
  primary,
  secondary,
  background,
  text,
  border,
  status,
  interactive,
  shadow,
  opacity,
  special,
  gradient,
  component,
} = colors;

// Type definitions for better TypeScript support
export type ColorPalette = typeof colors;
export type PrimaryColors = typeof primary;
export type BackgroundColors = typeof background;
export type TextColors = typeof text;
export type BorderColors = typeof border;
export type StatusColors = typeof status;