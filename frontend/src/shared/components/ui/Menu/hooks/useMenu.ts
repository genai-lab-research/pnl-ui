import { useState, useCallback, useEffect } from 'react';
import { MenuItemType } from '../types';

export interface UseMenuProps {
  items: MenuItemType[];
  onClose?: () => void;
  autoCloseOnSelect?: boolean;
}

export interface UseMenuReturn {
  selectedIndex: number;
  isKeyboardNavigation: boolean;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  handleItemClick: (item: MenuItemType, index: number, event?: React.MouseEvent) => void;
  setSelectedIndex: (index: number) => void;
  focusedItemId: string | null;
}

/**
 * Custom hook for managing menu keyboard navigation and interactions
 * Provides accessibility features like arrow key navigation and Enter/Space activation
 */
export const useMenu = ({ 
  items, 
  onClose, 
  autoCloseOnSelect = true 
}: UseMenuProps): UseMenuReturn => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);

  const focusedItemId = selectedIndex >= 0 && selectedIndex < items.length 
    ? items[selectedIndex].id 
    : null;

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setIsKeyboardNavigation(true);
        setSelectedIndex(prevIndex => 
          prevIndex < items.length - 1 ? prevIndex + 1 : 0
        );
        break;

      case 'ArrowUp':
        event.preventDefault();
        setIsKeyboardNavigation(true);
        setSelectedIndex(prevIndex => 
          prevIndex > 0 ? prevIndex - 1 : items.length - 1
        );
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          const item = items[selectedIndex];
          item.onClick?.();
          if (autoCloseOnSelect) {
            onClose?.();
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        onClose?.();
        break;

      case 'Tab':
        // Allow default tab behavior but close menu
        onClose?.();
        break;

      default:
        break;
    }
  }, [items, selectedIndex, onClose, autoCloseOnSelect]);

  const handleItemClick = useCallback((item: MenuItemType, index: number, event?: React.MouseEvent) => {
    setSelectedIndex(index);
    setIsKeyboardNavigation(false);
    item.onClick?.(event);
    if (autoCloseOnSelect) {
      onClose?.();
    }
  }, [onClose, autoCloseOnSelect]);

  // Reset selected index when items change
  useEffect(() => {
    setSelectedIndex(-1);
    setIsKeyboardNavigation(false);
  }, [items]);

  return {
    selectedIndex,
    isKeyboardNavigation,
    handleKeyDown,
    handleItemClick,
    setSelectedIndex,
    focusedItemId,
  };
};