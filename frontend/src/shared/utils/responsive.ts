import { useTheme, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Custom hooks for responsive design
 */

/**
 * Returns true if the current viewport is extra-small (less than 600px)
 * @returns {boolean} Whether the current viewport is extra-small
 */
export const useIsXs = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
};

/**
 * Returns true if the current viewport is small (600px to 899px)
 * @returns {boolean} Whether the current viewport is small
 */
export const useIsSm = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.between('sm', 'md'));
};

/**
 * Returns true if the current viewport is medium (900px to 1199px)
 * @returns {boolean} Whether the current viewport is medium
 */
export const useIsMd = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.between('md', 'lg'));
};

/**
 * Returns true if the current viewport is large (1200px to 1535px)
 * @returns {boolean} Whether the current viewport is large
 */
export const useIsLg = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.between('lg', 'xl'));
};

/**
 * Returns true if the current viewport is extra-large (1536px or greater)
 * @returns {boolean} Whether the current viewport is extra-large
 */
export const useIsXl = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('xl'));
};

/**
 * Returns true if the current viewport is at most small (less than 900px)
 * @returns {boolean} Whether the current viewport is at most small
 */
export const useIsMobile = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
};

/**
 * Returns true if the current viewport is at least medium (900px or greater)
 * @returns {boolean} Whether the current viewport is at least medium
 */
export const useIsDesktop = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('md'));
};

/**
 * Returns the current breakpoint as a string ('xs', 'sm', 'md', 'lg', 'xl')
 * @returns {string} The current breakpoint
 */
export const useCurrentBreakpoint = (): string => {
  const theme = useTheme();
  
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));
  
  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  if (isSm) return 'sm';
  if (isXs) return 'xs';
  
  return 'md'; // Fallback to medium if something goes wrong
};

// Type for breakpoint names
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'up';

/**
 * Helper function for component usage - NOT a React Hook
 * Generate responsive styles based on breakpoints
 * @param values - Values keyed by breakpoints
 * @returns Responsive styles object for styled-components
 */
export const getResponsiveStyles = (values: Record<string, unknown>): Record<string, unknown> => {
  // Use theme directly from the Material UI theme
  const { breakpoints } = createTheme();
  
  return Object.entries(values).reduce((acc, [breakpoint, value]) => {
    if (breakpoint === 'xs') {
      acc[breakpoints.down('sm').replace(/^@media /, '')] = value;
    } else if (breakpoint === 'up') {
      // Up is a special case for styles that apply to all breakpoints
      acc = { ...acc, ...value as Record<string, unknown> };
    } else {
      acc[breakpoints.up(breakpoint as Breakpoint).replace(/^@media /, '')] = value;
    }
    return acc;
  }, {} as Record<string, unknown>);
};

/**
 * Hook to get responsive value based on current viewport
 * @param values - Values keyed by breakpoint
 * @returns The appropriate value for the current viewport
 */
export function useResponsiveValue<T>(values: Record<string, T>): T {
  const breakpoint = useCurrentBreakpoint();
  
  // Find the closest breakpoint
  if (values[breakpoint]) {
    return values[breakpoint];
  }
  
  // Fallback to md if the specific breakpoint is not provided
  return values.md || values.sm || values.lg || Object.values(values)[0];
}

/**
 * Hook for responsive font sizes
 * @param sizes - Font sizes keyed by breakpoint
 * @returns The appropriate font size for the current viewport
 */
export function useResponsiveFontSize(sizes: Record<string, string | number>): string | number {
  return useResponsiveValue(sizes);
}

/**
 * Hook for responsive spacing
 * @param spaces - Spacing values keyed by breakpoint
 * @returns The appropriate spacing for the current viewport
 */
export function useResponsiveSpacing(spaces: Record<string, string | number>): string | number {
  return useResponsiveValue(spaces);
}