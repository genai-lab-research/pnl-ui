/** @jsxImportSource @emotion/react */
import React from 'react';
import clsx from 'clsx';
import type { TextInputProps } from './types';
import { useTextInput } from './hooks';
import { generateInputId, getAutoCompleteValue } from './utils';
import {
  inputContainerStyles,
  labelStyles,
  inputWrapperStyles,
  inputStyles,
  errorMessageStyles,
  helperTextStyles,
  loadingStyles,
  requiredIndicatorStyles
} from './styles';

/**
 * TextInput - A reusable, accessible text input component
 * 
 * A fully featured text input component designed for modern web applications.
 * Built with TypeScript, Emotion CSS-in-JS, and following React best practices.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <TextInput 
 *   placeholder="Enter your name"
 *   onChange={handleChange}
 * />
 * 
 * // With label and validation
 * <TextInput
 *   label="Email Address"
 *   type="email"
 *   value={email}
 *   onChange={handleEmailChange}
 *   error={emailError}
 *   required
 * />
 * 
 * // Different sizes and variants
 * <TextInput
 *   placeholder="Large filled input"
 *   size="lg"
 *   variant="filled"
 * />
 * ```
 * 
 * Features:
 * - Fully responsive design that adapts to different screen sizes
 * - Support for multiple visual variants (default, outlined, filled) and sizes
 * - Loading and error states with proper user feedback
 * - Accessibility support with proper ARIA labels and keyboard navigation
 * - Theme-based styling with Emotion CSS-in-JS
 * - Proper focus and blur handling with visual feedback
 * - Support for labels, helper text, and error messages
 * - Form integration with validation support
 * - Auto-complete suggestions based on input type
 */
export const TextInput: React.FC<TextInputProps> = (props) => {
  const {
    type = 'text',
    placeholder,
    value,
    name,
    id,
    disabled = false,
    required = false,
    readOnly = false,
    maxLength,
    minLength,
    loading = false,
    error,
    variant = 'default',
    size = 'md',
    className,
    ariaLabel,
    testId,
    label,
    helperText,
    autoComplete,
    autoFocus = false,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    ...rest
  } = props;

  const {
    isFocused,
    hasValue,
    handleChange,
    handleFocus,
    handleBlur
  } = useTextInput({ 
    value, 
    onChange, 
    onFocus, 
    onBlur 
  });

  const inputId = id || generateInputId();
  const errorId = `${inputId}-error`;
  const helperTextId = `${inputId}-helper`;
  const computedAutoComplete = autoComplete || getAutoCompleteValue(type, name);

  if (loading) {
    return (
      <div
        css={[inputContainerStyles, loadingStyles]}
        className={clsx('text-input-loading', `size-${size}`, className)}
        data-testid={testId}
      >
        {label && (
          <div css={labelStyles} className="label-skeleton">
            <div className="skeleton" style={{ width: '60%', height: '16px' }} />
          </div>
        )}
        <div className="skeleton" />
      </div>
    );
  }

  return (
    <div
      css={inputContainerStyles}
      className={clsx('text-input-container', className)}
      data-testid={testId}
    >
      {label && (
        <label
          css={labelStyles}
          htmlFor={inputId}
          className="text-input-label"
        >
          {label}
          {required && <span css={requiredIndicatorStyles}>*</span>}
        </label>
      )}
      
      <div css={inputWrapperStyles} className="text-input-wrapper">
        <input
          css={inputStyles}
          id={inputId}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value || ''}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          maxLength={maxLength}
          minLength={minLength}
          autoComplete={computedAutoComplete}
          autoFocus={autoFocus}
          className={clsx(
            'text-input',
            `size-${size}`,
            `variant-${variant}`,
            {
              'has-value': hasValue,
              'error': Boolean(error),
              'focused': isFocused,
              'disabled': disabled,
              'readonly': readOnly
            }
          )}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          aria-label={ariaLabel || label}
          aria-invalid={Boolean(error)}
          aria-required={required}
          aria-describedby={[
            error ? errorId : null,
            helperText ? helperTextId : null
          ].filter(Boolean).join(' ') || undefined}
          {...rest}
        />
      </div>

      {error && (
        <div 
          css={errorMessageStyles} 
          className="error-message"
          id={errorId}
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      {helperText && !error && (
        <div 
          css={helperTextStyles} 
          className="helper-text"
          id={helperTextId}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

TextInput.displayName = 'TextInput';