/** @jsxImportSource @emotion/react */
import React from 'react';
import { TimePeriodTabsProps } from './types';
import { useTabClasses, useKeyboardNavigation } from './hooks';
import {
  containerStyles,
  tabGroupStyles,
  tabItemStyles,
  tabContentStyles,
  labelStyles,
  variantStyles,
  sizeStyles,
  loadingStyles,
  errorStyles,
  errorMessageStyles
} from './styles';

/**
 * TimePeriodTabs - A reusable time period selector component with border-based selection
 * 
 * Features:
 * - Clean border-based selection (no underline indicator)
 * - Support for multiple visual variants (default, compact, outlined)
 * - Customizable sizes (sm, md, lg)
 * - Keyboard navigation support (Arrow keys, Home, End)
 * - Loading states with skeleton placeholders
 * - Error state handling
 * - Accessibility support with proper ARIA attributes
 * - Fully responsive design
 * - Disabled state handling
 */
const TimePeriodTabs: React.FC<TimePeriodTabsProps> = ({
  tabs = [],
  selectedTabId,
  onTabChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  primaryColor = '#3545EE',
  textColor = '#3545EE',
  mutedTextColor = '#49454F',
  loading = false,
  error,
  ariaLabel = 'Time period selection',
  className = '',
}) => {
  const tabClasses = useTabClasses({ variant, size, fullWidth, className });
  const { handleKeyDown } = useKeyboardNavigation(tabs, selectedTabId, onTabChange);

  // Loading state
  if (loading) {
    return (
      <div 
        css={[containerStyles, loadingStyles, variant !== 'default' ? variantStyles[variant] : undefined]} 
        className={`${tabClasses} loading`}
        role="tablist" 
        aria-label={ariaLabel}
        style={{ width: fullWidth ? '100%' : undefined }}
      >
        <div css={tabGroupStyles}>
          {[...Array(4)].map((_, index) => (
            <div 
              key={index} 
              css={[tabItemStyles, size !== 'md' ? sizeStyles[size] : undefined]}
              className="tab-item"
            >
              <div css={tabContentStyles} className="tab-content">
                <div className="skeleton" />
              </div>
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

  const getContainerStyles = () => {
    const styles = [containerStyles];
    if (error) styles.push(errorStyles);
    if (variant !== 'default') styles.push(variantStyles[variant]);
    return styles;
  };

  const getTabItemStyles = () => {
    const styles = [tabItemStyles];
    if (size !== 'md') styles.push(sizeStyles[size]);
    return styles;
  };

  const getTabClasses = (isSelected: boolean) => {
    const classes = ['tab-item'];
    if (isSelected) classes.push('selected');
    return classes.join(' ');
  };

  const getDynamicStyles = (isSelected: boolean) => {
    return {
      borderColor: error ? '#d32f2f' : (isSelected ? primaryColor : 'transparent'),
    };
  };

  const getLabelStyles = (isSelected: boolean) => {
    return {
      color: error ? '#d32f2f' : (isSelected ? textColor : mutedTextColor),
    };
  };

  return (
    <div
      css={getContainerStyles()}
      className={`${tabClasses} ${error ? 'error' : ''}`}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      style={{ width: fullWidth ? '100%' : undefined }}
    >
      <div css={tabGroupStyles}>
        {tabs.map((tab) => {
          const isSelected = tab.id === selectedTabId;
          
          return (
            <button
              key={tab.id}
              css={getTabItemStyles()}
              className={getTabClasses(isSelected)}
              role="tab"
              tabIndex={isSelected ? 0 : -1}
              aria-selected={isSelected}
              aria-controls={`tabpanel-${tab.id}`}
              aria-label={tab.label}
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab.id, tab.disabled)}
              style={getDynamicStyles(isSelected)}
            >
              <div css={tabContentStyles} className="tab-content">
                <span 
                  css={labelStyles}
                  className="tab-label"
                  style={getLabelStyles(isSelected)}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      
      {error && (
        <div
          css={errorMessageStyles}
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default TimePeriodTabs;