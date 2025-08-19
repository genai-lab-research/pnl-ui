import { theme } from '../../../../../styles';
import { BaseCheckboxProps } from '../types';

/**
 * Get responsive size values for checkbox based on size prop and screen size
 */
export const getCheckboxSizeStyles = (size: NonNullable<BaseCheckboxProps['size']>) => {
  const sizeConfig = {
    sm: {
      box: '2rem', // 32px
      padding: theme.spacing.xs, // 6px
      icon: '1rem', // 16px
      fontSize: theme.fontSizes.sm,
    },
    md: {
      box: '2.375rem', // 38px - matches Figma spec
      padding: theme.spacing.sm, // 9px - matches Figma spec
      icon: '1.25rem', // 20px - matches Figma spec
      fontSize: theme.fontSizes.md,
    },
    lg: {
      box: '2.75rem', // 44px
      padding: theme.spacing.md, // 12px
      icon: '1.5rem', // 24px
      fontSize: theme.fontSizes.lg,
    },
  };

  return sizeConfig[size];
};

/**
 * Get theme-based background color for checkbox variants
 */
export const getCheckboxBackgroundColor = (
  variant: NonNullable<BaseCheckboxProps['variant']>,
  checked: boolean,
  error?: boolean
): string => {
  if (error) {
    return theme.colors.danger;
  }

  switch (variant) {
    case 'outlined':
      return checked ? theme.colors.primary : 'transparent';
    case 'elevated':
      return checked ? theme.colors.primary : theme.colors.backgroundWhite;
    case 'compact':
      return checked ? theme.colors.primary : 'transparent';
    default:
      // Use theme color instead of hardcoded black
      return checked ? theme.colors.primary : theme.colors.textPrimary;
  }
};

/**
 * Get border color for checkbox variants
 */
export const getCheckboxBorderColor = (
  variant: NonNullable<BaseCheckboxProps['variant']>,
  checked: boolean,
  error?: boolean
): string => {
  if (error) {
    return theme.colors.danger;
  }

  switch (variant) {
    case 'outlined':
    case 'elevated':
      return checked ? theme.colors.primary : theme.colors.borderPrimary;
    case 'compact':
      return checked ? theme.colors.primary : theme.colors.borderSecondary;
    default:
      return checked ? theme.colors.primary : 'transparent';
  }
};

/**
 * Generate accessibility attributes for checkbox
 */
export const getCheckboxAccessibilityProps = (
  checked: boolean,
  disabled?: boolean,
  loading?: boolean,
  error?: string,
  ariaLabel?: string,
  label?: string,
  testId?: string
) => {
  return {
    'aria-checked': checked,
    'aria-disabled': disabled || loading,
    'aria-invalid': Boolean(error),
    'aria-label': ariaLabel || label,
    'aria-describedby': error && testId ? `${testId}-error` : undefined,
    'data-testid': testId,
    role: 'checkbox',
    tabIndex: disabled || loading ? -1 : 0,
  };
};

/**
 * Get hover styles for different variants
 */
export const getCheckboxHoverStyles = (
  variant: NonNullable<BaseCheckboxProps['variant']>,
  checked: boolean,
  disabled?: boolean
) => {
  if (disabled) return {};

  switch (variant) {
    case 'outlined':
    case 'elevated':
    case 'compact':
      return {
        borderColor: theme.colors.primary,
        backgroundColor: checked ? theme.colors.primary : theme.colors.hover,
      };
    default:
      return {
        backgroundColor: checked ? theme.colors.primary : theme.colors.textSecondary,
      };
  }
};
