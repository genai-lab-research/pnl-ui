import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ToggleSwitchProps, ToggleSwitchState } from './types';
import {
  SwitchContainer,
  SwitchWrapper,
  SwitchTrack,
  SwitchKnob,
  SwitchInput,
  SwitchIcon,
  Label,
  HelperText,
  LoadingSpinner,
} from './styles';

// Default icons
const CheckIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

/**
 * A reusable ToggleSwitch component for enabling/disabling features.
 * 
 * @param props ToggleSwitchProps - The component props
 * @returns JSX.Element
 */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked = false,
  onChange,
  disabled = false,
  loading = false,
  size = 'medium',
  variant = 'default',
  label,
  helperText,
  error = false,
  errorMessage,
  required = false,
  checkedIcon,
  uncheckedIcon,
  ariaLabel,
  className,
  testId,
  name,
  value,
  autoFocus = false,
}) => {
  const [state, setState] = useState<ToggleSwitchState>({
    isChecked: checked,
    isFocused: false,
    isPressed: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Update internal state when prop changes
  useEffect(() => {
    setState(prev => ({ ...prev, isChecked: checked }));
  }, [checked]);

  // Auto focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleToggle = useCallback(() => {
    if (disabled || loading) return;
    
    const newChecked = !state.isChecked;
    setState(prev => ({ ...prev, isChecked: newChecked }));
    onChange?.(newChecked);
  }, [disabled, loading, state.isChecked, onChange]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled || loading) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleToggle();
        break;
    }
  }, [disabled, loading, handleToggle]);

  const handleFocus = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: true }));
  }, []);

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false, isPressed: false }));
  }, []);

  const handleMouseDown = useCallback(() => {
    if (!disabled && !loading) {
      setState(prev => ({ ...prev, isPressed: true }));
    }
  }, [disabled, loading]);

  const handleMouseUp = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: false }));
  }, []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle form integration
    const newChecked = event.target.checked;
    setState(prev => ({ ...prev, isChecked: newChecked }));
    onChange?.(newChecked);
  }, [onChange]);

  const switchElement = (
    <SwitchTrack
      $checked={state.isChecked}
      $disabled={disabled}
      $size={size}
      $variant={variant}
      $error={error}
      $focused={state.isFocused}
      onClick={handleToggle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      role="switch"
      aria-checked={state.isChecked}
      aria-disabled={disabled}
      aria-label={ariaLabel || label}
      tabIndex={-1} // Input handles focus
    >
      <SwitchInput
        ref={inputRef}
        type="checkbox"
        checked={state.isChecked}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        name={name}
        value={value}
        aria-label={ariaLabel || label}
        data-testid={testId}
      />
      
      <SwitchKnob
        $checked={state.isChecked}
        $disabled={disabled}
        $size={size}
        $pressed={state.isPressed}
      >
        {loading ? (
          <LoadingSpinner $size={size} />
        ) : (
          <SwitchIcon $size={size}>
            {state.isChecked ? (
              checkedIcon || <CheckIcon />
            ) : (
              uncheckedIcon || <CloseIcon />
            )}
          </SwitchIcon>
        )}
      </SwitchKnob>
    </SwitchTrack>
  );

  if (label) {
    return (
      <SwitchContainer className={className}>
        <SwitchWrapper>
          <Label
            $required={required}
            $disabled={disabled}
            $error={error}
            onClick={handleToggle}
          >
            {switchElement}
            {label}
          </Label>
        </SwitchWrapper>
        
        {(helperText || errorMessage) && (
          <HelperText $error={error}>
            {error && errorMessage ? errorMessage : helperText}
          </HelperText>
        )}
      </SwitchContainer>
    );
  }

  return (
    <SwitchContainer className={className}>
      {switchElement}
      
      {(helperText || errorMessage) && (
        <HelperText $error={error}>
          {error && errorMessage ? errorMessage : helperText}
        </HelperText>
      )}
    </SwitchContainer>
  );
};

export default ToggleSwitch;
