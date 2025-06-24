export interface MediaControlButtonSetProps {
  /**
   * Handler for the previous button click
   */
  onPreviousClick?: () => void;
  
  /**
   * Handler for the play button click
   */
  onPlayClick?: () => void;
  
  /**
   * Handler for the repeat button click
   */
  onRepeatClick?: () => void;
  
  /**
   * Handler for the next button click
   */
  onNextClick?: () => void;
  
  /**
   * Variant of the component
   */
  variant?: 'default';
  
  /**
   * Disabled state of the component
   */
  disabled?: boolean;
  
  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface MediaControlButtonProps {
  /**
   * Handler for the button click
   */
  onClick?: () => void;
  
  /**
   * Icon component
   */
  icon: React.ReactNode;
  
  /**
   * Disabled state of the button
   */
  disabled?: boolean;
  
  /**
   * Additional CSS class name
   */
  className?: string;
}