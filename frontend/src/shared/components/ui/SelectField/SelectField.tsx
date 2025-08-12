/** @jsxImportSource @emotion/react */
import React from 'react';
import clsx from 'clsx';
import type { SelectFieldProps } from './types';
import { useSelectField } from './hooks';
import { ArrowDropDownIcon } from './components';
import {
  selectContainerStyles,
  selectStyles,
  arrowIconStyles,
  errorMessageStyles,
  loadingStyles,
  requiredIndicatorStyles
} from './styles';

/**
 * SelectField - A reusable select dropdown component
 * 
 * Features:
 * - Fully responsive design that adapts to different screen sizes
 * - Support for multiple visual variants and sizes
 * - Loading and error states with proper user feedback
 * - Accessibility support with proper ARIA labels and keyboard navigation
 * - Custom styling with Emotion CSS-in-JS
 * - Proper focus and blur handling
 */
export const SelectField: React.FC<SelectFieldProps> = (props) => {
  const {
    placeholder = 'Select an option',
    options = [],
    value,
    disabled = false,
    loading = false,
    error,
    required = false,
    size = 'md',
    className,
    ariaLabel,
    testId,
    onChange,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const {
    isFocused,
    handleFocus,
    handleBlur,
    handleChange,
    hasValue
  } = useSelectField({ 
    value, 
    onChange, 
    onFocus, 
    onBlur, 
    options, 
    placeholder 
  });

  if (loading) {
    return (
      <div
        css={[selectContainerStyles, loadingStyles]}
        className={clsx('select-field-loading', `size-${size}`, className)}
        data-testid={testId}
      >
        <div className="skeleton" />
      </div>
    );
  }

  return (
    <div
      css={selectContainerStyles}
      className={clsx('select-field-container', className)}
      data-testid={testId}
    >
      <select
        css={selectStyles}
        className={clsx(
          'select-field',
          `size-${size}`,
          {
            'has-value': hasValue,
            'error': Boolean(error),
            'focused': isFocused
          }
        )}
        value={value || ''}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        aria-label={ariaLabel || placeholder}
        aria-invalid={Boolean(error)}
        aria-required={required}
        aria-describedby={error ? `${testId}-error` : undefined}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ArrowDropDownIcon
        css={arrowIconStyles}
        className={clsx(
          'select-arrow',
          `size-${size}`,
          {
            'focused': isFocused,
            'disabled': disabled,
            'error': Boolean(error)
          }
        )}
      />

      {error && (
        <div 
          css={errorMessageStyles} 
          className="error-message"
          id={`${testId}-error`}
          role="alert"
          aria-live="polite"
        >
          {error}
          {required && <span css={requiredIndicatorStyles}>*</span>}
        </div>
      )}
    </div>
  );
};

SelectField.displayName = 'SelectField';