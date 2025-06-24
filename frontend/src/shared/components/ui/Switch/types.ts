export interface SwitchProps {
  /**
   * Whether the switch is toggled on
   */
  checked?: boolean;
  
  /**
   * Callback function when switch state changes
   */
  onChange?: (checked: boolean) => void;
  
  /**
   * Whether the switch is disabled
   */
  disabled?: boolean;
}