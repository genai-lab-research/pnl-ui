/**
 * Utility functions for ToggleGroup component
 */

import { ToggleOption } from './types';

/**
 * Generates a consistent aria-label for the toggle group
 * @param ariaLabel - Custom aria-label or fallback to generated one
 * @param options - Array of toggle options
 * @returns Appropriate aria-label string
 */
export const getToggleGroupAriaLabel = (
  ariaLabel?: string,
  options?: ToggleOption[]
): string => {
  if (ariaLabel) return ariaLabel;
  
  if (!options || options.length === 0) {
    return 'Toggle selection';
  }
  
  const optionLabels = options.map(option => option.label).join(', ');
  return `Select option from: ${optionLabels}`;
};

/**
 * Generates aria-label for individual toggle option
 * @param option - Toggle option data
 * @param selected - Whether the option is currently selected
 * @returns Appropriate aria-label string
 */
export const getToggleOptionAriaLabel = (
  option: ToggleOption,
  selected: boolean
): string => {
  if (option.ariaLabel) return option.ariaLabel;
  
  const status = selected ? 'selected' : 'not selected';
  return `${option.label}, ${status}`;
};

/**
 * Validates that option IDs are unique
 * @param options - Array of toggle options
 * @returns true if all IDs are unique, false otherwise
 */
export const validateUniqueOptionIds = (options: ToggleOption[]): boolean => {
  if (!options || options.length === 0) return true;
  
  const ids = options.map(option => option.id);
  const uniqueIds = new Set(ids);
  
  return ids.length === uniqueIds.size;
};

/**
 * Finds the next selectable option ID in the list
 * @param options - Array of toggle options
 * @param currentId - Currently selected option ID
 * @param direction - Direction to move ('next' or 'previous')
 * @returns Next selectable option ID or null if none found
 */
export const getNextSelectableOptionId = (
  options: ToggleOption[],
  currentId: string | undefined,
  direction: 'next' | 'previous'
): string | null => {
  if (!options || options.length === 0) return null;
  
  const enabledOptions = options.filter(option => !option.disabled);
  if (enabledOptions.length === 0) return null;
  
  if (!currentId) {
    return enabledOptions[0].id;
  }
  
  const currentIndex = enabledOptions.findIndex(option => option.id === currentId);
  if (currentIndex === -1) {
    return enabledOptions[0].id;
  }
  
  if (direction === 'next') {
    const nextIndex = (currentIndex + 1) % enabledOptions.length;
    return enabledOptions[nextIndex].id;
  } else {
    const prevIndex = currentIndex === 0 ? enabledOptions.length - 1 : currentIndex - 1;
    return enabledOptions[prevIndex].id;
  }
};

/**
 * Generates a unique name for the radio group if none provided
 * @param providedName - Optional provided name
 * @returns Unique radio group name
 */
export const generateRadioGroupName = (providedName?: string): string => {
  if (providedName) return providedName;
  
  return `toggle-group-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Checks if an option is valid (has required properties)
 * @param option - Toggle option to validate
 * @returns true if option is valid, false otherwise
 */
export const isValidToggleOption = (option: unknown): option is ToggleOption => {
  if (!option || typeof option !== 'object') {
    return false;
  }
  
  const obj = option as Record<string, unknown>;
  
  return (
    typeof obj.id === 'string' &&
    obj.id.length > 0 &&
    typeof obj.label === 'string' &&
    obj.label.length > 0
  );
};

/**
 * Sanitizes and validates an array of toggle options
 * @param options - Array of options to validate
 * @returns Array of valid, sanitized options
 */
export const sanitizeToggleOptions = (options: unknown): ToggleOption[] => {
  if (!Array.isArray(options)) return [];
  
  const validOptions = options.filter(isValidToggleOption);
  
  // Warn about duplicate IDs in development
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && !validateUniqueOptionIds(validOptions)) {
    console.warn('ToggleGroup: Duplicate option IDs detected. This may cause unexpected behavior.');
  }
  
  return validOptions;
};
