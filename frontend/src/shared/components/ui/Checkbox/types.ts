export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Whether the checkbox is checked
   */
  checked?: boolean;
  
  /**
   * Callback function when checkbox state changes
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  
  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean;
}
