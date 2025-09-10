export { default } from './ToggleGroup';
export { default as ToggleGroup } from './ToggleGroup';
export type { ToggleGroupProps, ToggleOption, ToggleOptionProps } from './types';

// Export utilities for advanced use cases
export { 
  getToggleGroupAriaLabel,
  getToggleOptionAriaLabel,
  validateUniqueOptionIds,
  getNextSelectableOptionId,
  generateRadioGroupName,
  isValidToggleOption,
  sanitizeToggleOptions,
} from './utils';

// Export hooks for custom toggle group implementations
export { 
  useToggleGroupSelection,
  useToggleGroupKeyboard,
  useToggleGroupFocus,
  useRadioGroupName,
  useToggleOptionInteraction,
} from './hooks';

// Export theme for customization
export { toggleGroupTheme } from './theme';
export type { ToggleGroupTheme } from './theme';
