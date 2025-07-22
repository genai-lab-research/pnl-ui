import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Header } from '../../shared/components/ui/Header';
import { SearchFilters } from '../../shared/components/ui/SearchFilters';
import { TimeRangeSelector } from '../../shared/components/ui/TimeRangeSelector';
import ContainerStatistics from '../../shared/components/ui/ContainerStatistics';
import { ContainerTable, SortField, SortConfig } from '../../shared/components/ui/ContainerTable';
import { Paginator } from '../../shared/components/ui/Paginator';
import { CreateContainerButton } from '../../shared/components/ui/CreateContainerButton';
import { CreateContainerPanel } from '../CreateContainerPanel';
import { ShutdownContainerModal } from './components/ShutdownContainerModal';
import { ChatSidebar } from '../../shared/components/ui/ChatSidebar';
import { containerApiService } from '../../api/containerApiService';
import { tenantApiService } from '../../api/tenantApiService';
import { Container } from '../../shared/types/containers';
import { 
  ContainerFilterCriteria, 
  FilterOptions
} from '../../types/container';
import { TimeRange } from '../../shared/components/ui/TimeRangeSelector/types';

const DashboardContainer = styled(Box)({
  backgroundColor: '#F7F9FD',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

const ContentContainer = styled(Box)({
  flex: 1,
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

const PageTitle = styled(Typography)({
  fontFamily: 'Inter, sans-serif',
  fontSize: '32px',
  fontWeight: 700,
  color: '#000000',
  marginBottom: '16px',
});

const StatisticsSection = styled(Box)({
  display: 'flex',
  gap: '20px',
  marginBottom: '16px',
});

const ContainerListSection = styled(Box)({
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  boxShadow: '0px 0px 2px rgba(65, 64, 69, 1)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const ContainerListHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ContainerListTitle = styled(Typography)({
  fontFamily: 'Inter, sans-serif',
  fontSize: '20px',
  fontWeight: 600,
  color: '#000000',
});

export const ContainerManagement: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('Week');
  const [physicalMetrics, setPhysicalMetrics] = useState<{
    containerCount: number;
    yieldData: { average: number; total: number; dailyData: number[] };
    spaceUtilization: { average: number; dailyData: number[] };
    quarterMonths?: string[];
  } | null>(null);
  const [virtualMetrics, setVirtualMetrics] = useState<{
    containerCount: number;
    yieldData: { average: number; total: number; dailyData: number[] };
    spaceUtilization: { average: number; dailyData: number[] };
    quarterMonths?: string[];
  } | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 0 });
  const [tenantMap, setTenantMap] = useState<Map<number, string>>(new Map());
  
  // Filter states
  const [searchValue, setSearchValue] = useState('');
  const [selectedType, setSelectedType] = useState('All types');
  const [selectedTenant, setSelectedTenant] = useState('All tenants');
  const [selectedPurpose, setSelectedPurpose] = useState('All purposes');
  const [selectedStatus, setSelectedStatus] = useState('All statuses');
  const [hasAlerts, setHasAlerts] = useState(false);
  const [selectedContainerType, setSelectedContainerType] = useState<'physical' | 'virtual' | null>(null);
  const [createPanelOpen, setCreatePanelOpen] = useState(false);
  const [lastUpdatedContainer, setLastUpdatedContainer] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', order: 'asc' });
  
  // Shutdown modal state
  const [shutdownModalOpen, setShutdownModalOpen] = useState(false);
  const [containerToShutdown, setContainerToShutdown] = useState<Container | null>(null);
  
  // Chat sidebar state
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);

  const buildFilterCriteria = useCallback((pageOverride?: number): ContainerFilterCriteria => {
    const criteria: ContainerFilterCriteria = {
      page: pageOverride ?? pagination.page,
      limit: pagination.limit,
      sort: sortConfig.field,
      order: sortConfig.order,
    };

    if (searchValue.trim()) criteria.search = searchValue.trim();
    if (selectedType !== 'All types') criteria.type = selectedType as 'physical' | 'virtual';
    if (selectedTenant !== 'All tenants' && filterOptions?.tenants) {
      const tenant = filterOptions.tenants.find(t => t.name === selectedTenant);
      if (tenant) criteria.tenant = tenant.id;
    }
    if (selectedPurpose !== 'All purposes') criteria.purpose = selectedPurpose as any;
    if (selectedStatus !== 'All statuses') criteria.status = selectedStatus as any;
    if (hasAlerts) criteria.alerts = true;
    if (selectedContainerType) criteria.type = selectedContainerType;

    return criteria;
  }, [
    pagination.page,
    pagination.limit,
    searchValue,
    selectedType,
    selectedTenant,
    selectedPurpose,
    selectedStatus,
    hasAlerts,
    selectedContainerType,
    sortConfig.field,
    sortConfig.order,
    filterOptions
  ]);

  // Load metrics data only (for charts)
  const loadMetrics = useCallback(async () => {
    try {
      setMetricsLoading(true);
      // Clear previous metrics data when time range changes
      setPhysicalMetrics(null);
      setVirtualMetrics(null);
      
      const metricsResponse = await containerApiService.getPerformanceMetrics({
        timeRange: selectedTimeRange.toLowerCase() as 'week' | 'month' | 'quarter' | 'year'
      });
      
      // Transform metrics for ContainerStatistics component
      const transformMetrics = (metrics: { 
        container_count: number;
        yield: { average: number; total: number; chart_data: Array<{ date?: string; value: number }> };
        space_utilization: { average: number; chart_data: Array<{ date?: string; value: number }> };
      }) => {
        let yieldData = metrics.yield.chart_data;
        let spaceData = metrics.space_utilization.chart_data;
        let quarterMonths: string[] = [];

        // For quarter view, extract last full classic quarter
        if (selectedTimeRange === 'Quarter' && yieldData.length > 0 && yieldData[0].date) {
          const today = new Date();
          const currentMonth = today.getMonth(); // 0-11
          const currentQuarter = Math.floor(currentMonth / 3); // 0-3
          
          // Calculate last full quarter
          let lastQuarter = currentQuarter - 1;
          let lastQuarterStartMonth = 0;
          let lastQuarterEndMonth = 0;
          
          if (currentQuarter === 0) {
            // If we're in Q1, last quarter is Q4 of previous year
            lastQuarter = 3;
            lastQuarterStartMonth = 9; // October
            lastQuarterEndMonth = 11; // December
          } else {
            lastQuarterStartMonth = lastQuarter * 3;
            lastQuarterEndMonth = lastQuarterStartMonth + 2;
          }
          
          // Filter data to get only the months from last quarter
          const filteredYieldData: typeof yieldData = [];
          const filteredSpaceData: typeof spaceData = [];
          
          yieldData.forEach((d, index) => {
            if (d.date) {
              const date = new Date(d.date);
              const month = date.getMonth();
              if (month >= lastQuarterStartMonth && month <= lastQuarterEndMonth) {
                filteredYieldData.push(d);
                if (spaceData[index]) {
                  filteredSpaceData.push(spaceData[index]);
                }
              }
            }
          });
          
          yieldData = filteredYieldData;
          spaceData = filteredSpaceData;
          
          // Set quarter month labels
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          quarterMonths = [
            monthNames[lastQuarterStartMonth],
            monthNames[lastQuarterStartMonth + 1],
            monthNames[lastQuarterStartMonth + 2]
          ];
        }

        // Extract values from chart data
        const yieldValues = yieldData.map(d => d.value);
        const spaceValues = spaceData.map(d => d.value);

        return {
          containerCount: metrics.container_count,
          yieldData: {
            average: metrics.yield.average,
            total: metrics.yield.total,
            dailyData: yieldValues
          },
          spaceUtilization: {
            average: metrics.space_utilization.average,
            dailyData: spaceValues
          },
          quarterMonths: quarterMonths.length > 0 ? quarterMonths : undefined
        };
      };

      setPhysicalMetrics(transformMetrics(metricsResponse.physical));
      setVirtualMetrics(transformMetrics(metricsResponse.virtual));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setMetricsLoading(false);
    }
  }, [selectedTimeRange]);

  // Load table data only (for container list)
  const loadTableData = useCallback(async (isPagination = false, pageOverride?: number) => {
    try {
      if (isPagination) {
        setPaginationLoading(true);
      } else {
        setLoading(true);
      }
      
      const criteria = buildFilterCriteria(pageOverride);
      const listResponse = await containerApiService.listContainers(criteria);

      // Transform API containers to UI container format
      const transformedContainers: Container[] = listResponse.containers.map(apiContainer => ({
        id: apiContainer.id.toString(),
        name: apiContainer.name,
        type: apiContainer.type,
        tenant: tenantMap.get(apiContainer.tenant_id) || `tenant-${apiContainer.tenant_id}`,
        purpose: apiContainer.purpose,
        location: apiContainer.location,
        seed_types: apiContainer.seed_types,
        status: apiContainer.status === 'active' ? 'connected' : apiContainer.status,
        created: apiContainer.created_at,
        modified: apiContainer.updated_at,
        has_alert: apiContainer.alerts?.length > 0 || false,
        notes: apiContainer.notes,
        shadow_service_enabled: apiContainer.shadow_service_enabled,
        ecosystem_connected: apiContainer.ecosystem_connected,
      }));

      setContainers(transformedContainers);
      
      // Update pagination metadata from API response
      setPagination(prev => ({
        ...prev,
        total: listResponse.pagination.total,
        total_pages: listResponse.pagination.total_pages,
        // Keep the current page from UI state if pageOverride is provided
        page: pageOverride ?? listResponse.pagination.page
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load table data');
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  }, [buildFilterCriteria, tenantMap]);

  // Combined load function for initial load or when both need to be refreshed
  const loadData = useCallback(async () => {
    await Promise.all([loadMetrics(), loadTableData()]);
  }, [loadMetrics, loadTableData]);

  // Load filter options once on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      if (!filterOptions) {
        try {
          const options = await containerApiService.getFilterOptions();
          setFilterOptions(options);
        } catch (err) {
          console.error('Failed to load filter options:', err);
        }
      }
    };
    loadFilterOptions();
  }, []); // Only run once on mount

  // Load tenants and create mapping
  useEffect(() => {
    const loadTenants = async () => {
      try {
        const tenants = await tenantApiService.getTenants();
        const map = new Map<number, string>();
        tenants.forEach(tenant => {
          map.set(tenant.id, tenant.name);
        });
        setTenantMap(map);
      } catch (err) {
        console.error('Failed to load tenants:', err);
      }
    };
    loadTenants();
  }, []); // Only run once on mount

  // Initial load - wait for tenants to be loaded
  useEffect(() => {
    // Only load data after tenant map is populated
    if (tenantMap.size > 0) {
      loadData();
    }
  }, [tenantMap]); // eslint-disable-line react-hooks/exhaustive-deps

  // Remove pagination tracking useEffect to prevent infinite loops

  // Reload metrics only when time range changes
  useEffect(() => {
    loadMetrics();
  }, [selectedTimeRange, loadMetrics]);

  // Reload table data when filters or sort changes
  useEffect(() => {
    // Only load if tenant map is ready
    if (tenantMap.size > 0) {
      // Reset to page 1 when filters change
      setPagination(prev => ({ ...prev, page: 1 }));
      loadTableData();
    }
  }, [searchValue, selectedType, selectedTenant, selectedPurpose, selectedStatus, hasAlerts, selectedContainerType, sortConfig.field, sortConfig.order, tenantMap]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleTypeChange = useCallback((value: string) => {
    setSelectedType(value);
  }, []);

  const handleTenantChange = useCallback((value: string) => {
    setSelectedTenant(value);
  }, []);

  const handlePurposeChange = useCallback((value: string) => {
    setSelectedPurpose(value);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value);
  }, []);

  const handleAlertsChange = useCallback((value: boolean) => {
    setHasAlerts(value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchValue('');
    setSelectedType('All types');
    setSelectedTenant('All tenants');
    setSelectedPurpose('All purposes');
    setSelectedStatus('All statuses');
    setHasAlerts(false);
    setSelectedContainerType(null);
  }, []);

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setSelectedTimeRange(range);
  }, []);

  const handlePageChange = useCallback(async (page: number) => {
    if (paginationLoading) return; // Prevent multiple requests
    
    // Update pagination state immediately for UI responsiveness
    setPagination(prev => ({ ...prev, page }));
    
    // Load table data with the new page
    await loadTableData(true, page);
  }, [paginationLoading, loadTableData]);

  const handleContainerTypeClick = useCallback((type: 'physical' | 'virtual') => {
    if (selectedContainerType === type) {
      setSelectedContainerType(null);
    } else {
      setSelectedContainerType(type);
    }
  }, [selectedContainerType]);

  const handleRowAction = useCallback((container: Container, action: string) => {
    console.log('Row action:', action, container);
    
    if (action === 'shutdown') {
      setContainerToShutdown(container);
      setShutdownModalOpen(true);
    } else {
      // Handle other actions (view, edit)
      console.log('Other action not implemented yet:', action);
    }
  }, []);

  const handleCreateContainer = useCallback(() => {
    setCreatePanelOpen(true);
  }, []);

  const handleCreatePanelClose = useCallback(() => {
    setCreatePanelOpen(false);
  }, []);

  const handleContainerCreated = useCallback((container: any) => {
    // Refresh both metrics and table data when a new container is created
    loadData();
    console.log('Container created successfully:', container);
  }, [loadData]);

  const handleShutdownModalClose = useCallback(() => {
    setShutdownModalOpen(false);
    setContainerToShutdown(null);
  }, []);

  const handleShutdownConfirm = useCallback(async (reason?: string, force?: boolean) => {
    if (!containerToShutdown) return;

    try {
      await containerApiService.shutdownContainer(
        parseInt(containerToShutdown.id),
        { reason, force }
      );
      
      // Update container status to inactive in local state
      setContainers(prev => 
        prev.map(container => 
          container.id === containerToShutdown.id 
            ? { ...container, status: 'inactive', modified: new Date().toISOString() }
            : container
        )
      );
      
      // Show success feedback
      setLastUpdatedContainer(containerToShutdown.id);
      setTimeout(() => setLastUpdatedContainer(null), 3000);
      
      // Refresh metrics to reflect the change
      setTimeout(() => loadMetrics(), 1000);
      
      console.log('Container shutdown successfully:', containerToShutdown.name);
    } catch (error) {
      console.error('Failed to shutdown container:', error);
      throw error; // Re-throw to let modal handle the error display
    }
  }, [containerToShutdown, loadMetrics]);

  const validateContainerState = useCallback(async (containerId: string) => {
    try {
      // Fetch the specific container from backend to verify state
      const backendContainer = await containerApiService.getContainer(parseInt(containerId));
      if (backendContainer) {
        const localContainer = containers.find(c => c.id === containerId);
        
        if (localContainer) {
          // Compare critical fields to ensure synchronization
          const isOutOfSync = 
            localContainer.status !== backendContainer.status ||
            localContainer.name !== backendContainer.name ||
            localContainer.purpose !== backendContainer.purpose ||
            JSON.stringify(localContainer.location) !== JSON.stringify(backendContainer.location);
          
          if (isOutOfSync) {
            console.warn('Container state out of sync, refreshing...', {
              local: localContainer,
              backend: backendContainer
            });
            // Refresh the list if out of sync
            await loadTableData();
          }
        }
      }
    } catch (error) {
      console.error('Error validating container state:', error);
    }
  }, [containers, loadTableData]);

  const handleContainerUpdated = useCallback(async (updatedContainer: Container) => {
    try {
      // Transform the updated container to match the API format expected by our list
      const transformedContainer: Container = {
        ...updatedContainer,
        // Ensure the status mapping is consistent with our display format
        status: updatedContainer.status,
        // Ensure location format is consistent
        location: updatedContainer.location,
        // Update the modified timestamp to reflect the change
        modified: new Date().toISOString(),
      };

      // Update the container in the local state
      setContainers(prev => 
        prev.map(container => 
          container.id === transformedContainer.id ? transformedContainer : container
        )
      );
      
      console.log('Container updated successfully:', transformedContainer);
      
      // Track the last updated container for UI feedback
      setLastUpdatedContainer(transformedContainer.id);
      setTimeout(() => setLastUpdatedContainer(null), 3000); // Clear after 3 seconds
      
      // Refresh metrics if container type or status changed significantly
      // This ensures statistics are up to date
      const originalContainer = containers.find(c => c.id === updatedContainer.id);
      if (originalContainer && 
          (originalContainer.status !== updatedContainer.status || 
           originalContainer.type !== updatedContainer.type)) {
        // Only reload if there are significant changes that affect metrics
        setTimeout(() => loadMetrics(), 1000); // Small delay to allow backend to process
      }
      
      // Validate backend synchronization after a brief delay
      setTimeout(() => validateContainerState(updatedContainer.id), 2000);
      
    } catch (error) {
      console.error('Error updating container in local state:', error);
      // Fallback: reload table data to ensure consistency
      await loadTableData();
    }
  }, [containers, loadMetrics, loadTableData, validateContainerState]);

  const handleSort = useCallback((field: SortField) => {
    setSortConfig((prevConfig: SortConfig) => ({
      field,
      order: prevConfig.field === field && prevConfig.order === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleTalk2DBClick = useCallback(() => {
    setChatSidebarOpen(true);
  }, []);

  const handleChatSidebarClose = useCallback(() => {
    setChatSidebarOpen(false);
  }, []);

  if (loading && !containers.length) {
    return (
      <DashboardContainer>
        <Header logoText="Control Panel" onTalk2DBClick={handleTalk2DBClick} isChatOpen={chatSidebarOpen} />
        <ContentContainer>
          <Typography>Loading...</Typography>
        </ContentContainer>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <Header logoText="Control Panel" onTalk2DBClick={handleTalk2DBClick} isChatOpen={chatSidebarOpen} />
        <ContentContainer>
          <Typography color="error">Error: {error}</Typography>
        </ContentContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header logoText="Control Panel" onTalk2DBClick={handleTalk2DBClick} isChatOpen={chatSidebarOpen} />
      <ContentContainer>
        <PageTitle>Container Management</PageTitle>
        
        <SearchFilters
          onSearchChange={handleSearch}
          onTypeChange={handleTypeChange}
          onTenantChange={handleTenantChange}
          onPurposeChange={handlePurposeChange}
          onStatusChange={handleStatusChange}
          onAlertsChange={handleAlertsChange}
          onClearFilters={handleClearFilters}
          searchValue={searchValue}
          types={filterOptions?.container_types || []}
          selectedType={selectedType}
          tenants={filterOptions?.tenants.map(t => t.name) || []}
          selectedTenant={selectedTenant}
          purposes={filterOptions?.purposes || []}
          selectedPurpose={selectedPurpose}
          statuses={filterOptions?.statuses || []}
          selectedStatus={selectedStatus}
          hasAlerts={hasAlerts}
        />

        <TimeRangeSelector
          selectedRange={selectedTimeRange}
          onRangeChange={handleTimeRangeChange}
        />

        <StatisticsSection>
          {metricsLoading ? (
            <>
              <Box flex={1} sx={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '8px', 
                padding: '24px',
                boxShadow: '0px 0px 2px rgba(65, 64, 69, 1)',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: '40px',
                      height: '40px',
                      border: '3px solid #E0E0E0',
                      borderTop: '3px solid #1976D2',
                      borderRadius: '50%',
                      margin: '0 auto 16px',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                  <Typography sx={{ color: '#666', fontFamily: 'Inter, sans-serif' }}>
                    Loading metrics...
                  </Typography>
                </Box>
              </Box>
              <Box flex={1} sx={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '8px', 
                padding: '24px',
                boxShadow: '0px 0px 2px rgba(65, 64, 69, 1)',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: '40px',
                      height: '40px',
                      border: '3px solid #E0E0E0',
                      borderTop: '3px solid #1976D2',
                      borderRadius: '50%',
                      margin: '0 auto 16px',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                  <Typography sx={{ color: '#666', fontFamily: 'Inter, sans-serif' }}>
                    Loading metrics...
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            <>
              {physicalMetrics && (
                <Box flex={1} onClick={() => handleContainerTypeClick('physical')} sx={{ cursor: 'pointer' }}>
                  <ContainerStatistics
                    title="Physical Containers"
                    containerCount={physicalMetrics.containerCount}
                    yieldData={physicalMetrics.yieldData}
                    spaceUtilization={physicalMetrics.spaceUtilization}
                    timeRange={selectedTimeRange}
                    dayLabels={selectedTimeRange === 'Quarter' && physicalMetrics.quarterMonths ? physicalMetrics.quarterMonths : undefined}
                  />
                </Box>
              )}
              {virtualMetrics && (
                <Box flex={1} onClick={() => handleContainerTypeClick('virtual')} sx={{ cursor: 'pointer' }}>
                  <ContainerStatistics
                    title="Virtual Containers"
                    containerCount={virtualMetrics.containerCount}
                    yieldData={virtualMetrics.yieldData}
                    spaceUtilization={virtualMetrics.spaceUtilization}
                    timeRange={selectedTimeRange}
                    dayLabels={selectedTimeRange === 'Quarter' && virtualMetrics.quarterMonths ? virtualMetrics.quarterMonths : undefined}
                  />
                </Box>
              )}
            </>
          )}
        </StatisticsSection>

        <ContainerListSection>
          <ContainerListHeader>
            <ContainerListTitle>Container List</ContainerListTitle>
            <CreateContainerButton onClick={handleCreateContainer} />
          </ContainerListHeader>
          
          <Box sx={{ position: 'relative' }}>
            <ContainerTable
              containers={containers}
              onRowAction={handleRowAction}
              onContainerUpdated={handleContainerUpdated}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
            {paginationLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: '#FFFFFF',
                    padding: '16px 24px',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  <Box
                    sx={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #E0E0E0',
                      borderTop: '2px solid #1976D2',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#333333',
                    }}
                  >
                    Loading page...
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
          
          {lastUpdatedContainer && (
            <Box
              sx={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000,
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Container updated successfully!
            </Box>
          )}
          
          <Paginator
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
            loading={paginationLoading}
          />
        </ContainerListSection>
      </ContentContainer>
      
      <CreateContainerPanel
        open={createPanelOpen}
        onClose={handleCreatePanelClose}
        onSuccess={handleContainerCreated}
      />
      
      <ShutdownContainerModal
        open={shutdownModalOpen}
        container={containerToShutdown}
        onClose={handleShutdownModalClose}
        onConfirm={handleShutdownConfirm}
      />
      
      <ChatSidebar
        open={chatSidebarOpen}
        onClose={handleChatSidebarClose}
      />
    </DashboardContainer>
  );
};