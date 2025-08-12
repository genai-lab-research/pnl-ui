import { PrimaryActionButtonProps } from './types';

interface ButtonClassParams {
  variant: PrimaryActionButtonProps['variant'];
  size: PrimaryActionButtonProps['size'];
  loading: boolean;
  fullWidth: boolean;
  className?: string;
}

export const getButtonClasses = ({
  variant = 'default',
  size = 'md',
  loading,
  fullWidth,
  className,
}: ButtonClassParams): string => {
  const classes = [
    `variant-${variant}`,
    `size-${size}`,
    loading && 'loading',
    fullWidth && 'full-width',
    className,
  ].filter(Boolean);

  return classes.join(' ');
};

interface AriaAttributesParams {
  ariaLabel?: string;
  label: string;
  loading: boolean;
  disabled: boolean;
}

export const getButtonAriaAttributes = ({
  ariaLabel,
  label,
  loading,
  disabled,
}: AriaAttributesParams) => {
  return {
    'aria-label': ariaLabel || label,
    'aria-busy': loading,
    'aria-disabled': disabled || loading,
    role: 'button',
  };
};

export const getTabIndex = (disabled: boolean, loading: boolean): number => {
  return disabled || loading ? -1 : 0;
};