/** @jsxImportSource @emotion/react */
import React, { useRef, useEffect, useState } from 'react';
import { TabNavigationProps } from './types';
import { useTabClasses, useKeyboardNavigation } from './hooks';
import {
  containerStyles,
  tabGroupStyles,
  tabItemStyles,
  tabContentStyles,
  labelStyles,
  badgeStyles,
  indicatorStyles,
  loadingStyles,
  variantStyles,
} from './styles';

/**
 * TabNavigation - A reusable horizontal tab navigation component
 * 
 * Features:
 * - Fully responsive design with horizontal scrolling on mobile
 * - Support for multiple visual variants (default, compact, pill)
 * - Customizable sizes (sm, md, lg)
 * - Keyboard navigation support (Arrow keys, Home, End)
 * - Loading states with skeleton placeholders
 * - Accessibility support with proper ARIA attributes
 * - Active state indicator with smooth transitions
 * - Badge support for tab items
 * - Icon slot support
 * - Disabled state handling
 */
const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  indicatorColor = '#3545EE',
  indicatorPosition = 'bottom',
  loading = false,
  ariaLabel = 'Tab navigation',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabClasses = useTabClasses({ variant, size, fullWidth, className });
  const { handleKeyDown } = useKeyboardNavigation(tabs, activeTabId, onTabChange);

  // Update indicator position when active tab changes
  useEffect(() => {
    if (!containerRef.current || loading) return;
    
    const updateIndicatorPosition = () => {
      const activeIndex = tabs.findIndex(tab => tab.id === activeTabId);
      const tabElements = containerRef.current?.querySelectorAll('[data-tab-item]');
      const activeElement = tabElements?.[activeIndex] as HTMLElement;
      
      if (activeElement) {
        setIndicatorStyle({
          left: activeElement.offsetLeft,
          width: activeElement.offsetWidth,
        });
      }
    };
    
    // Update immediately
    updateIndicatorPosition();
    
    // Update on resize to handle responsive changes
    const handleResize = () => {
      setTimeout(updateIndicatorPosition, 10); // Small delay to ensure layout is complete
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tabs, activeTabId, loading]);

  // Loading state
  if (loading) {
    return (
      <div css={[containerStyles, loadingStyles]} className={tabClasses} role="tablist" aria-label={ariaLabel}>
        <div css={tabGroupStyles}>
          {[...Array(4)].map((_, index) => (
            <div key={index} css={tabItemStyles} className={`size-${size}`}>
              <div className="skeleton skeleton-tab" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (!disabled) {
      onTabChange(tabId);
    }
  };

  const getTabItemStyles = () => {
    if (variant === 'pill') return variantStyles.pill;
    if (variant === 'compact') return variantStyles.compact;
    return tabItemStyles;
  };

  return (
    <div
      ref={containerRef}
      css={containerStyles}
      className={tabClasses}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      <div css={tabGroupStyles}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const itemClasses = [
            `size-${size}`,
            isActive ? 'active' : 'inactive',
            fullWidth ? 'full-width' : '',
          ].filter(Boolean).join(' ');

          return (
            <button
              key={tab.id}
              data-tab-item
              css={getTabItemStyles()}
              className={itemClasses}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              aria-label={tab.badge ? `${tab.label} (${tab.badge})` : tab.label}
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab.id, tab.disabled)}
              onKeyDown={isActive ? handleKeyDown : undefined}
            >
              <div css={tabContentStyles}>
                {tab.iconSlot}
                <span css={labelStyles}>
                  {tab.label}
                </span>
                {tab.badge && (
                  <span css={badgeStyles}>
                    {tab.badge}
                  </span>
                )}
              </div>
              
              {/* Active indicator for default variant */}
              {isActive && variant === 'default' && (
                <div
                  css={indicatorStyles}
                  className={`position-${indicatorPosition}`}
                  style={{ backgroundColor: indicatorColor }}
                />
              )}
            </button>
          );
        })}
        
        {/* Shared indicator for default variant - positioned absolutely */}
        {variant === 'default' && tabs.length > 0 && !loading && (
          <div
            css={[
              indicatorStyles,
              {
                position: 'absolute',
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                backgroundColor: indicatorColor,
              }
            ]}
            className={`position-${indicatorPosition}`}
            style={{
              transform: `translateX(0px)`,
              transition: 'left 0.2s cubic-bezier(0.4, 0.0, 0.2, 1), width 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TabNavigation;