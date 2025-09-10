export const toggleGroupTheme = {
  colors: {
    primary: '#3545EE', // Selected state color from design
    text: {
      selected: '#3545EE', // Blue text for selected option
      unselected: '#49454F', // Gray text for unselected options
      disabled: '#B0B0B0',
    },
    border: {
      selected: '#3545EE', // Blue border for selected option
      unselected: 'transparent', // No visible border for unselected
      disabled: '#E0E0E0',
      focus: '#3545EE',
    },
    background: {
      default: 'transparent',
      hover: 'rgba(53, 69, 238, 0.04)', // Subtle hover effect
      pressed: 'rgba(53, 69, 238, 0.08)',
      disabled: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 500,
    letterSpacing: '0.5px',
    textAlign: 'center' as const,
  },
  sizes: {
    sm: {
      fontSize: '10px',
      lineHeight: '14px',
      height: '28px',
      paddingX: '12px',
      paddingY: '6px',
      borderRadius: '3px',
    },
    md: {
      fontSize: '12px',
      lineHeight: '16px',
      height: '32px',
      paddingX: '16px',
      paddingY: '8px',
      borderRadius: '4px',
    },
    lg: {
      fontSize: '14px',
      lineHeight: '18px',
      height: '40px',
      paddingX: '20px',
      paddingY: '10px',
      borderRadius: '5px',
    },
  },
  spacing: {
    gap: '0px', // Options are directly adjacent
    borderWidth: '1px',
    outlineOffset: '2px',
  },
  transitions: {
    duration: '0.2s',
    easing: 'ease',
  },
  shadows: {
    focus: '0 0 0 2px rgba(53, 69, 238, 0.2)',
    elevated: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  breakpoints: {
    mobile: '768px',
  },
} as const;

export type ToggleGroupTheme = typeof toggleGroupTheme;
