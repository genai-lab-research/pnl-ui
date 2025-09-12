// Hook for Container Detail navigation and routing
import { useState, useCallback } from 'react';
import { ContainerDetailTab } from '../types';

export interface UseContainerDetailNavigationResult {
  activeTab: ContainerDetailTab;
  setActiveTab: (tab: ContainerDetailTab) => void;
  tabNavigationProps: {
    activeTab: ContainerDetailTab;
    onTabChange: (tab: ContainerDetailTab) => void;
  };
  navigationProps: {
    containerName: string;
    onBreadcrumbClick: () => void;
  };
}

/**
 * Custom hook for Container Detail page navigation
 * Manages tab state and breadcrumb navigation
 */
export const useContainerDetailNavigation = (
  containerId: number,
  containerName?: string
): UseContainerDetailNavigationResult => {
  const [activeTab, setActiveTab] = useState<ContainerDetailTab>('overview');

  const handleTabChange = useCallback((tab: ContainerDetailTab) => {
    setActiveTab(tab);
    
    // Update URL to reflect active tab
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState({}, '', url.toString());
  }, []);

  const handleBreadcrumbClick = useCallback(() => {
    // Navigate back to container management dashboard
    window.history.back();
  }, []);

  const tabNavigationProps = {
    activeTab,
    onTabChange: handleTabChange,
  };

  const navigationProps = {
    containerName: containerName || `Container ${containerId}`,
    onBreadcrumbClick: handleBreadcrumbClick,
  };

  return {
    activeTab,
    setActiveTab: handleTabChange,
    tabNavigationProps,
    navigationProps,
  };
};