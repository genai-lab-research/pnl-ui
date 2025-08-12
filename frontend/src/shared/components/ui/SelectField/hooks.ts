import { useState, useCallback } from 'react';
import type { SelectFieldProps } from './types';

export interface UseSelectFieldReturn {
  isOpen: boolean;
  isFocused: boolean;
  handleFocus: () => void;
  handleBlur: () => void;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  hasValue: boolean;
  displayValue: string;
}

export const useSelectField = (props: SelectFieldProps): UseSelectFieldReturn => {
  const {
    value,
    onChange,
    onFocus,
    onBlur,
    options = [],
    placeholder = ''
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setIsOpen(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setIsOpen(false);
    onBlur?.();
  }, [onBlur]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    onChange?.(selectedValue);
  }, [onChange]);

  const hasValue = Boolean(value && value !== '');
  const selectedOption = options.find(option => option.value === value);
  const displayValue = hasValue && selectedOption ? selectedOption.label : placeholder;

  return {
    isOpen,
    isFocused,
    handleFocus,
    handleBlur,
    handleChange,
    hasValue,
    displayValue
  };
};