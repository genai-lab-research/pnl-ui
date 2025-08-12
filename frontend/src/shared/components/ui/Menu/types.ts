export interface MenuItemType {
  id: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface MenuProps {
  /**
   * Menu items to display
   */
  items: MenuItemType[];
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether the menu is visible
   */
  isVisible?: boolean;
  /**
   * Position of the menu
   */
  position?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  /**
   * Callback fired when menu should be closed
   */
  onClose?: () => void;
  /**
   * Whether to automatically close menu when item is selected
   */
  autoCloseOnSelect?: boolean;
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
}