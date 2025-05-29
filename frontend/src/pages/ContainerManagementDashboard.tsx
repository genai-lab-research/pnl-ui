import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SearchAndFiltersBlock,
  TimePeriodSelector,
  ContainerStatisticsCard,
  ContainerTable,
  Pagination,
  Button
} from '../shared/components/ui';
import ControlPanelHeader from '../shared/components/ui/ControlPanelHeader';
import CreateContainerPage from './CreateContainerPage';
import containerService from '../services/containerService';
import metricsService from '../services/metricsService';
import { ContainerSummary, ContainerFilterParams, ContainerType, ContainerStatus } from '../shared/types/containers';
import { PerformanceOverview, MetricTimeRange } from '../shared/types/metrics';

interface FilterState {
  search: string;
  type: string;
  tenant: string;
  purpose: string;
  status: string;
  hasAlerts: boolean;
}

const ContainerManagementDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [containers, setContainers] = useState<ContainerSummary[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContainers, setTotalContainers] = useState(0);
  const [timePeriod, setTimePeriod] = useState<MetricTimeRange>('WEEK');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'All types',
    tenant: 'All tenants',
    purpose: 'All purposes',
    status: 'All statuses',
    hasAlerts: false
  });
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build filter params for API
      const filterParams: ContainerFilterParams = {
        skip: (currentPage - 1) * 10,
        limit: 10,
      };
      
      if (filters.search && filters.search.trim()) filterParams.name = filters.search;
      if (filters.type !== 'All types') filterParams.type = filters.type as ContainerType;
      if (filters.tenant !== 'All tenants') filterParams.tenant_id = filters.tenant;
      if (filters.purpose !== 'All purposes') filterParams.purpose = filters.purpose;
      if (filters.status !== 'All statuses') filterParams.status = filters.status as ContainerStatus;
      if (filters.hasAlerts) filterParams.has_alerts = true;
      
      // Fetch containers with filters
      const containerResponse = await containerService.getContainersList(filterParams);
      setContainers(containerResponse.results);
      setTotalContainers(containerResponse.total);

      // Fetch performance metrics for the time period
      const metricsResponse = await metricsService.getPerformanceOverview(timePeriod);
      setPerformanceMetrics(metricsResponse);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [currentPage, timePeriod, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (value: string, filterId: string) => {
    setFilters(prev => ({ 
      ...prev, 
      [filterId]: filterId === 'hasAlerts' ? value === 'true' : value 
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: 'All types',
      tenant: 'All tenants',
      purpose: 'All purposes',
      status: 'All statuses',
      hasAlerts: false
    });
    setCurrentPage(1);
  };

  const handleCreateContainer = () => {
    setIsCreateDrawerOpen(true);
  };

  const handleCloseCreateDrawer = () => {
    setIsCreateDrawerOpen(false);
  };

  const handleContainerCreated = () => {
    setIsCreateDrawerOpen(false);
    // Refresh containers list
    fetchData();
  };

  const handleContainerClick = (containerId: string) => {
    navigate(`/containers/${containerId}`);
  };

  if (loading && containers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ControlPanelHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-900">Container Managements</h1>
        
        {/* Search and Filters */}
        <SearchAndFiltersBlock
          searchValue={filters.search}
          onSearchChange={(value) => handleFilterChange(value, 'search')}
          filterValues={{
            type: filters.type,
            tenant: filters.tenant,
            purpose: filters.purpose,
            status: filters.status
          }}
          onFilterChange={handleFilterChange}
          hasAlerts={filters.hasAlerts}
          onHasAlertsChange={(_, checked) => handleFilterChange(checked.toString(), 'hasAlerts')}
          onClearFilters={handleClearFilters}
        />

        {/* Time Period Selector */}
        <TimePeriodSelector
          value={timePeriod.toLowerCase() as 'week' | 'month' | 'quarter' | 'year'}
          onChange={(value: 'week' | 'month' | 'quarter' | 'year') => 
            setTimePeriod(value.toUpperCase() as MetricTimeRange)
          }
        />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContainerStatisticsCard
            title="Physical Containers"
            totalCount={performanceMetrics?.physical.count || 4}
            yieldData={performanceMetrics?.physical.yield.data.map((value, index) => ({
              day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun',
              value
            })) || [
              { day: 'Mon', value: 20 },
              { day: 'Tue', value: 25 },
              { day: 'Wed', value: 30 },
              { day: 'Thu', value: 25 },
              { day: 'Fri', value: 35 },
              { day: 'Sat', value: 28 },
              { day: 'Sun', value: 32 }
            ]}
            utilizationData={performanceMetrics?.physical.spaceUtilization.data.map((value, index) => ({
              day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun',
              value
            })) || [
              { day: 'Mon', value: 75 },
              { day: 'Tue', value: 80 },
              { day: 'Wed', value: 85 },
              { day: 'Thu', value: 78 },
              { day: 'Fri', value: 82 },
              { day: 'Sat', value: 80 },
              { day: 'Sun', value: 85 }
            ]}
            avgYield={`${performanceMetrics?.physical.yield.avgYield || 63}KG`}
            totalYield={`${performanceMetrics?.physical.yield.totalYield || 81}KG`}
            avgUtilization={`${performanceMetrics?.physical.spaceUtilization.avgUtilization || 80}%`}
          />
          <ContainerStatisticsCard
            title="Virtual Containers"
            totalCount={performanceMetrics?.virtual.count || 5}
            yieldData={performanceMetrics?.virtual.yield.data.map((value, index) => ({
              day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun',
              value
            })) || [
              { day: 'Mon', value: 22 },
              { day: 'Tue', value: 28 },
              { day: 'Wed', value: 25 },
              { day: 'Thu', value: 30 },
              { day: 'Fri', value: 33 },
              { day: 'Sat', value: 29 },
              { day: 'Sun', value: 31 }
            ]}
            utilizationData={performanceMetrics?.virtual.spaceUtilization.data.map((value, index) => ({
              day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun',
              value
            })) || [
              { day: 'Mon', value: 78 },
              { day: 'Tue', value: 82 },
              { day: 'Wed', value: 80 },
              { day: 'Thu', value: 85 },
              { day: 'Fri', value: 88 },
              { day: 'Sat', value: 83 },
              { day: 'Sun', value: 86 }
            ]}
            avgYield={`${performanceMetrics?.virtual.yield.avgYield || 63}KG`}
            totalYield={`${performanceMetrics?.virtual.yield.totalYield || 81}KG`}
            avgUtilization={`${performanceMetrics?.virtual.spaceUtilization.avgUtilization || 80}%`}
          />
        </div>

        {/* Containers List Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-1 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Containers List</h2>
            <Button
              variant="contained"
              color="primary"
              withPlusIcon
              size="medium"
              onClick={handleCreateContainer}
              className="flex items-center gap-2"
            >
              Create Container
            </Button>
          </div>

          {/* Table */}
          <ContainerTable
            rows={containers.map(container => ({
              id: container.id.toString(),
              type: container.type === 'PHYSICAL' ? 'farm-container' : 'virtual-farm',
              name: container.name,
              tenant: container.tenant_name,
              purpose: container.purpose,
              location: container.location_city ? `${container.location_city}, ${container.location_country}` : 'Unknown',
              status: container.status === 'ACTIVE' ? 'Connected' : 
                      container.status === 'MAINTENANCE' ? 'Maintenance' :
                      container.status === 'CREATED' ? 'Created' : 'Inactive',
              created: new Date(container.created_at).toLocaleDateString(),
              modified: new Date(container.updated_at).toLocaleDateString(),
              hasAlerts: container.has_alerts
            }))}
            onRowClick={(row) => {
              if (row.id) {
                handleContainerClick(row.id);
              }
            }}
          />

          {/* Pagination */}
          {Math.ceil(totalContainers / 10) > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                page={currentPage}
                totalPages={Math.ceil(totalContainers / 10)}
                onPageChange={setCurrentPage}
                showingText={`Showing page`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Create Container Drawer */}
      <CreateContainerPage
        open={isCreateDrawerOpen}
        onClose={handleCloseCreateDrawer}
        onSubmit={handleContainerCreated}
      />
    </div>
  );
};

export default ContainerManagementDashboard;