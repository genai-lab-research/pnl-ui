import { useCallback, useState, useRef, useEffect } from 'react';

/**
 * Custom hook for toggle switch logic and state management
 * 
 * Handles both controlled and uncontrolled usage patterns,
 * keyboard navigation, accessibility, and proper form integration
 */
export const useToggleSwitch = (
  checked?: boolean,
  defaultChecked?: boolean,
  onChange?: (checked: boolean) => void,
  disabled?: boolean,
  loading?: boolean
) => {
  // Handle controlled vs uncontrolled state
  const [internalChecked, setInternalChecked] = useState(() => defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;
  
  // Track if the component has been interacted with for validation purposes
  const [touched, setTouched] = useState(false);
  
  // Ref to track previous state for change detection
  const previousChecked = useRef(isChecked);

  // Update previous state when checked changes
  useEffect(() => {
    previousChecked.current = isChecked;
  }, [isChecked]);

  /**
   * Handle toggle state change with validation and proper state management
   */
  const handleToggle = useCallback(() => {
    if (disabled || loading) return;

    const newChecked = !isChecked;
    setTouched(true);

    // Update internal state if uncontrolled
    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    // Notify parent component of change
    try {
      onChange?.(newChecked);
    } catch (error) {
      console.error('ToggleSwitch onChange error:', error);
      // Revert state if onChange throws an error
      if (!isControlled) {
        setInternalChecked(isChecked);
      }
    }
  }, [isChecked, isControlled, onChange, disabled, loading]);

  /**
   * Handle keyboard interactions with proper accessibility support
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled || loading) return;

    // Handle Enter and Space keys for toggle
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      handleToggle();
    }
    
    // Handle Escape key to blur the element
    if (event.key === 'Escape') {
      (event.target as HTMLElement)?.blur();
    }
  }, [handleToggle, disabled, loading]);

  /**
   * Handle form input change events for proper form integration
   */
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || loading) return;

    event.stopPropagation();
    const newChecked = event.target.checked;
    setTouched(true);

    // Update internal state if uncontrolled
    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    // Notify parent component of change
    try {
      onChange?.(newChecked);
    } catch (error) {
      console.error('ToggleSwitch onChange error:', error);
      // Revert state if onChange throws an error
      if (!isControlled) {
        setInternalChecked(isChecked);
      }
    }
  }, [isChecked, isControlled, onChange, disabled, loading]);

  /**
   * Handle focus events for accessibility
   */
  const handleFocus = useCallback(() => {
    if (disabled || loading) return;
    // Mark as touched when focused for validation purposes
    setTouched(true);
  }, [disabled, loading]);

  /**
   * Handle blur events for form validation
   */
  const handleBlur = useCallback(() => {
    if (disabled || loading) return;
    // Additional blur handling can be added here if needed
  }, [disabled, loading]);

  /**
   * Reset the touched state (useful for form resets)
   */
  const resetTouched = useCallback(() => {
    setTouched(false);
  }, []);

  return {
    isChecked,
    touched,
    handleToggle,
    handleKeyDown,
    handleInputChange,
    handleFocus,
    handleBlur,
    resetTouched,
  };
};