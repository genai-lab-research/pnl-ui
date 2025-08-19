import React, { useState, useCallback, forwardRef } from 'react';
import { FormHelperText } from '@mui/material';
import { TextInputProps } from './types';
import { StyledTextInput, CharCountContainer, CharCount, LoadingSkeleton } from './styles';

/**
 * TextInput Component
 * 
 * A reusable text input component that provides consistent styling and behavior
 * across the application. Supports various sizes, validation states, and accessibility features.
 * 
 * @example
 * ```tsx
 * <TextInput
 *   label="Notes (optional)"
 *   placeholder="Enter your notes..."
 *   value={value}
 *   onChange={setValue}
 *   maxLength={500}
 *   showCharCount
 * />
 * ```
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
  label,
  placeholder,
  value = '',
  onChange,
  required = false,
  disabled = false,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  loading = false,
  type = 'text',
  ariaLabel,
  className,
  showCharCount = false,
  maxLength,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState(value);
  
  // Use controlled or uncontrolled value
  const currentValue = onChange ? value : internalValue;
  
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    // Respect maxLength if provided
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  }, [onChange, maxLength]);
  
  // Loading state
  if (loading) {
    return <LoadingSkeleton className={className} />;
  }
  
  // Character count calculations
  const characterCount = currentValue.length;
  const isNearLimit = maxLength ? characterCount >= maxLength * 0.8 : false;
  const isOverLimit = maxLength ? characterCount > maxLength : false;
  
  // Determine helper text to show
  const showError = Boolean(error);
  const showHelperText = Boolean(helperText && !showError);
  const showCharCountOnly = showCharCount && !showError && !showHelperText;
  
  return (
    <div className={className}>
      <StyledTextInput
        ref={ref}
        label={label}
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        error={showError}
        type={type}
        inputsize={size}
        inputvariant={variant}
        fullWidth
        variant="outlined"
        inputProps={{
          'aria-label': ariaLabel || label,
          maxLength,
          ...props,
        }}
        helperText={showError ? error : showHelperText ? helperText : undefined}
      />
      
      {/* Character count display */}
      {showCharCount && maxLength && (
        <CharCountContainer>
          <div />
          <CharCount 
            isNearLimit={isNearLimit} 
            isOverLimit={isOverLimit}
          >
            {characterCount}/{maxLength}
          </CharCount>
        </CharCountContainer>
      )}
      
      {/* Character count only (no other helper text) */}
      {showCharCountOnly && maxLength && (
        <FormHelperText>
          <CharCount 
            isNearLimit={isNearLimit} 
            isOverLimit={isOverLimit}
          >
            {characterCount}/{maxLength}
          </CharCount>
        </FormHelperText>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';
