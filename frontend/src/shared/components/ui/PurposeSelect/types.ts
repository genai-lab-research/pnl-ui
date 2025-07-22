export interface PurposeSelectProps {
  /**
   * The current value of the select
   */
  value?: string;
  /**
   * Function called when selection changes
   */
  onChange?: (value: string) => void;
  /**
   * Optional placeholder text
   */
  placeholder?: string;
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  /**
   * Width of the select component
   */
  width?: number | string;
}
