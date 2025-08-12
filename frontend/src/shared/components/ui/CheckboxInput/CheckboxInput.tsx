/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { useCheckboxInput } from './hooks';
import { 
  checkboxInputStyles, 
  checkmarkStyles, 
  hiddenInputStyles,
  loadingSpinnerStyles,
  errorMessageStyles 
} from './styles';
import { CheckboxInputProps } from './types';

/**
 * CheckboxInput - A fully responsive and accessible checkbox input component
 * 
 * Features:
 * - Based on Figma design with clean outline and checkmark
 * - Supports both controlled and uncontrolled usage patterns
 * - Full keyboard navigation and accessibility support
 * - Loading states with visual feedback
 * - Multiple size variants and responsive scaling
 * - Indeterminate state for partial selections
 * - Error states with validation messages
 * - Proper form integration
 * - Theme-based styling for consistency
 * 
 * @example
 * ```tsx
 * // Controlled usage
 * <CheckboxInput checked={isSelected} onChange={setIsSelected} ariaLabel="Select item" />
 * 
 * // Uncontrolled usage
 * <CheckboxInput defaultChecked={false} ariaLabel="Accept terms" />
 * 
 * // With loading state
 * <CheckboxInput loading={isSubmitting} ariaLabel="Save selection" />
 * 
 * // With error state
 * <CheckboxInput error="This field is required" ariaLabel="Required field" />
 * ```
 */
const CheckboxInput: React.FC<CheckboxInputProps> = ({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  loading = false,
  variant = 'default',
  size = 'md',
  ariaLabel,
  className = '',
  name,
  value,
  id,
  error,
  indeterminate = false,
  iconSlot,
}) => {
  const { 
    isChecked, 
    inputRef,
    handleToggle, 
    handleInputChange,
    handleKeyDown, 
    handleFocus,
    handleBlur 
  } = useCheckboxInput(
    checked,
    defaultChecked,
    onChange,
    disabled,
    loading,
    indeterminate
  );

  const isDisabled = disabled || loading;
  const hasError = error && error.length > 0;

  // Build CSS classes with proper null filtering
  const cssClasses = [
    isChecked && 'checked',
    indeterminate && 'indeterminate',
    isDisabled && 'disabled',
    loading && 'loading',
    hasError && 'error',
    `size-${size}`,
    variant !== 'default' && `variant-${variant}`,
    className,
  ].filter(Boolean).join(' ');

  // Generate unique ID if not provided for accessibility
  const checkboxId = id || `checkbox-input-${Math.random().toString(36).substring(2, 9)}`;

  // Render appropriate icon based on state
  const renderIcon = () => {
    if (loading) {
      return (
        <div 
          css={loadingSpinnerStyles}
          role="status" 
          aria-label="Loading"
          data-testid="checkbox-input-spinner"
        />
      );
    }
    
    if (iconSlot && (isChecked || indeterminate)) {
      return iconSlot;
    }
    
    if (indeterminate) {
      return (
        <span 
          css={checkmarkStyles}
          role="presentation"
          data-testid="checkbox-input-indeterminate"
        >
          −
        </span>
      );
    }
    
    if (isChecked) {
      return (
        <span 
          css={checkmarkStyles}
          role="presentation"
          data-testid="checkbox-input-checkmark"
        >
          ✓
        </span>
      );
    }
    
    return null;
  };

  return (
    <div
      css={css`
        position: relative;
        display: inline-block;
      `}
      data-testid="checkbox-input-container"
    >
      <div
        css={checkboxInputStyles}
        className={cssClasses}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        role="checkbox"
        tabIndex={isDisabled ? -1 : 0}
        aria-checked={indeterminate ? 'mixed' : isChecked}
        aria-label={ariaLabel}
        aria-disabled={isDisabled}
        aria-busy={loading}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `${checkboxId}-error` : undefined}
        data-testid="checkbox-input"
      >
        {/* Hidden input for form integration and accessibility */}
        <input
          ref={inputRef}
          css={hiddenInputStyles}
          type="checkbox"
          checked={isChecked}
          onChange={handleInputChange}
          disabled={isDisabled}
          name={name}
          value={value}
          id={checkboxId}
          tabIndex={-1}
          aria-hidden="true"
          data-testid="checkbox-input-element"
        />
        
        {/* Checkmark icon or custom icon slot */}
        {renderIcon()}
      </div>
      
      {/* Error message */}
      {hasError && (
        <div 
          css={errorMessageStyles}
          id={`${checkboxId}-error`}
          role="alert"
          aria-live="polite"
          data-testid="checkbox-input-error"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default CheckboxInput;