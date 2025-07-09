import React from 'react';
import { MenuContainer, MenuItemContainer, MenuItemText } from './styles';
import { MenuProps, MenuItem } from './types';

/**
 * Menu component that displays a contextual menu with a list of action items.
 * Used within control panels to present actions like Edit & Settings, View, and Shutdown.
 * 
 * @param items - Array of menu items to display
 * @param onItemClick - Callback fired when a menu item is clicked
 * @param className - Additional CSS class name
 */
const Menu: React.FC<MenuProps> = ({ 
  items, 
  onItemClick, 
  className 
}) => {
  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled) {
      if (item.action) {
        item.action();
      }
      if (onItemClick) {
        onItemClick(item);
      }
    }
  };

  return (
    <MenuContainer className={className}>
      {items.map((item, index) => (
        <MenuItemContainer
          key={item.id}
          hasTopBorder={index === items.length - 1}
          onClick={() => handleItemClick(item)}
        >
          <MenuItemText>{item.label}</MenuItemText>
        </MenuItemContainer>
      ))}
    </MenuContainer>
  );
};

export default Menu;