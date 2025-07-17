import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import {
  DashboardContainer,
  ContentContainer,
  PageTitle,
  StatisticsSection,
  ContainerListSection,
  ContainerListHeader,
  ContainerListTitle
} from './ContainerDashboardPage.styles';
import { colors } from '../../shared/styles';
import { Header } from '../../shared/components/ui/Header';
import { SearchFilters } from '../../shared/components/ui/SearchFilters';
import { TimeRangeSelector } from '../../shared/components/ui/TimeRangeSelector';
import ContainerStatistics from '../../shared/components/ui/ContainerStatistics';
import { ContainerTable, SortField, SortConfig } from '../../shared/components/ui/ContainerTable';
import { Paginator } from '../../shared/components/ui/Paginator';
import { CreateContainerButton } from '../../shared/components/ui/CreateContainerButton';
import { CreateContainerPanel } from '../CreateContainerPanel';
import { containerApiService } from '../../api/containerApiService';
import { Container } from '../../shared/types/containers';
import {
  ContainerFilterCriteria,
  FilterOptions
} from '../../types/container';
import { TimeRange } from '../../shared/components/ui/TimeRangeSelector/types';



const ContainerDashboardPage: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('Week');
  const [physicalMetrics, setPhysicalMetrics] = useState<{
    containerCount: number;
    yieldData: { average: number; total: number; dailyData: number[] };
    spaceUtilization: { average: number; dailyData: number[] };
  } | null>(null);
  const [virtualMetrics, setVirtualMetrics] = useState<{
    containerCount: number;
    yieldData: { average: number; total: number; dailyData: number[] };
    spaceUtilization: { average: number; dailyData: number[] };
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

  const buildFilterCriteria = useCallback((): ContainerFilterCriteria => {
    const criteria: ContainerFilterCriteria = {
      page: pagination.page,
      limit: pagination.limit,
      sort: sortConfig.field,
      order: sortConfig.order,
    };

    if (searchValue.trim()) criteria.search = searchValue.trim();

    // Use selectedContainerType if set (from clicking stats), otherwise use selectedType from dropdown
    if (selectedContainerType) {
      criteria.type = selectedContainerType;
    } else if (selectedType !== 'All types') {
      criteria.type = selectedType as 'physical' | 'virtual';
    }

    if (selectedTenant !== 'All tenants') {
      const tenant = filterOptions?.tenants.find(t => t.name === selectedTenant);
      if (tenant) criteria.tenant = tenant.id;
    }
    if (selectedPurpose !== 'All purposes') criteria.purpose = selectedPurpose as 'development' | 'research' | 'production';
    if (selectedStatus !== 'All statuses') criteria.status = selectedStatus as 'created' | 'active' | 'maintenance' | 'inactive';
    if (hasAlerts) criteria.alerts = true;

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
    filterOptions,
    sortConfig
  ]);

  const loadData = useCallback(async (timeRange?: TimeRange) => {
    try {
      setLoading(true);
      const criteria = buildFilterCriteria();

      const currentTimeRange = timeRange || selectedTimeRange;
      const metricsRequest = {
        timeRange: currentTimeRange.toLowerCase() as 'week' | 'month' | 'quarter' | 'year'
      };

      console.log('Making API call with timeRange:', currentTimeRange);

      const [listResponse, filterOptionsResponse, metricsResponse] = await Promise.all([
        containerApiService.listContainers(criteria),
        filterOptions ? Promise.resolve(filterOptions) : containerApiService.getFilterOptions(),
        containerApiService.getPerformanceMetrics(metricsRequest)
      ]);

      console.log('Metrics API response:', metricsResponse);

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

      setContainers(transformedContainers);
      setPagination(listResponse.pagination);
      if (!filterOptions) setFilterOptions(filterOptionsResponse);

      // Transform metrics for ContainerStatistics component
      const transformMetrics = (metrics: {
        container_count: number;
        yield: { average: number; total: number; chart_data: Array<{ value: number }> };
        space_utilization: { average: number; chart_data: Array<{ value: number }> };
      }) => ({
        containerCount: metrics.container_count,
        yieldData: {
          average: metrics.yield.average,
          total: metrics.yield.total,
          dailyData: metrics.yield.chart_data.map(d => d.value)
        },
        spaceUtilization: {
          average: metrics.space_utilization.average,
          dailyData: metrics.space_utilization.chart_data.map(d => d.value)
        }
      });


      const newPhysicalMetrics = transformMetrics(metricsResponse.physical);
      const newVirtualMetrics = transformMetrics(metricsResponse.virtual);

      console.log('Setting new physical metrics:', newPhysicalMetrics);
      console.log('Setting new virtual metrics:', newVirtualMetrics);

      setPhysicalMetrics(newPhysicalMetrics);
      setVirtualMetrics(newVirtualMetrics);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [buildFilterCriteria, selectedTimeRange, filterOptions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
    setSearchValue('');
    setSelectedType('All types');
    setSelectedTenant('All tenants');
    setSelectedPurpose('All purposes');
    setSelectedStatus('All statuses');
    setHasAlerts(false);
    setSelectedContainerType(null);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

      const loadDataWithTimeRange = useCallback(async (timeRange: TimeRange) => {
    try {
      setLoading(true);
      const criteria = buildFilterCriteria();

      const metricsRequest = {
        timeRange: timeRange.toLowerCase() as 'week' | 'month' | 'quarter' | 'year'
      };

      console.log('Making API call with timeRange:', timeRange);

      const [listResponse, filterOptionsResponse, metricsResponse] = await Promise.all([
        containerApiService.listContainers(criteria),
        filterOptions ? Promise.resolve(filterOptions) : containerApiService.getFilterOptions(),
        containerApiService.getPerformanceMetrics(metricsRequest)
      ]);

      console.log('Metrics API response:', metricsResponse);

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

      setContainers(transformedContainers);
      setPagination(listResponse.pagination);
      if (!filterOptions) setFilterOptions(filterOptionsResponse);

      // Transform metrics for ContainerStatistics component
      const transformMetrics = (metrics: {
        container_count: number;
        yield: { average: number; total: number; chart_data: Array<{ value: number }> };
        space_utilization: { average: number; chart_data: Array<{ value: number }> };
      }) => ({
        containerCount: metrics.container_count,
        yieldData: {
          average: metrics.yield.average,
          total: metrics.yield.total,
          dailyData: metrics.yield.chart_data.map(d => d.value)
        },
        spaceUtilization: {
          average: metrics.space_utilization.average,
          dailyData: metrics.space_utilization.chart_data.map(d => d.value)
        }
      });

      const newPhysicalMetrics = transformMetrics(metricsResponse.physical);
      const newVirtualMetrics = transformMetrics(metricsResponse.virtual);

      console.log('Setting new physical metrics:', newPhysicalMetrics);
      console.log('Setting new virtual metrics:', newVirtualMetrics);

      setPhysicalMetrics(newPhysicalMetrics);
      setVirtualMetrics(newVirtualMetrics);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      throw err; // Re-throw so handleTimeRangeChange can catch it
    } finally {
      setLoading(false);
    }
  }, [buildFilterCriteria, filterOptions]);

  const handleTimeRangeChange = useCallback(async (range: TimeRange) => {
    console.log('handleTimeRangeChange called with:', range);
    console.log('Previous selectedTimeRange was:', selectedTimeRange);

    try {
      // Try to load data with new time range first
      console.log('Attempting to load data with new timeRange:', range);
      await loadDataWithTimeRange(range);

      // Only update state if API call succeeded
      console.log('API call succeeded, updating selectedTimeRange to:', range);
      setSelectedTimeRange(range);
    } catch (error) {
      console.error('Failed to load data for timeRange:', range, error);
      // Keep the old selectedTimeRange state, don't update UI
    }
  }, [selectedTimeRange, loadDataWithTimeRange]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleContainerTypeClick = useCallback((type: 'physical' | 'virtual') => {
    if (selectedContainerType === type) {
      setSelectedContainerType(null);
    } else {
      setSelectedContainerType(type);
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [selectedContainerType]);

  const handleRowAction = useCallback((/* container: Container, action: string */) => {
    // Handle row actions (view, edit, shutdown)
  }, []);

  const handleCreateContainer = useCallback(() => {
    setCreatePanelOpen(true);
  }, []);

  const handleCreatePanelClose = useCallback(() => {
    setCreatePanelOpen(false);
  }, []);

  const handleContainerCreated = useCallback((/* container: any */) => {
    loadData();
  }, [loadData]);

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
            await loadData();
          }
        }
      }
    } catch (error) {
      console.error('Error validating container state:', error);
    }
  }, [containers, loadData]);

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
        setTimeout(() => loadData(), 1000); // Small delay to allow backend to process
      }

      // Validate backend synchronization after a brief delay
      setTimeout(() => validateContainerState(updatedContainer.id), 2000);

    } catch (error) {
      console.error('Error updating container in local state:', error);
      // Fallback: reload data to ensure consistency
      await loadData();
    }
  }, [containers, loadData, validateContainerState]);

  const handleSort = useCallback((field: SortField) => {
    setSortConfig((prevConfig: SortConfig) => ({
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
          <div style={{ margin: '10px 0', padding: '5px', background: '#eee', fontSize: '12px' }}>
            Debug - Time Range: {selectedTimeRange} |
            Physical Count: {physicalMetrics?.containerCount || 'N/A'} |
            Virtual Count: {virtualMetrics?.containerCount || 'N/A'}
          </div>
          {physicalMetrics && (
            <Box flex={1} onClick={() => handleContainerTypeClick('physical')} sx={{ cursor: 'pointer' }}>
              <ContainerStatistics
                key={`physical-${selectedTimeRange}-${physicalMetrics.containerCount}`}
                title="Physical Containers"
                containerCount={physicalMetrics.containerCount}
                yieldData={physicalMetrics.yieldData}
                spaceUtilization={physicalMetrics.spaceUtilization}
              />
            </Box>
          )}
          {virtualMetrics && (
            <Box flex={1} onClick={() => handleContainerTypeClick('virtual')} sx={{ cursor: 'pointer' }}>
              <ContainerStatistics
                key={`virtual-${selectedTimeRange}-${virtualMetrics.containerCount}`}
                title="Virtual Containers"
                containerCount={virtualMetrics.containerCount}
                yieldData={virtualMetrics.yieldData}
                spaceUtilization={virtualMetrics.spaceUtilization}
              />
            </Box>
          )}
        </StatisticsSection>

        <ContainerListSection>
          <ContainerListHeader>
            <ContainerListTitle>Container List</ContainerListTitle>
            <CreateContainerButton onClick={handleCreateContainer} />
          </ContainerListHeader>

          <ContainerTable
            containers={containers}
            onRowAction={handleRowAction}
            onContainerUpdated={handleContainerUpdated}
            sortConfig={sortConfig}
            onSort={handleSort}
          />

          {lastUpdatedContainer && (
            <Box
              sx={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                backgroundColor: colors.status.success,
                color: colors.background.primary,
                padding: '12px 24px',
                borderRadius: '8px',
                boxShadow: colors.shadow.medium,
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
          />
        </ContainerListSection>
      </ContentContainer>

      <CreateContainerPanel
        open={createPanelOpen}
        onClose={handleCreatePanelClose}
        onSuccess={handleContainerCreated}
      />
    </DashboardContainer>
  );
};

export default ContainerDashboardPage;