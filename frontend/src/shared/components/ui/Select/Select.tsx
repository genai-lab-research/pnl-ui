import React, { useState, useRef, useEffect } from 'react';
import { SelectProps } from './types';
import {
  SelectContainer,
  SelectInput,
  MultiSelectContainer,
  SelectedTag,
  RemoveButton,
  DropdownIcon,
  Placeholder,
  HelperText,
  DropdownList,
  DropdownOption
} from './Select.styles';

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5z"/>
  </svg>
);

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  multiple = false,
  className = '',
  id,
  name,
  error = false,
  helperText,
  required = false,
  'aria-label': ariaLabel,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSingleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleMultiSelect = (optionValue: string | number) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (currentValues.includes(optionValue)) {
      onChange(currentValues.filter(v => v !== optionValue));
    } else {
      onChange([...currentValues, optionValue]);
    }
  };

  const removeSelectedValue = (valueToRemove: string | number) => {
    if (Array.isArray(value)) {
      onChange(value.filter(v => v !== valueToRemove));
    }
  };

  const getSelectedLabel = (val: string | number) => {
    const option = options.find(opt => opt.value === val);
    return option?.label || val;
  };

  if (!multiple) {
    return (
      <SelectContainer className={className} ref={containerRef}>
        <SelectInput
          value={value?.toString() || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          error={error}
          id={id}
          name={name}
          required={required}
          aria-label={ariaLabel}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </SelectInput>
        <DropdownIcon>
          <ChevronDownIcon />
        </DropdownIcon>
        {helperText && (
          <HelperText error={error}>{helperText}</HelperText>
        )}
      </SelectContainer>
    );
  }

  // Multi-select with custom dropdown
  return (
    <SelectContainer className={className} ref={containerRef}>
      <MultiSelectContainer 
        error={error} 
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {Array.isArray(value) && value.length > 0 ? (
          value.map((val) => (
            <SelectedTag key={val}>
              {getSelectedLabel(val)}
              <RemoveButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSelectedValue(val);
                }}
              >
                ×
              </RemoveButton>
            </SelectedTag>
          ))
        ) : (
          <Placeholder>{placeholder}</Placeholder>
        )}
        <DropdownIcon>
          <ChevronDownIcon />
        </DropdownIcon>
      </MultiSelectContainer>
      
      {isOpen && (
        <DropdownList>
          {filteredOptions.map((option) => (
            <DropdownOption
              key={option.value}
              selected={Array.isArray(value) && value.includes(option.value)}
              disabled={option.disabled}
              onClick={() => {
                if (!option.disabled) {
                  handleMultiSelect(option.value);
                }
              }}
            >
              {option.label}
            </DropdownOption>
          ))}
          {filteredOptions.length === 0 && (
            <DropdownOption disabled>No options found</DropdownOption>
          )}
        </DropdownList>
      )}
      
      {helperText && (
        <HelperText error={error}>{helperText}</HelperText>
      )}
    </SelectContainer>
  );
};

export default Select;