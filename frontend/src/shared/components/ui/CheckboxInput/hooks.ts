import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for managing checkbox state and interactions
 * 
 * @param checked - Controlled checked state
 * @param defaultChecked - Default checked state for uncontrolled usage
 * @param onChange - Change handler callback
 * @param disabled - Disabled state
 * @param loading - Loading state
 * @param indeterminate - Indeterminate state
 */
export const useCheckboxInput = (
  checked?: boolean,
  defaultChecked?: boolean,
  onChange?: (checked: boolean) => void,
  disabled?: boolean,
  loading?: boolean,
  indeterminate?: boolean
) => {
  // Internal state for uncontrolled usage
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Ref for the checkbox input element
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Determine if this is controlled or uncontrolled
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;
  
  // Handle checkbox toggle
  const handleToggle = useCallback(() => {
    if (disabled || loading) return;
    
    const newChecked = !isChecked;
    
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    
    onChange?.(newChecked);
  }, [isChecked, isControlled, onChange, disabled, loading]);
  
  // Handle input change (for form compatibility)
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || loading) return;
    
    const newChecked = event.target.checked;
    
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    
    onChange?.(newChecked);
  }, [isControlled, onChange, disabled, loading]);
  
  // Handle keyboard interactions
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled || loading) return;
    
    // Space or Enter key toggles the checkbox
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleToggle();
    }
  }, [handleToggle, disabled, loading]);
  
  // Handle focus events
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);
  
  // Update input element indeterminate property
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate || false;
    }
  }, [indeterminate]);
  
  return {
    isChecked,
    isFocused,
    inputRef,
    handleToggle,
    handleInputChange,
    handleKeyDown,
    handleFocus,
    handleBlur,
  };
};