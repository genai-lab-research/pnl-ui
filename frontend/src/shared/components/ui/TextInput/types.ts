/**
 * TextInput component type definitions
 */

export interface TextInputProps {
  /**
   * Optional placeholder text
   */
  placeholder?: string;
  
  /**
   * Input value
   */
  value?: string;
  
  /**
   * Change handler function
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  
  /**
   * Optional additional CSS class name
   */
  className?: string;
  
  /**
   * Optional ID for the input element
   */
  id?: string;
  
  /**
   * Optional name for the input element
   */
  name?: string;
  
  /**
   * Optional maximum length of input
   */
  maxLength?: number;
}