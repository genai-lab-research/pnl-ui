// Container Navigation Hook - Manages header navigation and breadcrumbs
import { useState, useEffect, useCallback, useRef } from 'react';
import { ContainerHeaderViewModel } from '../viewmodels';
import { ContainerInfo } from '../../../api/containerApiService';

/**
 * Hook for container navigation and header management
 */
export function useContainerNavigation(containerInfo?: ContainerInfo) {
  const [refreshKey, setRefreshKey] = useState(0);
  const viewModelRef = useRef<ContainerHeaderViewModel | null>(null);

  // Initialize ViewModel
  useEffect(() => {
    const viewModel = new ContainerHeaderViewModel(containerInfo);
    viewModelRef.current = viewModel;

    // Subscribe to changes
    const unsubscribe = viewModel.subscribe(() => {
      setRefreshKey(prev => prev + 1);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      viewModelRef.current = null;
    };
  }, []);

  // Update when container info changes
  useEffect(() => {
    if (containerInfo && viewModelRef.current) {
      viewModelRef.current.updateContainerInfo(containerInfo);
    }
  }, [containerInfo]);

  // Getters
  const getNavigationModel = useCallback(() => {
    return viewModelRef.current?.getNavigationModel() || null;
  }, [refreshKey]);

  const getHeaderModel = useCallback(() => {
    return viewModelRef.current?.getHeaderModel() || null;
  }, [refreshKey]);

  const getContainerTitle = useCallback(() => {
    return viewModelRef.current?.getContainerTitle() || 'Container Detail';
  }, [refreshKey]);

  const getContainerSubtitle = useCallback(() => {
    return viewModelRef.current?.getContainerSubtitle() || '';
  }, [refreshKey]);

  const getStatusBadge = useCallback(() => {
    return viewModelRef.current?.getStatusBadge() || null;
  }, [refreshKey]);

  const getContainerMetadata = useCallback(() => {
    return viewModelRef.current?.getContainerMetadata() || [];
  }, [refreshKey]);

  const hasContainerData = useCallback(() => {
    return viewModelRef.current?.hasContainerData() || false;
  }, [refreshKey]);

  const isLoading = useCallback(() => {
    return viewModelRef.current?.isLoading() || false;
  }, [refreshKey]);

  // Navigation actions
  const navigateBack = useCallback(() => {
    const navigationModel = getNavigationModel();
    if (navigationModel) {
      navigationModel.onNavigateBack();
    }
  }, [getNavigationModel]);

  const navigateToContainerManagement = useCallback(() => {
    // TODO: Use proper routing
    window.location.href = '/container-management';
  }, []);

  const navigateToContainer = useCallback((containerId: number) => {
    // TODO: Use proper routing
    window.location.href = `/container-detail/${containerId}`;
  }, []);

  // Breadcrumb data
  const getBreadcrumbItems = useCallback(() => {
    const containerTitle = getContainerTitle();
    
    return [
      {
        label: 'Container Management',
        href: '/container-management',
        onClick: navigateToContainerManagement,
      },
      {
        label: containerTitle,
        href: null, // Current page
        onClick: null,
      },
    ];
  }, [getContainerTitle, navigateToContainerManagement]);

  // Page header data
  const getPageHeaderData = useCallback(() => {
    return {
      title: getContainerTitle(),
      subtitle: getContainerSubtitle(),
      statusBadge: getStatusBadge(),
      metadata: getContainerMetadata(),
      breadcrumbItems: getBreadcrumbItems(),
    };
  }, [
    getContainerTitle,
    getContainerSubtitle,
    getStatusBadge,
    getContainerMetadata,
    getBreadcrumbItems,
  ]);

  return {
    // Models for UI components
    navigationModel: getNavigationModel(),
    headerModel: getHeaderModel(),
    pageHeaderData: getPageHeaderData(),
    
    // Navigation actions
    navigateBack,
    navigateToContainerManagement,
    navigateToContainer,
    
    // Display data
    containerTitle: getContainerTitle(),
    containerSubtitle: getContainerSubtitle(),
    statusBadge: getStatusBadge(),
    containerMetadata: getContainerMetadata(),
    breadcrumbItems: getBreadcrumbItems(),
    
    // State
    hasData: hasContainerData(),
    isLoading: isLoading(),
    
    // Utility
    showBreadcrumb: hasContainerData(),
    showHeader: hasContainerData(),
    showStatusBadge: !!getStatusBadge(),
    showMetadata: getContainerMetadata().length > 0,
  };
}
