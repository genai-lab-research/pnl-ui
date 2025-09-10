import { useState, useCallback, useEffect, useRef } from 'react';
import { ToggleOption } from './types';
import { getNextSelectableOptionId, generateRadioGroupName } from './utils';

/**
 * Custom hook for managing toggle group selection state and behavior
 */
export const useToggleGroupSelection = (
  _options: ToggleOption[],
  initialSelectedId?: string,
  onSelectionChange?: (optionId: string | undefined) => void,
  allowDeselection = false
) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>(initialSelectedId);
  
  // Use controlled or uncontrolled mode
  const selectedId = initialSelectedId !== undefined ? initialSelectedId : internalSelectedId;
  
  const handleSelectionChange = useCallback((optionId: string) => {
    // Handle deselection if allowed
    if (allowDeselection && selectedId === optionId) {
      const newSelection = undefined;
      if (initialSelectedId === undefined) {
        setInternalSelectedId(newSelection);
      }
      onSelectionChange?.(undefined);
      return;
    }
    
    // Handle normal selection
    if (initialSelectedId === undefined) {
      setInternalSelectedId(optionId);
    }
    onSelectionChange?.(optionId);
  }, [selectedId, initialSelectedId, onSelectionChange, allowDeselection]);
  
  return {
    selectedId,
    handleSelectionChange,
  };
};

/**
 * Custom hook for managing keyboard navigation in toggle group
 */
export const useToggleGroupKeyboard = (
  options: ToggleOption[],
  selectedId: string | undefined,
  onSelectionChange: (optionId: string | undefined) => void,
  disabled = false
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled || !options.length) return;
    
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown': {
        event.preventDefault();
        const nextId = getNextSelectableOptionId(options, selectedId, 'next');
        if (nextId) {
          onSelectionChange(nextId);
        }
        break;
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        event.preventDefault();
        const prevId = getNextSelectableOptionId(options, selectedId, 'previous');
        if (prevId) {
          onSelectionChange(prevId);
        }
        break;
      }
      case 'Home': {
        event.preventDefault();
        const enabledOptions = options.filter(option => !option.disabled);
        if (enabledOptions.length > 0) {
          onSelectionChange(enabledOptions[0].id);
        }
        break;
      }
      case 'End': {
        event.preventDefault();
        const enabledOptions = options.filter(option => !option.disabled);
        if (enabledOptions.length > 0) {
          onSelectionChange(enabledOptions[enabledOptions.length - 1].id);
        }
        break;
      }
    }
  }, [options, selectedId, onSelectionChange, disabled]);
  
  return {
    containerRef,
    handleKeyDown,
  };
};

/**
 * Custom hook for managing focus state in toggle group
 */
export const useToggleGroupFocus = (
  selectedId: string | undefined,
  options: ToggleOption[]
) => {
  const [focusedId, setFocusedId] = useState<string | undefined>(selectedId);
  
  // Update focused ID when selection changes
  useEffect(() => {
    if (selectedId) {
      setFocusedId(selectedId);
    }
  }, [selectedId]);
  
  // Set initial focus to first enabled option if none selected
  useEffect(() => {
    if (!focusedId && options.length > 0) {
      const firstEnabledOption = options.find(option => !option.disabled);
      if (firstEnabledOption) {
        setFocusedId(firstEnabledOption.id);
      }
    }
  }, [focusedId, options]);
  
  const handleFocus = useCallback((optionId: string) => {
    setFocusedId(optionId);
  }, []);
  
  const handleBlur = useCallback(() => {
    // Keep focus state for keyboard navigation
    // Don't clear focusedId on blur to maintain tab order
  }, []);
  
  return {
    focusedId,
    handleFocus,
    handleBlur,
  };
};

/**
 * Custom hook for generating unique radio group name
 */
export const useRadioGroupName = (providedName?: string) => {
  const nameRef = useRef<string>();
  
  if (!nameRef.current) {
    nameRef.current = generateRadioGroupName(providedName);
  }
  
  return nameRef.current;
};

/**
 * Custom hook for managing toggle option click interactions
 */
export const useToggleOptionInteraction = (
  option: ToggleOption,
  selected: boolean,
  disabled: boolean,
  onClick: (optionId: string) => void
) => {
  const handleClick = useCallback(() => {
    if (!disabled && !option.disabled) {
      onClick(option.id);
    }
  }, [disabled, option.disabled, option.id, onClick]);
  
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled || option.disabled) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(option.id);
    }
  }, [disabled, option.disabled, option.id, onClick]);
  
  // Calculate tab index for radio group behavior
  const tabIndex = selected ? 0 : -1;
  
  return {
    handleClick,
    handleKeyDown,
    tabIndex,
  };
};
