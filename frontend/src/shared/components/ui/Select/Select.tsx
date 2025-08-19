import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SelectProps, SelectState, SelectOption } from './types';
import {
  SelectContainer,
  SelectWrapper,
  SelectInput,
  SelectIcon,
  Dropdown,
  DropdownOption,
  Label,
  HelperText,
  LoadingSpinner,
} from './styles';

// Default dropdown arrow icon
const ArrowDropDownIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

/**
 * A reusable Select component with customizable options and styling.
 * 
 * @param props SelectProps - The component props
 * @returns JSX.Element
 */
export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select an option',
  options = [],
  value,
  onChange,
  onToggle,
  disabled = false,
  error = false,
  errorMessage,
  helperText,
  required = false,
  variant = 'outlined',
  size = 'medium',
  loading = false,
  icon,
  ariaLabel,
  className,
  testId,
}) => {
  const [state, setState] = useState<SelectState>({
    isOpen: false,
    selectedValue: value,
    focusedIndex: -1,
  });

  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update selected value when prop changes
  useEffect(() => {
    setState(prev => ({ ...prev, selectedValue: value }));
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setState(prev => ({ ...prev, isOpen: false, focusedIndex: -1 }));
        onToggle?.(false);
      }
    };

    if (state.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [state.isOpen, onToggle]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!state.isOpen) {
          setState(prev => ({ ...prev, isOpen: true }));
          onToggle?.(true);
        } else if (state.focusedIndex >= 0) {
          const selectedOption = options[state.focusedIndex];
          if (selectedOption && !selectedOption.disabled) {
            setState(prev => ({ 
              ...prev, 
              selectedValue: selectedOption.value, 
              isOpen: false, 
              focusedIndex: -1 
            }));
            onChange?.(selectedOption.value);
            onToggle?.(false);
          }
        }
        break;
      case 'Escape':
        setState(prev => ({ ...prev, isOpen: false, focusedIndex: -1 }));
        onToggle?.(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!state.isOpen) {
          setState(prev => ({ ...prev, isOpen: true }));
          onToggle?.(true);
        } else {
          setState(prev => ({
            ...prev,
            focusedIndex: Math.min(prev.focusedIndex + 1, options.length - 1)
          }));
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (state.isOpen) {
          setState(prev => ({
            ...prev,
            focusedIndex: Math.max(prev.focusedIndex - 1, 0)
          }));
        }
        break;
    }
  }, [disabled, state.isOpen, state.focusedIndex, options, onChange, onToggle]);

  const handleToggle = () => {
    if (disabled || loading) return;
    
    const newIsOpen = !state.isOpen;
    setState(prev => ({ ...prev, isOpen: newIsOpen, focusedIndex: -1 }));
    onToggle?.(newIsOpen);
  };

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;
    
    setState(prev => ({ 
      ...prev, 
      selectedValue: option.value, 
      isOpen: false, 
      focusedIndex: -1 
    }));
    onChange?.(option.value);
    onToggle?.(false);
  };

  const selectedOption = options.find(option => option.value === state.selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;
  const hasValue = Boolean(selectedOption);

  return (
    <SelectContainer className={className} data-testid={testId}>
      {label && (
        <Label $required={required} $disabled={disabled}>
          {label}
        </Label>
      )}
      
      <SelectWrapper
        ref={selectRef}
        role="combobox"
        aria-expanded={state.isOpen}
        aria-haspopup="listbox"
        aria-labelledby={label ? undefined : ariaLabel}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={handleToggle}
        $disabled={disabled}
        $error={error}
        $size={size}
        $variant={variant}
      >
        {loading && <LoadingSpinner />}
        
        <SelectInput $hasValue={hasValue} $disabled={disabled}>
          {displayText}
        </SelectInput>
        
        <SelectIcon $isOpen={state.isOpen} $disabled={disabled}>
          {icon || <ArrowDropDownIcon />}
        </SelectIcon>
        
        <Dropdown ref={dropdownRef} $isOpen={state.isOpen}>
          {options.map((option, index) => (
            <DropdownOption
              key={option.value}
              role="option"
              aria-selected={option.value === state.selectedValue}
              aria-disabled={option.disabled}
              $selected={option.value === state.selectedValue}
              $focused={index === state.focusedIndex}
              $disabled={option.disabled}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setState(prev => ({ ...prev, focusedIndex: index }))}
            >
              {option.label}
            </DropdownOption>
          ))}
          {options.length === 0 && (
            <DropdownOption $disabled>
              No options available
            </DropdownOption>
          )}
        </Dropdown>
      </SelectWrapper>
      
      {(helperText || errorMessage) && (
        <HelperText $error={error}>
          {error && errorMessage ? errorMessage : helperText}
        </HelperText>
      )}
    </SelectContainer>
  );
};

export default Select;
