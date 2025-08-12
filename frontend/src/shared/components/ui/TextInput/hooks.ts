import { useState, useCallback } from 'react';
import type { TextInputProps } from './types';

interface UseTextInputParams {
  value?: string;
  onChange?: TextInputProps['onChange'];
  onFocus?: TextInputProps['onFocus'];
  onBlur?: TextInputProps['onBlur'];
}

interface UseTextInputReturn {
  isFocused: boolean;
  hasValue: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const useTextInput = ({
  value,
  onChange,
  onFocus,
  onBlur
}: UseTextInputParams): UseTextInputReturn => {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = Boolean(value && value.length > 0);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
  }, [onChange]);

  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  }, [onFocus]);

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  }, [onBlur]);

  return {
    isFocused,
    hasValue,
    handleChange,
    handleFocus,
    handleBlur
  };
};