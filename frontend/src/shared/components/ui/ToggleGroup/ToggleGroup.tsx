import React, { useCallback } from 'react';
import { ToggleGroupProps, ToggleOptionProps } from './types';
import {
  ToggleGroupContainer,
  ToggleOptionButton,
  ToggleOptionLabel,
  ToggleOptionIcon,
  LoadingSkeleton,
  ErrorMessage,
} from './styles';
import {
  useToggleGroupSelection,
  useToggleGroupKeyboard,
  useToggleGroupFocus,
  useRadioGroupName,
  useToggleOptionInteraction,
} from './hooks';
import {
  getToggleGroupAriaLabel,
  getToggleOptionAriaLabel,
  sanitizeToggleOptions,
} from './utils';

/**
 * Individual toggle option component
 */
const ToggleOption: React.FC<ToggleOptionProps> = ({
  option,
  selected,
  size,
  variant,
  disabled,
  onClick,
  name,
  fullWidth,
}) => {
  const { handleClick, handleKeyDown, tabIndex } = useToggleOptionInteraction(
    option,
    selected,
    disabled,
    onClick
  );

  const ariaLabel = getToggleOptionAriaLabel(option, selected);

  return (
    <ToggleOptionButton
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel}
      aria-disabled={disabled || option.disabled}
      name={name}
      tabIndex={tabIndex}
      selected={selected}
      size={size}
      variant={variant}
      disabled={disabled || option.disabled}
      fullWidth={fullWidth}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {option.icon && (
        <ToggleOptionIcon>
          {option.icon}
        </ToggleOptionIcon>
      )}
      <ToggleOptionLabel>
        {option.label}
      </ToggleOptionLabel>
    </ToggleOptionButton>
  );
};

/**
 * ToggleGroup component for displaying a group of selectable options.
 * 
 * Features:
 * - Multiple sizes (sm, md, lg) and variants (default, outlined, elevated)
 * - Keyboard navigation with arrow keys, Home, End
 * - Single selection with optional deselection
 * - Loading and error states with proper accessibility
 * - Icon support for options
 * - Responsive design with full-width option
 * - Comprehensive accessibility with ARIA support
 */
const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options: rawOptions = [],
  selectedId: controlledSelectedId,
  onSelectionChange,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  error,
  className = '',
  ariaLabel,
  name: providedName,
  allowDeselection = false,
  fullWidth = false,
}) => {
  // Sanitize and validate options
  const options = sanitizeToggleOptions(rawOptions);
  
  // Generate unique radio group name
  const radioGroupName = useRadioGroupName(providedName);
  
  // Manage selection state
  const { selectedId, handleSelectionChange } = useToggleGroupSelection(
    options,
    controlledSelectedId,
    onSelectionChange,
    allowDeselection
  );
  
  // Create a wrapper for option clicks that ensures string type
  const handleOptionClick = useCallback((optionId: string) => {
    handleSelectionChange(optionId);
  }, [handleSelectionChange]);

  // Create a wrapper for keyboard navigation that handles undefined values
  const handleKeyboardSelection = useCallback((optionId: string | undefined) => {
    if (optionId) {
      handleSelectionChange(optionId);
    }
  }, [handleSelectionChange]);

  // Manage keyboard navigation
  const { containerRef, handleKeyDown } = useToggleGroupKeyboard(
    options,
    selectedId,
    handleKeyboardSelection,
    disabled
  );
  
  // Manage focus state (for future keyboard navigation improvements)
  const { handleFocus, handleBlur } = useToggleGroupFocus(
    selectedId,
    options
  );
  
  // Generate accessibility labels
  const groupAriaLabel = getToggleGroupAriaLabel(ariaLabel, options);
  
  // Show loading state
  if (loading) {
    return (
      <div className={className}>
        <LoadingSkeleton size={size}>
          {Array.from({ length: Math.max(options.length, 2) }, (_, index) => (
            <div key={index} className="skeleton-option" />
          ))}
        </LoadingSkeleton>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className={className}>
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );
  }
  
  // Show empty state
  if (options.length === 0) {
    return (
      <div className={className}>
        <ErrorMessage>No options provided</ErrorMessage>
      </div>
    );
  }
  
  return (
    <ToggleGroupContainer
      ref={containerRef}
      role="radiogroup"
      aria-label={groupAriaLabel}
      aria-disabled={disabled}
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled}
      className={className}
      onKeyDown={handleKeyDown}
      onFocus={() => handleFocus}
      onBlur={handleBlur}
    >
      {options.map((option) => (
        <ToggleOption
          key={option.id}
          option={option}
          selected={selectedId === option.id}
          size={size}
          variant={variant}
          disabled={disabled}
          onClick={handleOptionClick}
          name={radioGroupName}
          fullWidth={fullWidth}
        />
      ))}
    </ToggleGroupContainer>
  );
};

export default ToggleGroup;
