import React, { useMemo, useRef, useEffect } from 'react';
import { MenuProps } from './types';
import { MenuContainer, MenuItem, MenuItemText } from './styles';
import { useMenu } from './hooks';
import { validateMenuItems, ensureUniqueIds } from './utils';

/**
 * Menu component for displaying a popup menu with list of actions
 * Features:
 * - Keyboard navigation (Arrow keys, Enter, Space, Escape)
 * - Responsive design with breakpoint support
 * - Accessibility compliant with ARIA attributes
 * - Theme-based styling for consistency
 * - Overflow handling for long menu items
 * 
 * Replicates the Figma design for "Vertical Farming Control Panel" menu
 */
const Menu: React.FC<MenuProps> = ({
  items,
  className,
  isVisible = true,
  position,
  onClose,
  autoCloseOnSelect = true,
  'aria-label': ariaLabel = 'Menu',
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Ensure all items have unique IDs and validate them
  const processedItems = useMemo(() => {
    if (!validateMenuItems(items)) {
      console.warn('Menu: Invalid menu items provided');
      return [];
    }
    return ensureUniqueIds(items);
  }, [items]);

  // Use menu hook for keyboard navigation and interactions
  const {
    selectedIndex,
    isKeyboardNavigation,
    handleKeyDown,
    handleItemClick,
    focusedItemId,
  } = useMenu({
    items: processedItems,
    onClose,
    autoCloseOnSelect,
  });

  // Focus menu container when it becomes visible
  useEffect(() => {
    if (isVisible && menuRef.current) {
      menuRef.current.focus();
    }
  }, [isVisible]);

  if (!isVisible || processedItems.length === 0) {
    return null;
  }

  return (
    <MenuContainer 
      ref={menuRef}
      className={className} 
      position={position}
      role="menu"
      aria-label={ariaLabel}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {processedItems.map((item, index) => (
        <MenuItem
          key={item.id}
          isLast={index === processedItems.length - 1}
          onClick={() => handleItemClick(item, index)}
          role="menuitem"
          tabIndex={isKeyboardNavigation && selectedIndex === index ? 0 : -1}
          aria-selected={selectedIndex === index}
          data-focused={focusedItemId === item.id}
          onMouseEnter={() => {
            // Update selection on mouse hover only if not using keyboard navigation
            if (!isKeyboardNavigation) {
              // setSelectedIndex(index); // Removed to prevent focus conflicts
            }
          }}
        >
          <MenuItemText>{item.label}</MenuItemText>
        </MenuItem>
      ))}
    </MenuContainer>
  );
};

export default Menu;