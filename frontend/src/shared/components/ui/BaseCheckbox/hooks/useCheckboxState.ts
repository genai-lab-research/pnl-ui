import { useState, useCallback } from 'react';
import { BaseCheckboxProps } from '../types';

/**
 * Custom hook for managing checkbox state and interactions
 */
export const useCheckboxState = (
  checked: boolean,
  onChange: BaseCheckboxProps['onChange'],
  disabled?: boolean,
  loading?: boolean
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && !loading) {
      onChange(event.target.checked);
    }
  }, [onChange, disabled, loading]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!disabled) {
      setIsHovered(true);
    }
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!disabled && !loading) {
        onChange(!checked);
      }
    }
  }, [checked, onChange, disabled, loading]);

  return {
    isFocused,
    isHovered,
    handleChange,
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave,
    handleKeyDown,
  };
};
