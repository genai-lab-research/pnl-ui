/** @jsxImportSource @emotion/react */
import { forwardRef } from 'react';
import { ActionButtonProps } from './types';
import { buttonStyles, iconStyles, labelStyles, errorStyles } from './styles';
import { useActionButton } from './hooks';
import { getButtonClasses, getButtonAriaAttributes, getTabIndex } from './utils';

/**
 * ActionButton component - A reusable, accessible button component
 * Supports various variants, sizes, states and icons
 */
const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      label,
      icon,
      variant = 'primary',
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
      ...rest
    },
    ref
  ) => {
    const { handleClick, isInteractive } = useActionButton({
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
          {...ariaAttributes}
          {...rest}
        >
          {icon && isInteractive && (
            <span css={iconStyles} aria-hidden="true">
              {icon}
            </span>
          )}
          <span css={labelStyles} data-testid="button-label">
            {label}
          </span>
        </button>
        {error && (
          <div css={errorStyles} role="alert" data-testid="button-error">
            {error}
          </div>
        )}
      </div>
    );
  }
);

ActionButton.displayName = 'ActionButton';

export default ActionButton;