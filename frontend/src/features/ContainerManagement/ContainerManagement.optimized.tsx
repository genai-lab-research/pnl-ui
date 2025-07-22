import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
import { containerApiService } from '../../api/containerApiService';
import { Container } from '../../shared/types/containers';
import { 
  ContainerListResponse, 
  ContainerFilterCriteria, 
  FilterOptions,
  PerformanceMetrics 
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

// Memoized loading spinner component
const LoadingSpinner = React.memo(() => (
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
));

LoadingSpinner.displayName = 'LoadingSpinner';

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

  // Cache refs to prevent unnecessary API calls
  const metricsCache = useRef<{ [key: string]: PerformanceMetrics }>({});
  const filterOptionsCache = useRef<FilterOptions | null>(null);
  const loadingRef = useRef<{ containers: boolean; metrics: boolean }>({ containers: false, metrics: false });

  // Memoize filter criteria to prevent recreating on every render
  const filterCriteria = useMemo((): ContainerFilterCriteria => {
    const criteria: ContainerFilterCriteria = {
      page: pagination.page,
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

  // Load containers separately from metrics
  const loadContainers = useCallback(async (isPagination = false) => {
    if (loadingRef.current.containers) return; // Prevent duplicate calls
    loadingRef.current.containers = true;

    try {
      if (isPagination) {
        setPaginationLoading(true);
      } else {
        setLoading(true);
      }

      const listResponse = await containerApiService.listContainers(filterCriteria);

      // Transform API containers to UI container format
      const transformedContainers: Container[] = listResponse.containers.map(apiContainer => ({
        id: apiContainer.id.toString(),
        name: apiContainer.name,
        type: apiContainer.type,
        tenant: `tenant-${apiContainer.tenant_id}`,
        purpose: apiContainer.purpose,
        location: apiContainer.location,
        status: apiContainer.status === 'active' ? 'connected' : apiContainer.status,
        created: apiContainer.created_at,
        modified: apiContainer.updated_at,
        has_alert: apiContainer.alerts?.length > 0 || false,
        notes: apiContainer.notes,
        shadow_service_enabled: apiContainer.shadow_service_enabled,
        ecosystem_connected: apiContainer.ecosystem_connected,
      }));

      // Batch state updates
      setContainers(transformedContainers);
      setPagination(prev => {
        if (prev.page === listResponse.pagination.page && 
            prev.limit === listResponse.pagination.limit &&
            prev.total === listResponse.pagination.total &&
            prev.total_pages === listResponse.pagination.total_pages) {
          return prev;
        }
        return listResponse.pagination;
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load containers');
    } finally {
      setLoading(false);
      setPaginationLoading(false);
      loadingRef.current.containers = false;
    }
  }, [filterCriteria]);

  // Load metrics separately with caching
  const loadMetrics = useCallback(async () => {
    if (loadingRef.current.metrics) return; // Prevent duplicate calls
    loadingRef.current.metrics = true;

    const cacheKey = selectedTimeRange.toLowerCase();
    
    // Check cache first
    if (metricsCache.current[cacheKey]) {
      const cached = metricsCache.current[cacheKey];
      const { physical, virtual } = transformMetricsData(cached, selectedTimeRange);
      setPhysicalMetrics(physical);
      setVirtualMetrics(virtual);
      loadingRef.current.metrics = false;
      return;
    }

    try {
      setMetricsLoading(true);
      
      const metricsResponse = await containerApiService.getPerformanceMetrics({
        timeRange: selectedTimeRange.toLowerCase() as 'week' | 'month' | 'quarter' | 'year'
      });

      // Cache the response
      metricsCache.current[cacheKey] = metricsResponse;

      const { physical, virtual } = transformMetricsData(metricsResponse, selectedTimeRange);
      
      // Batch state updates
      setPhysicalMetrics(physical);
      setVirtualMetrics(virtual);

    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setMetricsLoading(false);
      loadingRef.current.metrics = false;
    }
  }, [selectedTimeRange]);

  // Transform metrics helper function
  const transformMetricsData = (metricsResponse: PerformanceMetrics, timeRange: TimeRange) => {
    const transformMetrics = (metrics: { 
      container_count: number;
      yield: { average: number; total: number; chart_data: Array<{ date?: string; value: number }> };
      space_utilization: { average: number; chart_data: Array<{ date?: string; value: number }> };
    }) => {
      let yieldData = metrics.yield.chart_data;
      let spaceData = metrics.space_utilization.chart_data;
      let quarterMonths: string[] = [];

      // For quarter view, extract last full classic quarter
      if (timeRange === 'Quarter' && yieldData.length > 0 && yieldData[0].date) {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentQuarter = Math.floor(currentMonth / 3);
        
        let lastQuarter = currentQuarter - 1;
        let lastQuarterStartMonth = 0;
        let lastQuarterEndMonth = 0;
        
        if (currentQuarter === 0) {
          lastQuarter = 3;
          lastQuarterStartMonth = 9;
          lastQuarterEndMonth = 11;
        } else {
          lastQuarterStartMonth = lastQuarter * 3;
          lastQuarterEndMonth = lastQuarterStartMonth + 2;
        }
        
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
        
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        quarterMonths = [
          monthNames[lastQuarterStartMonth],
          monthNames[lastQuarterStartMonth + 1],
          monthNames[lastQuarterStartMonth + 2]
        ];
      }

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

    return {
      physical: transformMetrics(metricsResponse.physical),
      virtual: transformMetrics(metricsResponse.virtual)
    };
  };

  // Load filter options once on mount with caching
  useEffect(() => {
    const loadFilterOptions = async () => {
      if (filterOptionsCache.current) {
        setFilterOptions(filterOptionsCache.current);
        return;
      }

      try {
        const options = await containerApiService.getFilterOptions();
        filterOptionsCache.current = options;
        setFilterOptions(options);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };
    loadFilterOptions();
  }, []);

  // Initial load
  useEffect(() => {
    loadContainers();
    loadMetrics();
  }, []); // Only run once on mount

  // Handle filter changes
  useEffect(() => {
    loadContainers();
  }, [filterCriteria, loadContainers]);

  // Handle time range changes for metrics only
  useEffect(() => {
    loadMetrics();
  }, [selectedTimeRange, loadMetrics]);

  // Memoized handlers to prevent recreation
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleTypeChange = useCallback((value: string) => {
    setSelectedType(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleTenantChange = useCallback((value: string) => {
    setSelectedTenant(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handlePurposeChange = useCallback((value: string) => {
    setSelectedPurpose(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleAlertsChange = useCallback((value: boolean) => {
    setHasAlerts(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    // Batch all filter updates
    setSearchValue('');
    setSelectedType('All types');
    setSelectedTenant('All tenants');
    setSelectedPurpose('All purposes');
    setSelectedStatus('All statuses');
    setHasAlerts(false);
    setSelectedContainerType(null);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setSelectedTimeRange(range);
  }, []);

  const handlePageChange = useCallback(async (page: number) => {
    if (paginationLoading || loadingRef.current.containers) return;
    setPagination(prev => ({ ...prev, page }));
  }, [paginationLoading]);

  const handleContainerTypeClick = useCallback((type: 'physical' | 'virtual') => {
    setSelectedContainerType(prev => prev === type ? null : type);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleRowAction = useCallback((container: Container, action: string) => {
    if (action === 'shutdown') {
      setContainerToShutdown(container);
      setShutdownModalOpen(true);
    } else {
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
    // Invalidate cache and reload
    metricsCache.current = {};
    loadContainers();
    loadMetrics();
    console.log('Container created successfully:', container);
  }, [loadContainers, loadMetrics]);

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
      
      // Optimistically update local state
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
      
      // Invalidate metrics cache and reload after a delay
      setTimeout(() => {
        metricsCache.current = {};
        loadMetrics();
      }, 1000);
      
      console.log('Container shutdown successfully:', containerToShutdown.name);
    } catch (error) {
      console.error('Failed to shutdown container:', error);
      // Reload on error to ensure consistency
      loadContainers();
      throw error;
    }
  }, [containerToShutdown, loadContainers, loadMetrics]);

  const handleContainerUpdated = useCallback(async (updatedContainer: Container) => {
    try {
      // Optimistically update local state
      setContainers(prev => 
        prev.map(container => 
          container.id === updatedContainer.id 
            ? { ...updatedContainer, modified: new Date().toISOString() }
            : container
        )
      );
      
      console.log('Container updated successfully:', updatedContainer);
      
      // Track the last updated container for UI feedback
      setLastUpdatedContainer(updatedContainer.id);
      setTimeout(() => setLastUpdatedContainer(null), 3000);
      
      // Check if metrics need refresh
      const originalContainer = containers.find(c => c.id === updatedContainer.id);
      if (originalContainer && 
          (originalContainer.status !== updatedContainer.status || 
           originalContainer.type !== updatedContainer.type)) {
        // Invalidate cache and reload metrics
        setTimeout(() => {
          metricsCache.current = {};
          loadMetrics();
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error updating container in local state:', error);
      loadContainers();
    }
  }, [containers, loadContainers, loadMetrics]);

  const handleSort = useCallback((field: SortField) => {
    setSortConfig(prevConfig => ({
      field,
      order: prevConfig.field === field && prevConfig.order === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  if (loading && !containers.length) {
    return (
      <DashboardContainer>
        <Header logoText="Control Panel" />
        <ContentContainer>
          <Typography>Loading...</Typography>
        </ContentContainer>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <Header logoText="Control Panel" />
        <ContentContainer>
          <Typography color="error">Error: {error}</Typography>
        </ContentContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header logoText="Control Panel" />
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
                <LoadingSpinner />
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
                <LoadingSpinner />
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
    </DashboardContainer>
  );
};