import { clsx } from 'clsx';
import { ActionButtonProps } from './types';

/**
 * Generates button class names based on props
 */
export const getButtonClasses = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
}: Partial<ActionButtonProps>) => {
  return clsx(
    `variant-${variant}`,
    `size-${size}`,
    {
      loading,
      'full-width': fullWidth,
    },
    className
  );
};

/**
 * Generates appropriate ARIA attributes for accessibility
 */
export const getButtonAriaAttributes = ({
  ariaLabel,
  label,
  loading,
  disabled,
}: Partial<ActionButtonProps>) => ({
  'aria-label': ariaLabel || label,
  'aria-busy': loading,
  'aria-disabled': disabled,
});

/**
 * Determines if the button should be tabbable
 */
export const getTabIndex = (disabled?: boolean, loading?: boolean): number => {
  return disabled || loading ? -1 : 0;
};