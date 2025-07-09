export interface MenuProps {
  /**
   * Array of menu items to display
   */
  items: MenuItem[];
  /**
   * Callback fired when a menu item is clicked
   */
  onItemClick?: (item: MenuItem) => void;
  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface MenuItem {
  /**
   * Unique identifier for the menu item
   */
  id: string;
  /**
   * Display label for the menu item
   */
  label: string;
  /**
   * Optional action callback
   */
  action?: () => void;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
}