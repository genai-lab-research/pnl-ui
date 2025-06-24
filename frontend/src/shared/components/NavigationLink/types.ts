export interface NavigationLinkProps {
  /**
   * The text to display in the navigation link
   */
  text: string;
  
  /**
   * Optional className for additional styling
   */
  className?: string;

  /**
   * Optional click handler
   */
  onClick?: () => void;
}
