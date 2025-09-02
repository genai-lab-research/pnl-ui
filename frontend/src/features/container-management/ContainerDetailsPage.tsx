import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Breadcrumbs,
  CircularProgress,
  IconButton,
  Link,
  Paper,
  Typography,
} from '@mui/material';

// Import services and types
import containerService, {
  ContainerActivity,
  ContainerCrop,
  ContainerDetail,
  ContainerMetrics,
  TimeRangeOption,
} from '../../services/containerService';
import { ContainerOverviewInfo } from '../../shared/components/ui/Container';
import { StatusChipActive } from '../../shared/components/ui/StatusChip';
// Import components
import { TabGroup } from '../../shared/components/ui/Tab';
import ContainerInfoSection from './sections/ContainerInfoSection';
import CropsSection from './sections/CropsSection';
// Import feature components
import MetricsPanel from './components/MetricsPanel';

// Define tab options
type TabOption = 'overview' | 'environment' | 'inventory' | 'devices';

export interface ContainerDetailsPageProps {
  className?: string;
}

const ContainerDetailsPage: React.FC<ContainerDetailsPageProps> = ({ className }) => {
  // Get container ID from URL params
  const { containerId = '' } = useParams<{ containerId: string }>();
  const navigate = useNavigate();

  // State variables
  const [container, setContainer] = useState<ContainerDetail | null>(null);
  const [metrics, setMetrics] = useState<ContainerMetrics | null>(null);
  const [crops, setCrops] = useState<ContainerCrop[]>([]);
  const [totalCrops, setTotalCrops] = useState<number>(0);
  const [activities, setActivities] = useState<ContainerActivity[]>([]);

  const [activeTab, setActiveTab] = useState<TabOption>('overview');
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('WEEK');
  const [cropsPage, setCropsPage] = useState<number>(0);
  const [cropsPageSize, setCropsPageSize] = useState<number>(10);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs configuration
  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'Environment & Recipes', value: 'environment' },
    { label: 'Inventory', value: 'inventory' },
    { label: 'Devices', value: 'devices' },
  ];

  // Load container details on mount and when containerId changes
  useEffect(() => {
    const fetchContainerData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch container details
        const containerData = await containerService.getContainerDetail(containerId);
        setContainer(containerData);

        // Fetch container metrics with selected time range
        const metricsData = await containerService.getContainerMetrics(containerId, timeRange);
        setMetrics(metricsData);

        // Fetch container crops
        const cropsData = await containerService.getContainerCrops(
          containerId,
          cropsPage,
          cropsPageSize,
        );
        setCrops(cropsData.results);
        setTotalCrops(cropsData.total);

        // Fetch container activities
        const activitiesData = await containerService.getContainerActivities(containerId);
        setActivities(activitiesData.activities);
      } catch (err) {
        console.error('Error fetching container details:', err);
        setError('Failed to load container data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (containerId) {
      fetchContainerData();
    }
  }, [containerId, timeRange, cropsPage, cropsPageSize]);

  // Handle tab change
  const handleTabChange = (value: string | number) => {
    setActiveTab(value as TabOption);
  };

  // Handle time range change for metrics
  const handleTimeRangeChange = async (newRange: TimeRangeOption) => {
    setTimeRange(newRange);
  };

  // Handle crops pagination
  const handleCropsPageChange = (newPage: number) => {
    setCropsPage(newPage);
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !container) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error || 'Container not found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={className} sx={{ p: 3, maxWidth: '100%' }}>
      {/* Header with breadcrumbs and title */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBackClick} aria-label="Back to containers" sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>

          <Breadcrumbs aria-label="breadcrumb">
            <Link component={RouterLink} to="/dashboard" color="inherit" underline="hover">
              Container Dashboard
            </Link>
            <Typography color="text.primary">{container.name}</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* Container title and status */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {container.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {container.type} container | {container.tenant} | {container.purpose}
          </Typography>
          <StatusChipActive label={container.status} />
        </Box>
      </Box>

      {/* Navigation tabs */}
      <TabGroup tabs={tabs} value={activeTab} onChange={handleTabChange} className="mb-4" />

      {/* Tab content */}
      <Box sx={{ mt: 3 }}>
        {activeTab === 'overview' && (
          <Box>
            {/* Metrics panel */}
            {metrics && (
              <MetricsPanel
                metrics={metrics}
                timeRange={timeRange}
                onTimeRangeChange={handleTimeRangeChange}
              />
            )}

            {/* Crops section */}
            <CropsSection
              crops={crops}
              totalCrops={totalCrops}
              page={cropsPage}
              pageSize={cropsPageSize}
              onPageChange={handleCropsPageChange}
            />

            {/* Container information and settings */}
            <ContainerInfoSection container={container} activities={activities} />
          </Box>
        )}

        {activeTab === 'environment' && (
          <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
            <Typography variant="h6">Environment & Recipes</Typography>
            <Typography color="text.secondary">This section is under development.</Typography>
          </Paper>
        )}

        {activeTab === 'inventory' && (
          <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
            <Typography variant="h6">Inventory</Typography>
            <Typography color="text.secondary">This section is under development.</Typography>
          </Paper>
        )}

        {activeTab === 'devices' && (
          <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
            <Typography variant="h6">Devices</Typography>
            <Typography color="text.secondary">This section is under development.</Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default ContainerDetailsPage;
