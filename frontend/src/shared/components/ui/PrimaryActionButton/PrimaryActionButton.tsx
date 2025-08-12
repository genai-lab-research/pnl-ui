/** @jsxImportSource @emotion/react */
import { forwardRef } from 'react';
import { PrimaryActionButtonProps } from './types';
import { buttonStyles, iconStyles, labelStyles, errorStyles } from './styles';
import { usePrimaryActionButton } from './hooks';
import { getButtonClasses, getButtonAriaAttributes, getTabIndex } from './utils';

/**
 * PrimaryActionButton component - A reusable, accessible button component
 * Based on Figma design specifications with blue semi-transparent background
 * Supports various variants, sizes, states and icons
 */
const PrimaryActionButton = forwardRef<HTMLButtonElement, PrimaryActionButtonProps>(
  (
    {
      label,
      icon,
      variant = 'default',
      size = 'md',
      loading = false,
      disabled = false,
      error,
      fullWidth = false,
      className,
      onClick,
      type = 'button',
      ariaLabel,
      id,
      backgroundColor,
      textColor,
      borderRadius,
      ...rest
    },
    ref
  ) => {
    const { handleClick, isInteractive } = usePrimaryActionButton({
      disabled,
      loading,
      onClick,
    });

    const buttonClasses = getButtonClasses({
      variant,
      size,
      loading,
      fullWidth,
      className,
    });

    const ariaAttributes = getButtonAriaAttributes({
      ariaLabel,
      label,
      loading,
      disabled,
    });

    const tabIndex = getTabIndex(disabled, loading);

    // Custom style overrides
    const customStyles = {
      ...(backgroundColor && { backgroundColor }),
      ...(textColor && { color: textColor }),
      ...(borderRadius && { borderRadius }),
    };

    return (
      <div>
        <button
          ref={ref}
          id={id}
          type={type}
          css={buttonStyles}
          className={buttonClasses}
          disabled={disabled || loading}
          onClick={handleClick}
          tabIndex={tabIndex}
          style={customStyles}
          {...ariaAttributes}
          {...rest}
        >
          {icon && isInteractive && (
            <span css={iconStyles} aria-hidden="true">
              {icon}
            </span>
          )}
          <span css={labelStyles} data-testid="primary-button-label">
            {label}
          </span>
        </button>
        {error && (
          <div css={errorStyles} role="alert" data-testid="primary-button-error">
            {error}
          </div>
        )}
      </div>
    );
  }
);

PrimaryActionButton.displayName = 'PrimaryActionButton';

export default PrimaryActionButton;