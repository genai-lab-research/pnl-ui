import { useCallback, useMemo } from 'react';
import { TimePeriodTabItem } from './types';

export const useTabClasses = ({
  variant,
  size,
  fullWidth,
  className
}: {
  variant?: string;
  size?: string;
  fullWidth?: boolean;
  className?: string;
}) => {
  return useMemo(() => {
    const classes = [
      'time-period-tabs',
      variant ? `variant-${variant}` : '',
      size ? `size-${size}` : '',
      fullWidth ? 'full-width' : '',
      className || ''
    ].filter(Boolean);
    
    return classes.join(' ');
  }, [variant, size, fullWidth, className]);
};

export const useKeyboardNavigation = (
  tabs: TimePeriodTabItem[],
  selectedTabId: string,
  onTabChange: (tabId: string) => void
) => {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const enabledTabs = tabs.filter(tab => !tab.disabled);
    const currentIndex = enabledTabs.findIndex(tab => tab.id === selectedTabId);
    
    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledTabs.length - 1;
        onTabChange(enabledTabs[prevIndex].id);
        break;
      }
      case 'ArrowRight': {
        event.preventDefault();
        const nextIndex = currentIndex < enabledTabs.length - 1 ? currentIndex + 1 : 0;
        onTabChange(enabledTabs[nextIndex].id);
        break;
      }
      case 'Home': {
        event.preventDefault();
        onTabChange(enabledTabs[0].id);
        break;
      }
      case 'End': {
        event.preventDefault();
        onTabChange(enabledTabs[enabledTabs.length - 1].id);
        break;
      }
    }
  }, [tabs, selectedTabId, onTabChange]);

  return { handleKeyDown };
};