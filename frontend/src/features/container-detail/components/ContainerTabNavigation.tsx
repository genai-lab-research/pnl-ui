import React from 'react';
import { TabBar } from '../../../shared/components/ui/TabBar';
import { CONTAINER_TABS, ContainerTabNavigationProps } from '../types/ui-models';

/**
 * ContainerTabNavigation - Domain component for container section navigation
 * 
 * This component provides a container-specific interface for navigating between
 * different sections: Overview, Environment & Recipes, Inventory, and Devices.
 * 
 * Wraps the TabBar atomic component with container-specific props and styling.
 */
export const ContainerTabNavigation: React.FC<ContainerTabNavigationProps> = ({
  activeTab,
  onTabChange,
  customTabs,
  showBadges = false,
  badgeCounts = {},
  containerId,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  error,
  className,
  ...segmentedToggleProps
}) => {
  // Use custom tabs if provided, otherwise use default container tabs
  const tabs = customTabs || CONTAINER_TABS;
  
  // Transform ContainerTabModel to TabOption format
  const tabOptions = tabs.map((tab) => {
    let label = tab.label;
    
    // Add badge count to label if badges are enabled and count exists
    if (showBadges && badgeCounts[tab.value]) {
      label = `${tab.label} (${badgeCounts[tab.value]})`;
    }
    
    return {
      id: tab.id,
      label,
      value: tab.value,
      disabled: tab.disabled || disabled,
    };
  });
  
  // Generate accessibility label
  const ariaLabel = containerId 
    ? `Container ${containerId} navigation tabs`
    : 'Container navigation tabs';

  return (
    <TabBar
      tabs={tabOptions}
      value={activeTab}
      onChange={onTabChange}
      variant={variant}
      size={size}
      disabled={disabled}
      loading={loading}
      error={error}
      ariaLabel={ariaLabel}
      className={className}
    />
  );
};

export default ContainerTabNavigation;
