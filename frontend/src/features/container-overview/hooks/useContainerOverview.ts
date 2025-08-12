// Custom hook for Container Overview page logic
// Manages overall page state, navigation, and coordination

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContainerOverviewViewModel, ContainerOverviewState } from '../viewmodels/container-overview.viewmodel';

export interface UseContainerOverviewOptions {
  containerId: number;
  initialTab?: 'overview' | 'environment' | 'inventory' | 'devices';
  onTabChange?: (tab: string) => void;
  onError?: (error: string) => void;
}

export interface UseContainerOverviewResult {
  // State
  state: ContainerOverviewState;
  
  // Actions
  switchTab: (tab: 'overview' | 'environment' | 'inventory' | 'devices') => Promise<void>;
  refreshData: () => Promise<void>;
  navigateToDashboard: () => void;
  clearError: () => void;
  
  // Computed values
  breadcrumbs: ReturnType<ContainerOverviewViewModel['getBreadcrumbs']>;
  tabs: ReturnType<ContainerOverviewViewModel['getTabs']>;
  containerDisplayName: string;
  containerType: string;
  tenantName: string;
  locationString: string;
  statusColor: 'success' | 'warning' | 'error' | 'info';
  statusLabel: string;
  containerIconType: string;
  hasLocationInfo: boolean;
  
  // Permissions
  canViewContainer: boolean;
  canEditContainer: boolean;
  canManageContainer: boolean;
  
  // State checks
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export function useContainerOverview(options: UseContainerOverviewOptions): UseContainerOverviewResult {
  const { containerId, initialTab, onTabChange, onError } = options;
  
  const viewModelRef = useRef<ContainerOverviewViewModel | null>(null);
  const [state, setState] = useState<ContainerOverviewState>({
    containerInfo: null,
    activeTab: initialTab || 'overview',
    isLoading: true,
    error: null,
    permissions: { canView: false, canEdit: false, canManage: false },
    timeRange: 'week',
    metricInterval: 'day'
  });

  // Initialize ViewModel
  useEffect(() => {
    const viewModel = new ContainerOverviewViewModel(containerId);
    viewModelRef.current = viewModel;

    // Set up state change listener
    viewModel.setStateChangeListener((newState) => {
      setState(newState);
    });

    // Initialize data
    viewModel.initialize().catch((error) => {
      console.error('Failed to initialize container overview:', error);
      if (onError) {
        onError(error.message);
      }
    });

    // Set initial tab if provided
    if (initialTab) {
      viewModel.setActiveTabFromUrl(initialTab);
    }

    // Cleanup on unmount
    return () => {
      viewModel.destroy();
    };
  }, [containerId]); // FIXED: Only depend on containerId to prevent re-initialization

  // Tab switching
  const switchTab = useCallback(async (tab: 'overview' | 'environment' | 'inventory' | 'devices') => {
    if (viewModelRef.current) {
      await viewModelRef.current.switchTab(tab);
      if (onTabChange) {
        onTabChange(tab);
      }
    }
  }, [onTabChange]);

  // Data refresh
  const refreshData = useCallback(async () => {
    if (viewModelRef.current) {
      await viewModelRef.current.refreshData();
    }
  }, []);

  // Navigation
  const navigateToDashboard = useCallback(() => {
    if (viewModelRef.current) {
      viewModelRef.current.navigateToDashboard();
    }
  }, []);

  // Error handling
  const clearError = useCallback(() => {
    if (viewModelRef.current) {
      viewModelRef.current.clearError();
    }
  }, []);

  // Computed values (memoized for performance)
  const breadcrumbs = viewModelRef.current?.getBreadcrumbs() || [];
  const tabs = viewModelRef.current?.getTabs() || [];
  const containerDisplayName = viewModelRef.current?.getContainerDisplayName() || '';
  const containerType = viewModelRef.current?.getContainerType() || '';
  const tenantName = viewModelRef.current?.getTenantName() || '';
  const locationString = viewModelRef.current?.getLocationString() || '';
  const statusColor = viewModelRef.current?.getStatusColor() || 'info';
  const statusLabel = viewModelRef.current?.getStatusLabel() || '';
  const containerIconType = viewModelRef.current?.getContainerIconType() || '';
  const hasLocationInfo = viewModelRef.current?.hasLocationInfo() || false;

  // Permissions
  const canViewContainer = viewModelRef.current?.canViewContainer() || false;
  const canEditContainer = viewModelRef.current?.canEditContainer() || false;
  const canManageContainer = viewModelRef.current?.canManageContainer() || false;

  // State checks
  const isLoading = viewModelRef.current?.isLoading() || false;
  const hasError = viewModelRef.current?.hasError() || false;
  const errorMessage = viewModelRef.current?.getErrorMessage() || null;

  return {
    // State
    state,
    
    // Actions
    switchTab,
    refreshData,
    navigateToDashboard,
    clearError,
    
    // Computed values
    breadcrumbs,
    tabs,
    containerDisplayName,
    containerType,
    tenantName,
    locationString,
    statusColor,
    statusLabel,
    containerIconType,
    hasLocationInfo,
    
    // Permissions
    canViewContainer,
    canEditContainer,
    canManageContainer,
    
    // State checks
    isLoading,
    hasError,
    errorMessage
  };
}

// URL synchronization hook
export function useContainerOverviewUrlSync(
  containerId: number,
  onTabChange: (tab: string) => void
) {
  useEffect(() => {
    // Listen for browser navigation events
    const handlePopState = () => {
      const path = window.location.pathname;
      const tabMatch = path.match(/\/containers\/\d+\/(.+)$/);
      if (tabMatch) {
        onTabChange(tabMatch[1]);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onTabChange]);
}

// Breadcrumb navigation hook
export function useBreadcrumbNavigation() {
  const navigate = useNavigate();
  
  const navigateToPath = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const navigateToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  return {
    navigateToPath,
    navigateToDashboard
  };
}
