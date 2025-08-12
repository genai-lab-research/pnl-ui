import { MenuItemType } from '../types';

/**
 * Validates menu items to ensure they have required properties
 * @param items - Array of menu items to validate
 * @returns Boolean indicating if all items are valid
 */
export const validateMenuItems = (items: MenuItemType[]): boolean => {
  if (!Array.isArray(items) || items.length === 0) {
    return false;
  }

  return items.every(item => 
    item && 
    typeof item.id === 'string' && 
    item.id.trim() !== '' &&
    typeof item.label === 'string' && 
    item.label.trim() !== ''
  );
};

/**
 * Calculates optimal menu position to keep it within viewport bounds
 * @param triggerElement - Element that triggered the menu
 * @param menuWidth - Width of the menu (default: 145px)
 * @param menuHeight - Height of the menu
 * @returns Position object with top/left or right/bottom coordinates
 */
export const calculateMenuPosition = (
  triggerElement: HTMLElement,
  menuWidth: number = 145,
  menuHeight: number = 96
) => {
  const triggerRect = triggerElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  const position: { top?: number; left?: number; right?: number; bottom?: number } = {};

  // Horizontal positioning
  if (triggerRect.right + menuWidth <= viewportWidth) {
    // Menu fits to the right of trigger
    position.left = triggerRect.right;
  } else if (triggerRect.left - menuWidth >= 0) {
    // Menu fits to the left of trigger
    position.right = viewportWidth - triggerRect.left;
  } else {
    // Center menu if it doesn't fit either side
    position.left = Math.max(0, (viewportWidth - menuWidth) / 2);
  }

  // Vertical positioning
  if (triggerRect.bottom + menuHeight <= viewportHeight) {
    // Menu fits below trigger
    position.top = triggerRect.bottom;
  } else if (triggerRect.top - menuHeight >= 0) {
    // Menu fits above trigger
    position.bottom = viewportHeight - triggerRect.top;
  } else {
    // Position menu at the top of viewport with some margin
    position.top = 10;
  }

  return position;
};

/**
 * Generates unique IDs for menu items if they don't have them
 * @param items - Array of menu items
 * @returns Array of menu items with guaranteed unique IDs
 */
export const ensureUniqueIds = (items: MenuItemType[]): MenuItemType[] => {
  const usedIds = new Set<string>();
  
  return items.map((item, index) => {
    let id = item.id;
    
    // If ID is missing or already used, generate a new one
    if (!id || usedIds.has(id)) {
      id = `menu-item-${index}-${Date.now()}`;
    }
    
    usedIds.add(id);
    
    return {
      ...item,
      id,
    };
  });
};

/**
 * Filters menu items based on search query
 * @param items - Array of menu items to filter
 * @param query - Search query string
 * @returns Filtered array of menu items
 */
export const filterMenuItems = (items: MenuItemType[], query: string): MenuItemType[] => {
  if (!query || query.trim() === '') {
    return items;
  }

  const searchTerm = query.toLowerCase().trim();
  
  return items.filter(item => 
    item.label.toLowerCase().includes(searchTerm)
  );
};