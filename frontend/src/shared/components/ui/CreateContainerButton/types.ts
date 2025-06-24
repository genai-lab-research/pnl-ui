export interface CreateContainerButtonProps {
  /**
   * Function to call when button is clicked
   */
  onClick: () => void;
  
  /**
   * Optional className for styling
   */
  className?: string;

  /**
   * Optional disabled state
   */
  disabled?: boolean;
}