import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TabNavigation,
  TimeRangeSelector,
  UserAvatar,
  StatusChip,
  TemperatureDisplay,
  YieldBlock,
  CropsTable,
  ActivityLogPanel,
  ContainerSettingsPanel,
  ContainerInfoPanel,
  PaginationBlock,
} from '../../shared/components/ui';
import { containerService, inventoryService } from '../../api';
import { Container as ContainerData } from '../../shared/types/containers';
import { CropData } from '../../shared/components/ui/CropsTable/types';
import { ActivityLogEntry } from '../../shared/components/ui/ActivityLogPanel/types';
import { ContainerSettings } from '../../shared/components/ui/ContainerSettingsPanel/types';
import {
  StyledHeader,
  StyledNavigation,
  StyledContainerTitle,
  StyledMetricsSection,
  StyledCropsSection,
  StyledInfoSection,
} from './ContainerOverview.styles';

/**
 * ContainerOverview page component
 * 
 * @returns JSX element
 */
export const ContainerOverview: React.FC = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const navigate = useNavigate();
  const [container, setContainer] = useState<ContainerData | null>(null);
  const [crops, setCrops] = useState<CropData[]>([]);
  const [metrics, setMetrics] = useState<{
    airTemperature?: number;
    humidity?: number;
    co2Level?: number;
    yield?: number;
    nurseryUtilization?: number;
    cultivationUtilization?: number;
  } | null>(null);
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [settings, setSettings] = useState<ContainerSettings>({});
  const [timeRange, setTimeRange] = useState<string>('Week');
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Environment', label: 'Environment & Recipes' },
    { id: 'Inventory', label: 'Inventory' },
    { id: 'Devices', label: 'Devices' },
  ];



  useEffect(() => {
    const fetchData = async () => {
      if (!containerId) return;

      setLoading(true);
      try {
        // Fetch container data
        const containerResponse = await containerService.getContainer(containerId);
        if (containerResponse.data && !containerResponse.error) {
          setContainer(containerResponse.data);
        }

        // Fetch metrics
        const metricsResponse = await inventoryService.getInventoryMetrics(containerId, {});
        if (metricsResponse.data && !metricsResponse.error) {
          setMetrics({
            airTemperature: metricsResponse.data.air_temperature,
            humidity: metricsResponse.data.humidity,
            co2Level: metricsResponse.data.co2_level,
            yield: metricsResponse.data.yield_kg,
            nurseryUtilization: metricsResponse.data.nursery_station_utilization,
            cultivationUtilization: metricsResponse.data.cultivation_area_utilization,
          });
        } else {
          setMetrics(null);
        }

        // Fetch crops
        const cropsResponse = await inventoryService.getCrops(containerId, {});
        if (cropsResponse.data && !cropsResponse.error) {
          setCrops(cropsResponse.data);
        } else {
          setCrops([]);
        }

        // Initialize empty activities and settings - these would need dedicated API endpoints
        setActivities([]);
        setSettings({});
      } catch (err) {
        setError('Failed to load container data');
        console.error('Error fetching container data:', err);
        
        // Set empty states on error
        setContainer(null);
        setMetrics(null);
        setCrops([]);
        setActivities([]);
        setSettings({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [containerId]);

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // TODO: Update settings via API
  };

  // Handle tab navigation
  const handleTabChange = (tabId: string) => {
    if (tabId === 'Inventory') {
      navigate(`/containers/${containerId}/inventory`);
    } else {
      setActiveTab(tabId);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Loading container data...</Typography>
      </Container>
    );
  }

  if (error && !container) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#F7F9FE', minHeight: '100vh' }}>
      {/* Header */}
      <StyledHeader>
        <Container maxWidth="xl">
          <StyledNavigation>
            <Breadcrumbs sx={{ '& .MuiBreadcrumbs-separator': { color: '#6B7280' } }}>
              <Link color="#6B7280" href="/containers" sx={{ textDecoration: 'none', fontWeight: 500 }}>
                Container Dashboard
              </Link>
              <Typography color="#374151" sx={{ fontWeight: 500 }}>
                {container?.name || 'Container'}
              </Typography>
            </Breadcrumbs>
            <UserAvatar 
              src="/api/placeholder/32/32"
              alt="User Avatar"
              size={32} 
            />
          </StyledNavigation>

          {/* Container Title Section */}
          <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <StyledContainerTitle variant="h4">
                {container?.name || 'farm-container-04'}
              </StyledContainerTitle>
              <Box display="flex" alignItems="center" gap={2} mt={1}>
                <Box display="flex" alignItems="center" gap={1}>                                  
                </Box>                
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1} sx={{ color: '#6B7280', fontSize: '14px' }}>
              <Box
                    component="span"
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: '#666',
                      borderRadius: '2px',
                    }}
                  />
              <Typography variant="body2">
                    {container?.type === 'physical' ? 'Physical' : 'Virtual'}
                  </Typography>
              <Typography variant="body2" color="textSecondary">
                  {container?.tenant}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                  {container?.purpose}
                </Typography>
                <StatusChip 
                  status={container?.status === 'active' ? 'Connected' : 'Inactive'} 
                />
                <Typography variant="body2" color="textSecondary">
                  {container?.location?.address}
                </Typography>
            </Box>
          </Box>

          {/* Tab Navigation */}
          <TabNavigation
            tabs={tabs}
            activeTabId={activeTab}
            onTabChange={handleTabChange}
          />
        </Container>
      </StyledHeader>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Metrics Section */}
        <StyledMetricsSection>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Container Metrics</Typography>
            <TimeRangeSelector
              selectedRange={timeRange as 'Week' | 'Month' | 'Quarter' | 'Year'}
              onRangeChange={(range) => setTimeRange(range)}
            />
          </Box>
          {!metrics && (
            <Box p={3} textAlign="center">
              <Typography color="textSecondary">
                No metrics data available. Please check if the container has sensors configured.
              </Typography>
            </Box>
          )}
          <Grid container spacing={2}>
            {metrics?.airTemperature !== undefined && (
              <Grid item xs={12} sm={6} md={2}>
                <TemperatureDisplay
                  currentTemperature={metrics.airTemperature}
                  targetTemperature={22}
                  unit="°C"
                />
              </Grid>
            )}
            {metrics?.humidity !== undefined && (
              <Grid item xs={12} sm={6} md={2}>
                <TemperatureDisplay
                  currentTemperature={metrics.humidity}
                  targetTemperature={70}
                  title="Humidity"
                  unit="%"
                />
              </Grid>
            )}
            {metrics?.co2Level !== undefined && (
              <Grid item xs={12} sm={6} md={2}>
                <TemperatureDisplay
                  currentTemperature={metrics.co2Level}
                  targetTemperature={900}
                  title="CO2 Level"
                  unit=" ppm"
                />
              </Grid>
            )}
            {metrics?.yield !== undefined && (
              <Grid item xs={12} sm={6} md={2}>
                <YieldBlock
                  label="Yield"
                  value={`${metrics.yield}KG`}
                  increment="+1.5Kg"
                />
              </Grid>
            )}
            {metrics?.nurseryUtilization !== undefined && (
              <Grid item xs={12} sm={6} md={2}>
                <YieldBlock
                  label="Nursery Station Utilization"
                  value={`${metrics.nurseryUtilization}%`}
                />
              </Grid>
            )}
            {metrics?.cultivationUtilization !== undefined && (
              <Grid item xs={12} sm={6} md={2}>
                <YieldBlock
                  label="Cultivation Area Utilization"
                  value={`${metrics.cultivationUtilization}%`}
                />
              </Grid>
            )}
          </Grid>
        </StyledMetricsSection>

        {/* Crops Section */}
        <StyledCropsSection>
          <Typography variant="h6" gutterBottom>
            Crops
          </Typography>
          {crops.length === 0 ? (
            <Box p={3} textAlign="center">
              <Typography color="textSecondary">
                No crops data available for this container.
              </Typography>
            </Box>
          ) : (
            <>
              <CropsTable
                crops={crops}
                onRowClick={(crop) => console.log('Clicked crop:', crop)}
              />
              <Box mt={2}>
                <PaginationBlock
                  currentPage={1}
                  totalPages={1}
                  onPageChange={() => {}}
                />
              </Box>
            </>
          )}
        </StyledCropsSection>

        {/* Information Section */}
        <StyledInfoSection>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <ContainerInfoPanel
                container={container}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ContainerSettingsPanel
                settings={settings}
                onSettingChange={handleSettingChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ActivityLogPanel
                activities={activities}
                maxHeight={500}
              />
            </Grid>
          </Grid>
        </StyledInfoSection>
      </Container>
    </Box>
  );
};

export default ContainerOverview;