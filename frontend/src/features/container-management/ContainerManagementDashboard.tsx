import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, Typography } from '@mui/material';

import containerService, { ContainerFilterParams, ContainerStats } from '../../services/containerService';
import performanceService from '../../services/performanceService';
import tenantService from '../../services/tenantService';

import { CreateContainerButton } from '../../shared/components/ui/Button';
import HeaderContainer from '../../shared/components/ui/Container/HeaderContainer';
import { DataTable } from '../../shared/components/ui/Table/DataTable';
import { RowData } from '../../shared/types/containers';
import { MetricTimeRange } from '../../shared/types/metrics';
import { ContainerType, ContainerStatus } from '../../shared/types/containers';

import { formattedContainerList } from './constants/mockData';
import FilterSection from './sections/FilterSection';
import PerformanceCard from './components/PerformanceCard';
import TimeRangeSelector, { TimeRangeOption } from './sections/TimeRangeSelector';


import { mapChartDataByRange } from '../../shared/utils/metrics';

const mockUser = {
  avatarUrl: null,
  name: 'Admin User',
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB').replace(/\//g, '/');
};

interface FormattedMetrics {
  yieldData: { day: string; value: number }[];
  utilizationData: { day: string; value: number }[];
  averageYield: number;
  totalYield: number;
  averageUtilization: number;
}

export const ContainerManagementDashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('week');
  const [searchValue, setSearchValue] = useState('');
  const [containerType, setContainerType] = useState<string>('all');
  const [tenant, setTenant] = useState('all');
  const [purpose, setPurpose] = useState('all');
  const [status, setStatus] = useState<string>('all');
  const [hasAlerts, setHasAlerts] = useState(false);

  const [tenants, setTenants] = useState<{ id: string; name: string }[]>([]);
  const [containerStats, setContainerStats] = useState<ContainerStats>({ physical_count: 0, virtual_count: 0 });
  const [containers, setContainers] = useState<RowData[]>([]);

  const [paginationInfo, setPaginationInfo] = useState({ currentPage: 0, pageSize: 10, totalItems: 0 });

  const [physicalMetrics, setPhysicalMetrics] = useState<FormattedMetrics | null>(null);
  const [virtualMetrics, setVirtualMetrics] = useState<FormattedMetrics | null>(null);

  const [loading, setLoading] = useState({ containers: false, stats: false, metrics: false });
  const [error, setError] = useState({ containers: null, stats: null, metrics: null });

  const navigate = useNavigate();

  useEffect(() => {
    const loadContainers = async () => {
      try {
        setLoading((prev) => ({ ...prev, containers: true }));

        const filterParams: ContainerFilterParams = {
          skip: paginationInfo.currentPage * paginationInfo.pageSize,
          limit: paginationInfo.pageSize,
          name: searchValue || undefined,
          type: containerType !== 'all' ? containerType.toUpperCase() as ContainerType : undefined,
          tenant_id: tenant !== 'all' ? tenant : undefined,
          purpose: purpose !== 'all' ? purpose : undefined,
          status: status !== 'all' ? status.toUpperCase() as ContainerStatus : undefined,
          has_alerts: hasAlerts || undefined,
        };

        try {
          const response = await containerService.getContainers(filterParams);
          const formattedRows: RowData[] = response.results.map((container) => ({
            id: container.id,
            type: container.type,
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

          setContainers(formattedRows);
          setPaginationInfo((prev) => ({ ...prev, totalItems: response.total }));
        } catch {
          setContainers(formattedContainerList);
          setPaginationInfo((prev) => ({ ...prev, totalItems: formattedContainerList.length }));
        }

        setLoading((prev) => ({ ...prev, containers: false }));
      } catch (err: any) {
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

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading((prev) => ({ ...prev, stats: true }));
        const stats = await containerService.getContainerStats();
        setContainerStats(stats);
      } catch {
        setContainerStats({ physical_count: 4, virtual_count: 5 });
      } finally {
        setLoading((prev) => ({ ...prev, stats: false }));
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    const loadPerformance = async () => {
      try {
        setLoading((prev) => ({ ...prev, metrics: true }));
        const apiRange = timeRange.toUpperCase() as MetricTimeRange;
        const data = await performanceService.getPerformanceOverview(apiRange);

        const physical = data.physical;
        const virtual = data.virtual;

        setPhysicalMetrics({
          yieldData: mapChartDataByRange(
            physical.yield.labels.map((label, i) => ({
              date: label,
              value: physical.yield.data[i],
            })),
            timeRange
          ),
          utilizationData: mapChartDataByRange(
            physical.spaceUtilization.labels.map((label, i) => ({
              date: label,
              value: physical.spaceUtilization.data[i],
            })),
            timeRange
          ),
          averageYield: physical.yield.avgYield,
          totalYield: physical.yield.totalYield,
          averageUtilization: physical.spaceUtilization.avgUtilization,
        });

        setVirtualMetrics({
          yieldData: mapChartDataByRange(
            virtual.yield.labels.map((label, i) => ({
              date: label,
              value: virtual.yield.data[i],
            })),
            timeRange
          ),
          utilizationData: mapChartDataByRange(
            virtual.spaceUtilization.labels.map((label, i) => ({
              date: label,
              value: virtual.spaceUtilization.data[i],
            })),
            timeRange
          ),
          averageYield: virtual.yield.avgYield,
          totalYield: virtual.yield.totalYield,
          averageUtilization: virtual.spaceUtilization.avgUtilization,
        });

        setLoading((prev) => ({ ...prev, metrics: false }));
      } catch {
        setLoading((prev) => ({ ...prev, metrics: false }));
      }
    };

    loadPerformance();
  }, [timeRange]);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await tenantService.getTenants();
        if (res?.results) setTenants(res.results);
      } catch {
        setTenants([]);
      }
    };
    fetchTenants();
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setPaginationInfo((prev) => ({ ...prev, currentPage: 0 }));
  };

  const handleClearFilters = () => {
    setSearchValue('');
    setContainerType('all');
    setTenant('all');
    setPurpose('all');
    setStatus('all');
    setHasAlerts(false);
    setPaginationInfo((prev) => ({ ...prev, currentPage: 0 }));
  };

  const handlePageChange = (page: number) => {
    setPaginationInfo((prev) => ({ ...prev, currentPage: page }));
  };

  const containerColumns = [
    { id: 'type', label: 'TYPE' },
    { id: 'name', label: 'NAME' },
    { id: 'tenant', label: 'TENANT' },
    { id: 'purpose', label: 'PURPOSE' },
    { id: 'location', label: 'LOCATION' },
    { id: 'status', label: 'STATUS' },
    { id: 'created', label: 'CREATED' },
    { id: 'modified', label: 'MODIFIED' },
    { id: 'alerts', label: 'ALERTS' },
    { id: 'actions', label: 'ACTIONS' },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <HeaderContainer title="Control Panel" avatarUrl={mockUser.avatarUrl} userName={mockUser.name} withDivider />
      <Container sx={{ py: 3, maxWidth: '1400px', mx: 'auto' }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Container Managements
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
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

        <Box mb={2}>
          <TimeRangeSelector selectedRange={timeRange} onRangeChange={setTimeRange} />
        </Box>

        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} mb={3}>
          <PerformanceCard
            title="Physical Containers"
            count={containerStats.physical_count}
            yieldData={physicalMetrics?.yieldData || []}
            utilizationData={physicalMetrics?.utilizationData || []}
            averageYield={physicalMetrics?.averageYield || 0}
            totalYield={physicalMetrics?.totalYield || 0}
            averageUtilization={physicalMetrics?.averageUtilization || 0}
            timeRange={timeRange}
          />
          <PerformanceCard
            title="Virtual Containers"
            count={containerStats.virtual_count}
            yieldData={virtualMetrics?.yieldData || []}
            utilizationData={virtualMetrics?.utilizationData || []}
            averageYield={virtualMetrics?.averageYield || 0}
            totalYield={virtualMetrics?.totalYield || 0}
            averageUtilization={virtualMetrics?.averageUtilization || 0}
            timeRange={timeRange}
          />
        </Box>

        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Containers List</Typography>
            <CreateContainerButton />
          </Box>

          {loading.containers ? (
            <Typography>Loading...</Typography>
          ) : error.containers ? (
            <Typography color="error">{error.containers}</Typography>
          ) : (
            <DataTable
              columns={containerColumns}
              rows={containers}
              onRowClick={(row) => navigate(`/containers/${row.id}`)}
              onActionClick={() => {}}
            />
          )}
        </Box>

        {!loading.containers && !error.containers && paginationInfo.totalItems > 0 && (
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">
              Page {paginationInfo.currentPage + 1} of{' '}
              {Math.ceil(paginationInfo.totalItems / paginationInfo.pageSize)}
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                disabled={paginationInfo.currentPage === 0}
                onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                disabled={
                  paginationInfo.currentPage >=
                  Math.ceil(paginationInfo.totalItems / paginationInfo.pageSize) - 1
                }
                onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ContainerManagementDashboard;
