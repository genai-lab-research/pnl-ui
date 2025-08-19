import React from 'react';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { BaseCheckboxProps } from './types';
import { useCheckboxState } from './hooks';
import { getCheckboxAccessibilityProps } from './utils';
import {
  CheckboxContainer,
  CheckboxInput,
  CheckboxBox,
  CheckboxIcon,
  CheckboxLabel,
  LoadingSpinner,
  ErrorMessage,
} from './styles';

/**
 * BaseCheckbox - A reusable, domain-agnostic checkbox component
 * 
 * Provides a flexible checkbox implementation with multiple variants, sizes, and states.
 * Designed to be composable and accessible across different contexts.
 * 
 * @example
 * ```tsx
 * <BaseCheckbox
 *   checked={isSelected}
 *   onChange={setIsSelected}
 *   label="Enable notifications"
 *   variant="outlined"
 *   size="md"
 * />
 * ```
 */
export const BaseCheckbox: React.FC<BaseCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  loading = false,
  error,
  label,
  variant = 'default',
  size = 'md',
  checkedIcon,
  uncheckedIcon,
  ariaLabel,
  className,
  testId,
}) => {
  const {
    isFocused,
    isHovered,
    handleChange,
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave,
    handleKeyDown,
  } = useCheckboxState(checked, onChange, disabled, loading);

  const hasError = Boolean(error);
  
  const accessibilityProps = getCheckboxAccessibilityProps(
    checked,
    disabled,
    loading,
    error,
    ariaLabel,
    label,
    testId
  );

  const renderIcon = () => {
    if (loading) {
      return (
        <LoadingSpinner
          $checked={checked}
          $disabled={disabled}
          $loading={loading}
          $error={hasError}
          $variant={variant}
          $size={size}
        />
      );
    }

    if (checked) {
      return checkedIcon || <CheckBoxIcon />;
    }

    return uncheckedIcon || <CheckBoxOutlineBlankIcon />;
  };

  return (
    <div 
      className={className} 
      data-testid={testId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CheckboxContainer
        $checked={checked}
        $disabled={disabled}
        $loading={loading}
        $error={hasError}
        $variant={variant}
        $size={size}
        onKeyDown={handleKeyDown}
        {...accessibilityProps}
      >
        <CheckboxBox
          $checked={checked}
          $disabled={disabled}
          $loading={loading}
          $error={hasError}
          $variant={variant}
          $size={size}
        >
          <CheckboxInput
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled || loading}
            $checked={checked}
            $disabled={disabled}
            $loading={loading}
            $error={hasError}
            $variant={variant}
            $size={size}
          />
          <CheckboxIcon
            $checked={checked}
            $disabled={disabled}
            $loading={loading}
            $error={hasError}
            $variant={variant}
            $size={size}
          >
            {renderIcon()}
          </CheckboxIcon>
        </CheckboxBox>
        
        {label && (
          <CheckboxLabel
            $checked={checked}
            $disabled={disabled}
            $loading={loading}
            $error={hasError}
            $variant={variant}
            $size={size}
          >
            {label}
          </CheckboxLabel>
        )}
      </CheckboxContainer>
      
      {hasError && (
        <ErrorMessage id={`${testId}-error`}>
          {error}
        </ErrorMessage>
      )}
    </div>
  );
};

export default BaseCheckbox;
