export interface TextInputProps {
  /** Input label text */
  label?: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Input value */
  value?: string;
  /** Callback when input value changes */
  onChange?: (value: string) => void;
  /** Whether the input is required */
  required?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Error message to display */
  error?: string;
  /** Helper text to display below input */
  helperText?: string;
  /** Visual variant of the input */
  variant?: 'default' | 'outlined' | 'filled';
  /** Size of the input */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  loading?: boolean;
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Custom className */
  className?: string;
  /** Whether to show character count */
  showCharCount?: boolean;
  /** Maximum character length */
  maxLength?: number;
}
