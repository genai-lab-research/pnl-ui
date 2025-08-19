import React, { useRef, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { TabBarProps } from './types';
import {
  StyledTabBar,
  StyledTab,
  TabContent,
  TabBadge,
  TabIndicator,
  LoadingWrapper,
  ErrorMessage,
} from './styles';

/**
 * TabBar component for horizontal navigation between sections
 * A reusable component that can be used for any tabbed navigation
 */
export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  value,
  onChange,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  error,
  ariaLabel,
  className,
  fullWidth = false,
}) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    width: number;
    left: number;
  }>({ width: 0, left: 0 });

  const selectedIndex = tabs.findIndex(tab => tab.value === value);

  // Update indicator position when selection changes or on mount
  useEffect(() => {
    if (!fullWidth && selectedIndex >= 0 && tabRefs.current[selectedIndex]) {
      const selectedTab = tabRefs.current[selectedIndex];
      if (selectedTab) {
        const { offsetLeft, offsetWidth } = selectedTab;
        setIndicatorStyle({
          width: offsetWidth,
          left: offsetLeft,
        });
      }
    }
  }, [selectedIndex, fullWidth, tabs]);

  const handleTabClick = (tabValue: string, isDisabled?: boolean) => {
    if (!disabled && !loading && !isDisabled) {
      onChange(tabValue);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    tabValue: string,
    isDisabled?: boolean
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabClick(tabValue, isDisabled);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const direction = e.key === 'ArrowLeft' ? -1 : 1;
      const currentIndex = tabs.findIndex(tab => tab.value === value);
      let nextIndex = currentIndex + direction;
      
      // Wrap around if necessary
      if (nextIndex < 0) nextIndex = tabs.length - 1;
      if (nextIndex >= tabs.length) nextIndex = 0;
      
      // Skip disabled tabs
      let attempts = 0;
      while (tabs[nextIndex]?.disabled && attempts < tabs.length) {
        nextIndex = nextIndex + direction;
        if (nextIndex < 0) nextIndex = tabs.length - 1;
        if (nextIndex >= tabs.length) nextIndex = 0;
        attempts++;
      }
      
      if (!tabs[nextIndex]?.disabled) {
        onChange(tabs[nextIndex].value);
        // Focus the next tab
        setTimeout(() => {
          tabRefs.current[nextIndex]?.focus();
        }, 0);
      }
    }
  };

  if (loading) {
    return (
      <LoadingWrapper className={className}>
        <CircularProgress size={16} />
      </LoadingWrapper>
    );
  }

  return (
    <div>
      <StyledTabBar 
        className={className}
        role="tablist"
        aria-label={ariaLabel || 'Navigation tabs'}
        $fullWidth={fullWidth}
      >
        {tabs.map((tab, index) => {
          const isSelected = tab.value === value;
          const isDisabled = disabled || tab.disabled || false;
          
          return (
            <StyledTab
              key={tab.id}
              ref={(el) => (tabRefs.current[index] = el)}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`tabpanel-${tab.value}`}
              aria-label={tab.label}
              tabIndex={isSelected ? 0 : -1}
              $isSelected={isSelected}
              $isDisabled={isDisabled}
              $variant={variant}
              $size={size}
              $fullWidth={fullWidth}
              disabled={isDisabled}
              onClick={() => handleTabClick(tab.value, tab.disabled)}
              onKeyDown={(e) => handleKeyDown(e, tab.value, tab.disabled)}
            >
              <TabContent>
                {tab.label}
                {tab.badge && (
                  <TabBadge aria-label={`${tab.badge} notifications`}>
                    {tab.badge}
                  </TabBadge>
                )}
              </TabContent>
            </StyledTab>
          );
        })}
        
        {/* Indicator for default variant */}
        {variant === 'default' && (
          <TabIndicator
            $selectedIndex={selectedIndex}
            $tabCount={tabs.length}
            $fullWidth={fullWidth}
            style={
              !fullWidth
                ? {
                    width: `${indicatorStyle.width}px`,
                    left: `${indicatorStyle.left}px`,
                  }
                : undefined
            }
          />
        )}
      </StyledTabBar>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default TabBar;
