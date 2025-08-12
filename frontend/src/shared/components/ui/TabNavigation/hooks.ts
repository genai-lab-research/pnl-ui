import { useMemo, useCallback } from 'react';
import { TabItem } from './types';

export const useTabClasses = ({
  variant,
  size,
  fullWidth,
  className,
}: {
  variant?: string;
  size?: string;
  fullWidth?: boolean;
  className?: string;
}) => {
  return useMemo(() => {
    const classes = ['tab-navigation'];
    
    if (variant && variant !== 'default') {
      classes.push(`variant-${variant}`);
    }
    
    if (size) {
      classes.push(`size-${size}`);
    }
    
    if (fullWidth) {
      classes.push('full-width');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  }, [variant, size, fullWidth, className]);
};

export const useActiveTabIndex = (tabs: TabItem[], activeTabId: string) => {
  return useMemo(() => {
    return tabs.findIndex(tab => tab.id === activeTabId);
  }, [tabs, activeTabId]);
};

export const useKeyboardNavigation = (
  tabs: TabItem[],
  activeTabId: string,
  onTabChange: (tabId: string) => void,
) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTabId);
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    // Skip disabled tabs
    while (tabs[newIndex]?.disabled && newIndex !== currentIndex) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        newIndex = newIndex > 0 ? newIndex - 1 : tabs.length - 1;
      } else {
        newIndex = newIndex < tabs.length - 1 ? newIndex + 1 : 0;
      }
    }

    if (!tabs[newIndex]?.disabled) {
      onTabChange(tabs[newIndex].id);
    }
  }, [tabs, activeTabId, onTabChange]);

  return { handleKeyDown };
};

export const useIndicatorPosition = (
  tabs: TabItem[],
  activeTabId: string,
  containerRef: React.RefObject<HTMLDivElement>,
) => {
  return useMemo(() => {
    if (!containerRef.current) return { left: 0, width: 0 };
    
    const activeIndex = tabs.findIndex(tab => tab.id === activeTabId);
    const tabElements = containerRef.current.querySelectorAll('[data-tab-item]');
    const activeElement = tabElements[activeIndex] as HTMLElement;
    
    if (!activeElement) return { left: 0, width: 0 };
    
    return {
      left: activeElement.offsetLeft,
      width: activeElement.offsetWidth,
    };
  }, [tabs, activeTabId, containerRef]);
};