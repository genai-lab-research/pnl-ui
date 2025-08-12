import { HTMLInputTypeAttribute } from 'react';

export interface TextInputProps {
  /** Input type (text, email, password, etc.) */
  type?: HTMLInputTypeAttribute;
  /** Placeholder text to display when input is empty */
  placeholder?: string;
  /** Input value */
  value?: string;
  /** Input name attribute */
  name?: string;
  /** Unique identifier */
  id?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Whether input is required */
  required?: boolean;
  /** Whether input is read-only */
  readOnly?: boolean;
  /** Maximum number of characters allowed */
  maxLength?: number;
  /** Minimum number of characters required */
  minLength?: number;
  /** Loading state */
  loading?: boolean;
  /** Error message to display */
  error?: string;
  /** Visual variant */
  variant?: 'default' | 'outlined' | 'filled';
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class name */
  className?: string;
  /** Accessibility label */
  ariaLabel?: string;
  /** Test identifier */
  testId?: string;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Auto-complete attribute */
  autoComplete?: string;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Focus handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Blur handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Key press handler */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Key up handler */
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}