import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';

// Import services
import containerService, {
  ContainerFilterParams,
  ContainerList,
  ContainerStats,
} from '../../services/containerService';
import metricsService, { MetricResponse } from '../../services/metricsService';
import performanceService, { PerformanceResponse } from '../../services/performanceService';
import tenantService, { TenantList } from '../../services/tenantService';
import { CreateContainerButton } from '../../shared/components/ui/Button';
import HeaderContainer from '../../shared/components/ui/Container/HeaderContainer';
import { DataTable } from '../../shared/components/ui/Table/DataTable';
import { RowData } from '../../shared/types/containers';
// Import types
import { MetricTimeRange } from '../../shared/types/metrics';
// Import mock data as fallback
import { formattedContainerList } from '../containers/mockData';
import FilterSection from './FilterSection';
import PerformanceCard from './PerformanceCard';
import TimeRangeSelector, { TimeRangeOption } from './TimeRangeSelector';

// Mock user data - would typically come from auth context
const mockUser = {
  avatarUrl: null,
  name: 'Admin User',
};

// Helper function to format dates from API to DD/MM/YYYY format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '/');
};

export interface ContainerManagementDashboardProps {
  /**
   * Optional custom class name
   */
  className?: string;
}

export const ContainerManagementDashboard: React.FC<ContainerManagementDashboardProps> = ({
  className,
}) => {
  // State for current time range
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('week');

  // Filter states
  const [searchValue, setSearchValue] = useState('');
  const [containerType, setContainerType] = useState('all');
  const [tenant, setTenant] = useState('all');
  const [purpose, setPurpose] = useState('all');
  const [status, setStatus] = useState('all');
  const [hasAlerts, setHasAlerts] = useState(false);

  // Tenant options for dropdown
  const [tenants, setTenants] = useState<{ id: string; name: string }[]>([]);

  // Add container stats state
  const [containerStats, setContainerStats] = useState<ContainerStats>({
    physical_count: 0,
    virtual_count: 0,
  });

  // Container list state
  const [containers, setContainers] = useState<RowData[]>([]);

  // Data states - for pagination
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 0,
    pageSize: 10,
    totalItems: 0,
  });

  // State for physical and virtual container metrics
  const [physicalMetrics, setPhysicalMetrics] = useState<MetricResponse | null>(null);
  const [virtualMetrics, setVirtualMetrics] = useState<MetricResponse | null>(null);

  // State for loading indicators
  const [loading, setLoading] = useState({
    containers: false,
    stats: false,
    metrics: false,
  });

  // State for error messages
  const [error, setError] = useState({
    containers: null as string | null,
    stats: null as string | null,
    metrics: null as string | null,
  });

  // Load container data on component mount and filter changes
  useEffect(() => {
    const loadContainers = async () => {
      try {
        setLoading((prev) => ({ ...prev, containers: true }));
        setError((prev) => ({ ...prev, containers: null }));

        // Build filter params from state
        const filterParams: ContainerFilterParams = {
          skip: paginationInfo.currentPage * paginationInfo.pageSize,
          limit: paginationInfo.pageSize,
          name: searchValue || undefined,
          type: containerType !== 'all' ? (containerType.toUpperCase() as any) : undefined,
          tenant_id: tenant !== 'all' ? tenant : undefined,
          purpose: purpose !== 'all' ? purpose : undefined,
          status: status !== 'all' ? (status.toUpperCase() as any) : undefined,
          has_alerts: hasAlerts || undefined,
        };

        try {
          // Get containers from API
          const response = await containerService.getContainers(filterParams);

          // Convert the API response to the format expected by the DataTable component
          const formattedRows: RowData[] = response.results.map((container) => ({
            id: container.id,
            type: container.type === 'PHYSICAL' ? 'Physical' : 'Virtual',
            name: container.name,
            tenant: container.tenant_name,
            purpose: container.purpose,
            location:
              container.location_city && container.location_country
                ? `${container.location_city}, ${container.location_country}`
                : 'N/A',
            status: container.status,
            created: formatDate(container.created_at),
            modified: formatDate(container.updated_at),
            alerts: container.has_alerts ? 1 : 0,
          }));

          console.log(response.results);
          setContainers(formattedRows);
          setPaginationInfo((prev) => ({ ...prev, totalItems: response.total }));
        } catch (apiError) {
          console.error('API error:', apiError);
          // Fall back to mock data if API request fails
          console.warn('Falling back to mock data');
          setContainers(formattedContainerList);
          setPaginationInfo((prev) => ({ ...prev, totalItems: formattedContainerList.length }));
        }

        setLoading((prev) => ({ ...prev, containers: false }));
      } catch (err: any) {
        console.error('Error loading containers:', err);
        setError((prev) => ({ ...prev, containers: err.message || 'Failed to load containers' }));
        setLoading((prev) => ({ ...prev, containers: false }));
      }
    };

    loadContainers();
  }, [
    searchValue,
    containerType,
    tenant,
    purpose,
    status,
    hasAlerts,
    paginationInfo.currentPage,
    paginationInfo.pageSize,
  ]);

  // Load container stats on component mount
  useEffect(() => {
    const loadContainerStats = async () => {
      try {
        setLoading((prev) => ({ ...prev, stats: true }));
        setError((prev) => ({ ...prev, stats: null }));

        try {
          // Get container stats from API
          const stats = await containerService.getContainerStats();
          setContainerStats(stats);
        } catch (apiError) {
          console.error('API error loading container stats:', apiError);
          // Fall back to default stats
          console.warn('Falling back to default container stats');
          setContainerStats({
            physical_count: 4, // Make sure this is 4, as per design
            virtual_count: 5,
          });
        }

        setLoading((prev) => ({ ...prev, stats: false }));
      } catch (err: any) {
        console.error('Error loading container stats:', err);
        setError((prev) => ({ ...prev, stats: err.message || 'Failed to load container stats' }));
        setLoading((prev) => ({ ...prev, stats: false }));
      }
    };

    loadContainerStats();
  }, []);

  // Load performance metrics when time range changes
  useEffect(() => {
    const loadPerformanceMetrics = async () => {
      try {
        setLoading((prev) => ({ ...prev, metrics: true }));
        setError((prev) => ({ ...prev, metrics: null }));

        try {
          // Get performance metrics from API
          const apiTimeRange = timeRange.toUpperCase() as MetricTimeRange;
          const performanceData = await performanceService.getPerformanceOverview(apiTimeRange);

          // Map performance data to physical metrics
          const physicalMetricsData: MetricResponse = {
            yield_data: performanceData.physical.yield.labels.map((label, index) => ({
              date: label,
              value: performanceData.physical.yield.data[index],
            })),
            // Ensure all days of the week are included in space utilization
            space_utilization_data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const index = performanceData.physical.spaceUtilization.labels.findIndex((label) =>
                label.startsWith(day),
              );
              return {
                date: day,
                value: index !== -1 ? performanceData.physical.spaceUtilization.data[index] : 0,
              };
            }),
            average_yield: performanceData.physical.yield.avgYield,
            total_yield: performanceData.physical.yield.totalYield,
            average_space_utilization: performanceData.physical.spaceUtilization.avgUtilization,
            current_temperature: 0, // Not used in this component
            current_humidity: 0, // Not used in this component
            current_co2: 0, // Not used in this component
            crop_counts: {
              seeded: 0,
              transplanted: 0,
              harvested: 0,
            },
            is_daily: true,
          };

          // Map performance data to virtual metrics
          const virtualMetricsData: MetricResponse = {
            yield_data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const index = performanceData.virtual.yield.labels.findIndex((label) =>
                label.startsWith(day),
              );
              return {
                date: day,
                value: index !== -1 ? performanceData.virtual.yield.data[index] : 0,
              };
            }),
            space_utilization_data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const index = performanceData.virtual.spaceUtilization.labels.findIndex((label) =>
                label.startsWith(day),
              );
              return {
                date: day,
                value: index !== -1 ? performanceData.virtual.spaceUtilization.data[index] : 0,
              };
            }),
            average_yield: performanceData.virtual.yield.avgYield,
            total_yield: performanceData.virtual.yield.totalYield,
            average_space_utilization: performanceData.virtual.spaceUtilization.avgUtilization,
            current_temperature: 0, // Not used in this component
            current_humidity: 0, // Not used in this component
            current_co2: 0, // Not used in this component
            crop_counts: {
              seeded: 0,
              transplanted: 0,
              harvested: 0,
            },
            is_daily: true,
          };

          setPhysicalMetrics(physicalMetricsData);
          setVirtualMetrics(virtualMetricsData);
        } catch (apiError) {
          console.error('API error loading metrics:', apiError);
          // Fall back to mock data
          console.warn('Falling back to mock metrics data');
          // Metrics will remain as initialized
        }

        setLoading((prev) => ({ ...prev, metrics: false }));
      } catch (err: any) {
        console.error('Error loading metrics:', err);
        setError((prev) => ({ ...prev, metrics: err.message || 'Failed to load metrics' }));
        setLoading((prev) => ({ ...prev, metrics: false }));
      }
    };

    loadPerformanceMetrics();
  }, [timeRange]);

  // Load tenants for dropdown
  useEffect(() => {
    const loadTenants = async () => {
      try {
        // Try to get tenants from API
        const response = await tenantService.getTenants();
        if (response && response.results) {
          setTenants(response.results);
        }
      } catch (error) {
        console.error('Error loading tenants:', error);
        // Use empty tenant list
        setTenants([]);
      }
    };

    loadTenants();
  }, []);

  // Handler for search submission
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setPaginationInfo((prev) => ({ ...prev, currentPage: 0 })); // Reset to first page on search
  };

  // Handler to clear all filters
  const handleClearFilters = () => {
    setSearchValue('');
    setContainerType('all');
    setTenant('all');
    setPurpose('all');
    setStatus('all');
    setHasAlerts(false);
    setPaginationInfo((prev) => ({ ...prev, currentPage: 0 })); // Reset to first page
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPaginationInfo((prev) => ({ ...prev, currentPage: newPage }));
  };

  // Container list table columns
  const containerColumns = [
    { id: 'type', label: 'TYPE', width: '60px' },
    { id: 'name', label: 'NAME', width: 'auto' },
    { id: 'tenant', label: 'TENANT', width: '130px' },
    { id: 'purpose', label: 'PURPOSE', width: '130px' },
    { id: 'location', label: 'LOCATION', width: '180px' },
    { id: 'status', label: 'STATUS', width: '120px' },
    { id: 'created', label: 'CREATED', width: '120px' },
    { id: 'modified', label: 'MODIFIED', width: '120px' },
    { id: 'alerts', label: 'ALERTS', width: '80px' },
    { id: 'actions', label: 'ACTIONS', width: '60px' },
  ];

  // Handler for row click (view container details)
  const navigate = useNavigate();

  const handleRowClick = (row: any) => {
    console.log('Row clicked:', row);
    navigate(`/containers/${row.id}`);
  };

  // Handler for row action menu
  const handleActionClick = (row: any) => {
    console.log('Action clicked for row:', row);
    // Show action menu
  };

  // Handler for container creation
  const handleCreateContainer = () => {
    console.log('Create container clicked');
    // The CreateContainerButton component handles opening the modal automatically
  };

  // Handler for container creation success
  const handleContainerCreated = () => {
    // Refresh the container list after a new container is created
    const filters: Record<string, any> = {
      limit: 10,
      skip: 0,
    };
    setApiFilters(filters);
  };

  return (
    <Box
      className={className}
      sx={{ width: '100%', bgcolor: 'background.default', minHeight: '100vh' }}
    >
      {/* Header */}
      <HeaderContainer
        title="Control Panel"
        avatarUrl={mockUser.avatarUrl}
        userName={mockUser.name}
        withDivider={true}
        sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: 'background.paper' }}
      />

      {/* Main Content */}
      <Container
        maxWidth={false}
        sx={{
          py: { xs: 2, md: 3 },
          px: { xs: 2, sm: 3 },
          minHeight: 'calc(100vh - 64px)', // Adjust for header height
          maxWidth: '1400px',
          mx: 'auto',
        }}
      >
        {/* Title Section */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: { xs: 2, md: 3 },
            color: 'text.primary',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            ml: 1,
          }}
        >
          Container Managements
        </Typography>

        {/* Search & Filter Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: '#FFFFFF',
          }}
        >
          <FilterSection
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearch={handleSearch}
            containerType={containerType}
            onContainerTypeChange={setContainerType}
            tenant={tenant}
            onTenantChange={setTenant}
            tenantOptions={tenants}
            purpose={purpose}
            onPurposeChange={setPurpose}
            status={status}
            onStatusChange={setStatus}
            hasAlerts={hasAlerts}
            onHasAlertsChange={setHasAlerts}
            onClearFilters={handleClearFilters}
          />
        </Paper>

        {/* Time Range Selection */}
        <Box sx={{ mb: 2 }}>
          <TimeRangeSelector selectedRange={timeRange} onRangeChange={setTimeRange} />
        </Box>

        {/* Performance Overview Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            mb: 3,
            width: '100%',
            gap: 2,
          }}
        >
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <PerformanceCard
              title="Physical Containers"
              count={containerStats.physical_count}
              yieldData={
                physicalMetrics?.yield_data.map((d) => {
                  let day;
                  // Format the day label based on time range
                  if (timeRange === 'week') {
                    day = d.date.substring(0, 3); // Mon, Tue, etc.
                  } else if (timeRange === 'month') {
                    day = d.date.includes('Day')
                      ? d.date.substring(4)
                      : new Date(d.date).getDate().toString();
                  } else if (timeRange === 'quarter') {
                    day = d.date.startsWith('Week') ? d.date.substring(5) : d.date.substring(0, 3); // Week number or day
                  } else if (timeRange === 'year') {
                    day = d.date.length <= 3 ? d.date : d.date.substring(0, 3); // Jan, Feb, etc.
                  } else {
                    day = d.date.substring(0, 3);
                  }
                  return { day, value: d.value as number };
                }) || []
              }
              utilizationData={
                physicalMetrics?.space_utilization_data.map((d) => {
                  let day;
                  // Format the day label based on time range
                  if (timeRange === 'week') {
                    day = d.date.substring(0, 3); // Mon, Tue, etc.
                  } else if (timeRange === 'month') {
                    day = d.date.includes('Day')
                      ? d.date.substring(4)
                      : new Date(d.date).getDate().toString();
                  } else if (timeRange === 'quarter') {
                    day = d.date.startsWith('Week') ? d.date.substring(5) : d.date.substring(0, 3); // Week number or day
                  } else if (timeRange === 'year') {
                    day = d.date.length <= 3 ? d.date : d.date.substring(0, 3); // Jan, Feb, etc.
                  } else {
                    day = d.date.substring(0, 3);
                  }
                  return { day, value: d.value as number };
                }) || []
              }
              averageYield={physicalMetrics?.average_yield || 0}
              totalYield={physicalMetrics?.total_yield || 0}
              averageUtilization={physicalMetrics?.average_space_utilization || 0}
              timeRange={timeRange}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <PerformanceCard
              title="Virtual Containers"
              count={containerStats.virtual_count}
              yieldData={
                virtualMetrics?.yield_data.map((d) => {
                  let day;
                  // Format the day label based on time range
                  if (timeRange === 'week') {
                    day = d.date.substring(0, 3); // Mon, Tue, etc.
                  } else if (timeRange === 'month') {
                    day = d.date.includes('Day')
                      ? d.date.substring(4)
                      : new Date(d.date).getDate().toString();
                  } else if (timeRange === 'quarter') {
                    day = d.date.startsWith('Week') ? d.date.substring(5) : d.date.substring(0, 3); // Week number or day
                  } else if (timeRange === 'year') {
                    day = d.date.length <= 3 ? d.date : d.date.substring(0, 3); // Jan, Feb, etc.
                  } else {
                    day = d.date.substring(0, 3);
                  }
                  return { day, value: d.value as number };
                }) || []
              }
              utilizationData={
                virtualMetrics?.space_utilization_data.map((d) => {
                  let day;
                  // Format the day label based on time range
                  if (timeRange === 'week') {
                    day = d.date.substring(0, 3); // Mon, Tue, etc.
                  } else if (timeRange === 'month') {
                    day = d.date.includes('Day')
                      ? d.date.substring(4)
                      : new Date(d.date).getDate().toString();
                  } else if (timeRange === 'quarter') {
                    day = d.date.startsWith('Week') ? d.date.substring(5) : d.date.substring(0, 3); // Week number or day
                  } else if (timeRange === 'year') {
                    day = d.date.length <= 3 ? d.date : d.date.substring(0, 3); // Jan, Feb, etc.
                  } else {
                    day = d.date.substring(0, 3);
                  }
                  return { day, value: d.value as number };
                }) || []
              }
              averageYield={virtualMetrics?.average_yield || 0}
              totalYield={virtualMetrics?.total_yield || 0}
              averageUtilization={virtualMetrics?.average_space_utilization || 0}
              timeRange={timeRange}
            />
          </Box>
        </Box>

        {/* Container List Section */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2,
              alignItems: 'center',
              ml: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" fontWeight={500}>
                Containers List
              </Typography>
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate('/containers')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  p: 0,
                  minWidth: 'auto',
                }}
              >
                View All
              </Button>
            </Box>
            <CreateContainerButton
              onClick={handleCreateContainer}
              onContainerCreated={handleContainerCreated}
            />
          </Box>

          {loading.containers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography>Loading containers...</Typography>
            </Box>
          ) : error.containers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, color: 'error.main' }}>
              <Typography>{error.containers}</Typography>
            </Box>
          ) : (
            <DataTable
              columns={containerColumns}
              rows={containers}
              onRowClick={handleRowClick}
              onActionClick={handleActionClick}
            />
          )}
        </Box>

        {/* Pagination Section */}
        {!loading.containers && !error.containers && paginationInfo.totalItems > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              mx: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing page {paginationInfo.currentPage + 1} of{' '}
              {Math.ceil(paginationInfo.totalItems / paginationInfo.pageSize) || 2}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                component="button"
                onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                disabled={paginationInfo.currentPage === 0}
                sx={{
                  border: '1px solid',
                  borderColor: '#E0E0E0',
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  bgcolor: 'background.paper',
                  color: paginationInfo.currentPage === 0 ? '#BDBDBD' : '#757575',
                  cursor: paginationInfo.currentPage === 0 ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': { bgcolor: paginationInfo.currentPage === 0 ? 'initial' : '#F5F5F5' },
                  fontSize: '0.875rem',
                }}
              >
                Previous
              </Box>
              <Box
                component="button"
                onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                disabled={
                  paginationInfo.currentPage >=
                  Math.ceil(paginationInfo.totalItems / paginationInfo.pageSize) - 1
                }
                sx={{
                  border: '1px solid',
                  borderColor: '#E0E0E0',
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  bgcolor: 'background.paper',
                  color:
                    paginationInfo.currentPage >=
                    Math.ceil(paginationInfo.totalItems / paginationInfo.pageSize) - 1
                      ? '#BDBDBD'
                      : '#757575',
                  cursor:
                    paginationInfo.currentPage >=
                    Math.ceil(paginationInfo.totalItems / paginationInfo.pageSize) - 1
                      ? 'default'
                      : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    bgcolor:
                      paginationInfo.currentPage >=
                      Math.ceil(paginationInfo.totalItems / paginationInfo.pageSize) - 1
                        ? 'initial'
                        : '#F5F5F5',
                  },
                  fontSize: '0.875rem',
                }}
              >
                Next
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ContainerManagementDashboard;
