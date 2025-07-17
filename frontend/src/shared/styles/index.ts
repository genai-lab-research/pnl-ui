// Shared styles exports
// This file provides easy access to all style-related exports

// Color palette
export * from './colors';

// Re-export specific color categories for convenience
export {
  colors,
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
  component
} from './colors';

// Type exports
export type {
  ColorPalette,
  PrimaryColors,
  BackgroundColors,
  TextColors,
  BorderColors,
  StatusColors
} from './colors';