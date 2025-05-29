import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Collapse, Button, IconButton } from '@mui/material';
import { ExpandMore, ExpandLess, Edit, Person as PersonIcon, Computer as ComputerIcon } from '@mui/icons-material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Header from '../shared/components/ui/Header';
import { MetricCardsContainer } from '../shared/components/ui/MetricCardsContainer';
import { Table } from '../shared/components/ui/Table';
import { Pagination } from '../shared/components/ui/Pagination';
import { Chip } from '../shared/components/ui/Chip';
import { TimePeriodSelector, TimePeriod } from '../shared/components/ui/TimePeriodSelector';
import { ContainerUserHeader } from '../shared/components/ui/ContainerUserHeader';
import containerService from '../services/containerService';
import { ContainerDetail, ContainerCrop, ContainerActivity } from '../shared/types/containers';
import { ContainerMetrics, TimeRange, MetricCardData } from '../shared/types/metrics';

const ContainerDetailsPage: React.FC = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimePeriod>('week');
  const [cropsExpanded, setCropsExpanded] = useState(true);
  const [infoExpanded, setInfoExpanded] = useState(true);
  const [currentCropsPage, setCurrentCropsPage] = useState(1);
  
  // Data states
  const [containerData, setContainerData] = useState<ContainerDetail | null>(null);
  const [metricsData, setMetricsData] = useState<ContainerMetrics | null>(null);
  const [cropsData, setCropsData] = useState<ContainerCrop[]>([]);
  const [totalCrops, setTotalCrops] = useState(0);
  const [activitiesData, setActivitiesData] = useState<ContainerActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load container data
  useEffect(() => {
    const loadContainerData = async () => {
      if (!containerId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Convert TimePeriod to TimeRange for API
        const timeRangeMap: Record<TimePeriod, TimeRange> = {
          'week': 'WEEK',
          'month': 'MONTH',
          'quarter': 'QUARTER',
          'year': 'YEAR'
        };
        
        const [container, metrics, crops, activities] = await Promise.all([
          containerService.getContainerById(containerId),
          containerService.getContainerMetrics(containerId, timeRangeMap[selectedTimeRange]),
          containerService.getContainerCrops(containerId, currentCropsPage - 1, 10),
          containerService.getContainerActivities(containerId, 5)
        ]);
        
        setContainerData(container);
        setMetricsData(metrics);
        setCropsData(crops.results);
        setTotalCrops(crops.total);
        setActivitiesData(activities.activities);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load container data');
        console.error('Error loading container data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContainerData();
  }, [containerId, selectedTimeRange, currentCropsPage]);

  // Transform metrics data for MetricCardsContainer
  const getMetricCards = (): MetricCardData[] => {
    if (!metricsData) return [];
    
    return [
      {
        title: 'Air Temperature',
        value: `${metricsData.temperature.current}${metricsData.temperature.unit}`,
        targetValue: metricsData.temperature.target ? `${metricsData.temperature.target}${metricsData.temperature.unit}` : undefined,
      },
      {
        title: 'Rel. Humidity',
        value: `${metricsData.humidity.current}${metricsData.humidity.unit}`,
        targetValue: metricsData.humidity.target ? `${metricsData.humidity.target}${metricsData.humidity.unit}` : undefined,
      },
      {
        title: 'CO₂ Level',
        value: `${metricsData.co2.current}`,
        targetValue: `${metricsData.co2.target}-900ppm`,
      },
      {
        title: 'Yield',
        value: `${metricsData.yield.current}${metricsData.yield.unit}`,
        trend: metricsData.yield.trend,
      },
      {
        title: 'Nursery Station Utilization',
        value: `${metricsData.nursery_utilization.current}${metricsData.nursery_utilization.unit}`,
        trend: metricsData.nursery_utilization.trend,
      },
      {
        title: 'Cultivation Area Utilization',
        value: `${metricsData.cultivation_utilization.current}${metricsData.cultivation_utilization.unit}`,
        trend: metricsData.cultivation_utilization.trend,
      },
    ];
  };

  // Table columns for crops
  const cropsColumns = [
    { id: 'seed_type', label: 'SEED TYPE', field: 'seed_type' },
    { id: 'cultivation_area', label: 'CULTIVATION AREA', field: 'cultivation_area' },
    { id: 'nursery_table', label: 'NURSERY TABLE', field: 'nursery_table' },
    { id: 'last_sd', label: 'LAST SD', field: 'last_sd' },
    { id: 'last_td', label: 'LAST TD', field: 'last_td' },
    { id: 'last_hd', label: 'LAST HD', field: 'last_hd' },
    { id: 'avg_age', label: 'AVG AGE', field: 'avg_age' },
    {
      id: 'overdue',
      label: 'OVERDUE',
      renderCell: (row: any) => (
        <Chip 
          value={row.overdue} 
          status={row.overdue > 0 ? 'in-progress' : 'active'} 
        />
      ),
    },
  ];

  // Format date display in dd/mm/yyyy, HH:mm format to match reference
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', ',');
  };

  // Transform crops data for table
  const cropsTableData = cropsData.map(crop => ({
    ...crop,
    last_sd: formatDate(crop.last_sd),
    last_td: formatDate(crop.last_td),
    last_hd: formatDate(crop.last_hd),
  }));

  const tabs = [
    { label: 'Overview', value: 0 },
    { label: 'Environment & Recipes', value: 1 },
    { label: 'Inventory', value: 2 },
    { label: 'Devices', value: 3 },
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTimeRangeChange = (newTimeRange: TimePeriod) => {
    setSelectedTimeRange(newTimeRange);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading container details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!containerData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Container not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header
        breadcrumb={`Container Dashboard / ${containerData.name}`}
        title={containerData.name}
        metadata={`${containerData.type === 'PHYSICAL' ? 'Physical container' : 'Virtual container'} | ${containerData.tenant} | ${containerData.purpose}`}
        status={containerData.status === 'ACTIVE' ? 'active' : 'inactive'}
        tabs={tabs}
        selectedTab={activeTab}
        onTabChange={handleTabChange}
        onBackClick={() => navigate('/dashboard')}
      />

      {activeTab === 0 && (
        <Box sx={{ p: 3 }}>
          {/* Container Metrics Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Container Metrics
              </Typography>
              <TimePeriodSelector
                value={selectedTimeRange}
                onChange={handleTimeRangeChange}
                options={[
                  { label: 'Week', value: 'week' },
                  { label: 'Month', value: 'month' },
                  { label: 'Quarter', value: 'quarter' },
                  { label: 'Year', value: 'year' },
                ]}
              />
            </Box>
            <MetricCardsContainer 
              metrics={getMetricCards()}
            />
          </Box>

          {/* Crops Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Crops
                </Typography>
                <IconButton onClick={() => setCropsExpanded(!cropsExpanded)}>
                  {cropsExpanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              <Collapse in={cropsExpanded}>
                <Table
                  columns={cropsColumns}
                  rows={cropsTableData}
                  fullWidth
                  zebraStriping
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    page={currentCropsPage}
                    totalPages={Math.ceil(totalCrops / 10)}
                    onPageChange={setCurrentCropsPage}
                    showingText={`Showing page ${currentCropsPage} of ${Math.ceil(totalCrops / 10)}`}
                  />
                </Box>
              </Collapse>
            </CardContent>
          </Card>

          {/* Container Information & Settings */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Container Information & Settings
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button startIcon={<Edit />} size="small">
                    Edit
                  </Button>
                  <IconButton onClick={() => setInfoExpanded(!infoExpanded)}>
                    {infoExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </Box>
              <Collapse in={infoExpanded}>
                <Grid container spacing={3}>
                  {/* Container Information */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      Container Information
                    </Typography>
                    <Box sx={{ '& > *': { mb: 1 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Name</Typography>
                        <Typography variant="body2">{containerData.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Type</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {containerData.type === 'PHYSICAL' && (
                            <LocalShippingIcon fontSize="small" sx={{ color: '#000000' }} />
                          )}
                          <Typography variant="body2">{containerData.type === 'PHYSICAL' ? 'Physical' : 'Virtual'}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Tenant</Typography>
                        <Typography variant="body2">{containerData.tenant}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Purpose</Typography>
                        <Typography variant="body2">{containerData.purpose}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Location</Typography>
                        <Typography variant="body2">{containerData.location.city}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Status</Typography>
                        <Chip 
                          value={containerData.status === 'ACTIVE' ? 'Active' : 
                                containerData.status === 'INACTIVE' ? 'Inactive' : 
                                containerData.status}
                          status={containerData.status.toLowerCase() as 'active' | 'inactive'} 
                          size="small" 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Created</Typography>
                        <Typography variant="body2">{formatDate(containerData.created)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Last Modified</Typography>
                        <Typography variant="body2">{formatDate(containerData.modified)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Creator</Typography>
                        <Typography variant="body2">{containerData.creator}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="body2" color="text.secondary">Seed Type:</Typography>
                        <Typography variant="body2" sx={{ textAlign: 'right', maxWidth: '65%', wordBreak: 'break-word' }}>
                          {containerData.seed_types.join(', ')}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Notes
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {containerData.notes}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* System Settings */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      System Settings
                    </Typography>
                    <Box sx={{ '& > *': { mb: 2 } }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          Container Options
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Enable Shadow Service</Typography>
                          <Typography variant="body2">{containerData.shadow_service_enabled ? 'Yes' : 'No'}</Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          System Integration
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Connect to external systems</Typography>
                          <Typography variant="body2">{containerData.ecosystem_connected ? 'Yes' : 'No'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">FA Integration</Typography>
                          <Typography variant="body2" color="primary">{containerData.system_integrations.fa_integration.name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">AWS Environment</Typography>
                          <Typography variant="body2" color="primary">{containerData.system_integrations.aws_environment.name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">MBAI Environment</Typography>
                          <Typography variant="body2" color="primary">{containerData.system_integrations.mbai_environment.name}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Activity Log */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      Activity Log
                    </Typography>
                    <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1, overflow: 'hidden' }}>
                      {activitiesData.map((activity) => (
                        <ContainerUserHeader
                          key={activity.id}
                          title={activity.description}
                          timestamp={`${new Date(activity.timestamp).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} - ${new Date(activity.timestamp).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: true 
                          })}`}
                          userName={activity.user.name}
                          avatarColor={activity.type === 'MAINTENANCE' ? '#4caf50' : activity.type === 'SYNCED' ? '#455a64' : '#4caf50'}
                          avatarIcon={activity.type === 'MAINTENANCE' ? <PersonIcon /> : activity.type === 'SYNCED' ? <ComputerIcon /> : <PersonIcon />}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Collapse>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Other tabs content can be added here */}
      {activeTab !== 0 && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {tabs[activeTab]?.label} content coming soon...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ContainerDetailsPage;