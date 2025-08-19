import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Typography, Alert, Skeleton, Box, Button, IconButton, Collapse } from '@mui/material';
import { 
  Edit as EditIcon, 
  ExpandMore as ExpandMoreIcon,
  Thermostat,
  WaterDrop,
  Air,
  ShoppingCart,
  Dashboard,
  GridView
} from '@mui/icons-material';
import { useContainerOverview } from './hooks/useContainerOverview';
import { EditContainerModal } from '../ContainerEdit/components/EditContainerModal';
import {
  ContainerNavigationBlock,
  ContainerStatusHeader,
  ContainerTabNavigation,
  ContainerUserProfile,
  ContainerTimeSelector,
  ContainerDataRow,
  ContainerInfoPanel,
  ContainerActivityItem,
  ContainerPagination,
  ContainerMetricCard
} from './components';
import {
  StyledPageContainer,
  StyledHeaderSection,
  StyledContentSection,
  StyledMetricsGrid,
  StyledHeaderRow,
  StyledTitleStatusRow,
  StyledTableContainer,
  StyledTabPlaceholder,
  StyledErrorAlert,
  StyledSectionHeader,
  StyledTabNavigationWrapper,
  StyledPaginationContainer
} from './ContainerDetailPage.styles';

type TabValue = 'overview' | 'environment' | 'inventory' | 'devices';



/**
 * ContainerDetailPage - Main page component for individual container view
 * 
 * Provides comprehensive view of container information including metrics,
 * crops data, settings, and activity timeline. Features sticky header with
 * navigation and tabbed content sections.
 */
export const ContainerDetailPage: React.FC = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabValue>('overview');
  
  // Section collapse/expand state
  const [sectionsCollapsed, setSectionsCollapsed] = useState({
    crops: false,
    containerInfo: false
  });

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Parse container ID to number for API calls
  const containerIdNum = containerId ? parseInt(containerId, 10) : 0;

  // Container overview data and state
  const {
    containerInfo,
    metricCards,
    cropsTableData,
    activityTimeline,
    timeSelectorProps,
    changeTimeRange,
    changeCropsPage,
    changeCropsItemsPerPage,
    loadOverviewData,
    isLoading,
    errors
  } = useContainerOverview(containerIdNum);

  // Navigation handlers
  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab);
  };

  // Section collapse/expand handlers
  const toggleSection = (section: keyof typeof sectionsCollapsed) => {
    setSectionsCollapsed(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Edit modal handlers
  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleEditSuccess = () => {
    // Refresh the container data after successful edit
    loadOverviewData();
    setEditModalOpen(false);
  };

  // Loading skeleton component
  const renderLoadingSkeleton = () => (
    <StyledPageContainer>
      {/* Header Skeleton */}
      <StyledHeaderSection>
        <StyledHeaderRow>
          <Skeleton variant="rectangular" width={200} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </StyledHeaderRow>
        <StyledTitleStatusRow>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rectangular" width={150} height={32} />
        </StyledTitleStatusRow>
        <Skeleton variant="rectangular" width="100%" height={48} />
      </StyledHeaderSection>

      {/* Content Skeleton */}
      <StyledContentSection>
        <StyledSectionHeader>
          <Skeleton variant="text" width={120} height={32} />
          <Skeleton variant="rectangular" width={200} height={32} />
        </StyledSectionHeader>
        
        <StyledMetricsGrid container spacing={3}>
          {[1, 2, 3, 4].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" width="100%" height={120} />
            </Grid>
          ))}
        </StyledMetricsGrid>
      </StyledContentSection>
    </StyledPageContainer>
  );

  // Error state component
  const renderErrorState = (errorMessage: string) => (
    <StyledPageContainer>
      <StyledErrorAlert>
        <Alert severity="error" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <div>
            <Typography variant="h6" gutterBottom>
              Unable to load container details
            </Typography>
            <Typography variant="body2">
              {errorMessage}
            </Typography>
          </div>
        </Alert>
      </StyledErrorAlert>
      
      <StyledContentSection>
        <StyledTabPlaceholder>
          <Typography variant="h5" gutterBottom>
            Container Not Found
          </Typography>
          <Typography color="text.secondary">
            The requested container could not be found or you don't have permission to view it.
          </Typography>
        </StyledTabPlaceholder>
      </StyledContentSection>
    </StyledPageContainer>
  );

  // If no container ID is provided
  if (!containerId) {
    return renderErrorState('No container ID provided in the URL');
  }

  // Show loading skeleton while initial data is loading
  if (isLoading.overview && !containerInfo && !errors.overview) {
    return renderLoadingSkeleton();
  }

  // Show error state if there's a critical error
  if (errors.overview && !containerInfo) {
    return renderErrorState(errors.overview);
  }

  return (
    <StyledPageContainer>
      {/* Full Width Sticky Header Section */}
      <StyledHeaderSection>
        {/* Top Row - Breadcrumb Navigation and User Profile */}
        <StyledHeaderRow>
          <ContainerNavigationBlock
            containerId={containerInfo?.name || `Container ${containerId}`}
            onNavigate={() => navigate('/containers')}
            loading={isLoading.overview}
          />
          <ContainerUserProfile 
            userName="Current User"
            avatarUrl="/avatar-placeholder.png"
          />
        </StyledHeaderRow>

        {/* Main Title Row with Status Information */}
        <StyledTitleStatusRow>
          <Box display="flex" alignItems="center">
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{
                fontWeight: 600,
                color: '#1a1a1a',
                fontSize: '32px',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              {containerInfo?.name || '111'}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <ContainerStatusHeader
              containerName={containerInfo?.name || containerId || 'Unknown'}
              containerType={containerInfo?.type === 'physical' ? 'physical' : 'virtual'}
              tenantName={containerInfo?.tenant?.name}
              status={containerInfo?.status === 'active' ? 'Active' : containerInfo?.status === 'inactive' ? 'Inactive' : 'Active'}
              statusVariant={containerInfo?.status === 'active' ? 'active' : 'inactive'}
              loading={isLoading.overview}
            />
          </Box>
        </StyledTitleStatusRow>

        {/* Tab Navigation */}
        <StyledTabNavigationWrapper>
          <ContainerTabNavigation
            activeTab={activeTab}
            onTabChange={(tab: string) => handleTabChange(tab as TabValue)}
            customTabs={[
              { id: 'overview', label: 'Overview', value: 'overview' },
              { id: 'environment', label: 'Environment & Recipes', value: 'environment' },
              { id: 'inventory', label: 'Inventory', value: 'inventory' },
              { id: 'devices', label: 'Devices', value: 'devices' }
            ]}
          />
        </StyledTabNavigationWrapper>
      </StyledHeaderSection>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Error Display */}
          {errors.overview && (
            <StyledErrorAlert>
              <Alert severity="error">
                {errors.overview}
              </Alert>
            </StyledErrorAlert>
          )}

          {/* Main Content Area */}
          <StyledContentSection>
            {/* Container Metrics Section */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 3,
              paddingBottom: 0
            }}>
              <Typography variant="h5" component="h2" sx={{ 
                fontWeight: 600, 
                fontSize: '20px',
                color: '#1a1a1a',
                letterSpacing: '-0.01em'
              }}>
                Container Metrics
              </Typography>
              <ContainerTimeSelector
                selectedTimeRange={timeSelectorProps.selectedRange || 'week'}
                onTimeRangeChange={changeTimeRange}
                loading={isLoading.metrics}
                size="md"
              />
            </Box>

            {/* Metrics Cards Row - 6 metrics as per design */}
            <Grid container spacing={2} sx={{ marginBottom: 0 }}>
              {/* Air Temperature */}
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <ContainerMetricCard
                  title="Air Temperature"
                  value={metricCards?.airTemperature || 20}
                  targetValue={"/ 21"}
                  unit="°C"
                  iconSlot={<Thermostat />}
                  loading={isLoading.metrics}
                />
              </Grid>

              {/* Relative Humidity */}
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <ContainerMetricCard
                  title="Rel. Humidity"
                  value={metricCards?.humidity || 65}
                  targetValue={"/ 68"}
                  unit="%"
                  iconSlot={<WaterDrop />}
                  loading={isLoading.metrics}
                />
              </Grid>

              {/* CO2 Level */}
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <ContainerMetricCard
                  title="CO₂ Level"
                  value={metricCards?.co2 || 850}
                  targetValue="/ 800-900ppm"
                  iconSlot={<Air />}
                  loading={isLoading.metrics}
                />
              </Grid>

              {/* Yield */}
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <ContainerMetricCard
                  title="Yield"
                  value={metricCards?.yieldTotal || 45}
                  targetValue="+1.5"
                  unit="KG"
                  iconSlot={<ShoppingCart />}
                  loading={isLoading.metrics}
                />
              </Grid>

              {/* Nursery Station Utilization */}
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <ContainerMetricCard
                  title="Nursery Station Utilization"
                  value={metricCards?.nurseryUtilization || 75}
                  targetValue="+5"
                  unit="%"
                  iconSlot={<Dashboard />}
                  loading={isLoading.metrics}
                />
              </Grid>

              {/* Cultivation Area Utilization */}
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <ContainerMetricCard
                  title="Cultivation Area Utilization"
                  value={metricCards?.cultivationUtilization || 80}
                  targetValue="+15"
                  unit="%"
                  iconSlot={<GridView />}
                  loading={isLoading.metrics}
                />
              </Grid>
            </Grid>
          </StyledContentSection>

          {/* Crops Table Section */}
          <StyledContentSection>
            <StyledSectionHeader>
              <Box 
                display="flex" 
                alignItems="center" 
                width="100%"
                justifyContent="space-between"
                gap={1}
                sx={{
                  opacity: sectionsCollapsed.crops ? 0.7 : 1,
                  transition: 'opacity 0.2s ease'
                }}
              >
                <Typography 
                  variant="h6" 
                  component="h3" 
                  fontWeight={600}
                  sx={{
                    color: sectionsCollapsed.crops ? 'text.secondary' : 'text.primary',
                    transition: 'color 0.2s ease'
                  }}
                >
                  Crops {sectionsCollapsed.crops ? '(Collapsed)' : ''}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => toggleSection('crops')}
                  sx={{
                    transition: 'transform 0.2s ease',
                    transform: sectionsCollapsed.crops ? 'rotate(-90deg)' : 'rotate(0deg)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                  aria-label={sectionsCollapsed.crops ? 'Expand crops section' : 'Collapse crops section'}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
            </StyledSectionHeader>
            
            <Collapse in={!sectionsCollapsed.crops} timeout={300}>
              <StyledTableContainer>
              {isLoading.overview ? (
                // Loading skeletons for table rows
                [1, 2, 3].map((_, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Skeleton variant="rectangular" width="100%" height={48} />
                  </Box>
                ))
              ) : cropsTableData?.rows && cropsTableData.rows.length > 0 ? (
                <Box
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                  }}
                >
                  {/* Table Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '2px solid #e0e0e0',
                      fontWeight: 600,
                      fontSize: '13px',
                      color: '#424242',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {/* Column headers matching design */}
                    <Box sx={{ flex: 2, paddingRight: '16px' }}>SEED TYPE</Box>
                    <Box sx={{ width: 120, textAlign: 'center', paddingX: '8px' }}>CULTIVATION AREA</Box>
                    <Box sx={{ width: 100, textAlign: 'center', paddingX: '8px' }}>NURSERY TABLE</Box>
                    <Box sx={{ width: 100, textAlign: 'center', paddingX: '8px' }}>LAST SD</Box>
                    <Box sx={{ width: 100, textAlign: 'center', paddingX: '8px' }}>LAST TD</Box>
                    <Box sx={{ width: 100, textAlign: 'center', paddingX: '8px' }}>LAST HD</Box>
                    <Box sx={{ width: 80, textAlign: 'center', paddingX: '8px' }}>AVG AGE</Box>
                    <Box sx={{ width: 100, textAlign: 'center', paddingX: '8px' }}>OVERDUE</Box>
                  </Box>
                  
                  {/* Table Body */}
                  <Box sx={{ backgroundColor: '#fff' }}>
                    {cropsTableData.rows.map((row, index) => (
                      <Box
                        key={row.id || index}
                        sx={{
                          borderBottom: index < cropsTableData.rows.length - 1 ? '1px solid #f0f0f0' : 'none',
                          '&:hover': {
                            backgroundColor: '#f8fafc',
                          },
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <ContainerDataRow
                          variety={row.seedType || 'N/A'}
                          tenantId={row.cultivation_area_count?.toString() || 'N/A'}
                          phase={row.nursery_station_count?.toString() || 'N/A'}
                          sowingDate={row.last_seeding_date ? new Date(row.last_seeding_date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') : 'N/A'}
                          harvestDate={row.last_transplanting_date ? new Date(row.last_transplanting_date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') : 'N/A'}
                          shipDate={row.last_harvesting_date ? new Date(row.last_harvesting_date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') : 'N/A'}
                          batchSize={row.overdue_count !== undefined && row.average_age !== undefined ? `${row.overdue_count} ${row.average_age}` : 'N/A'}
                          status={row.overdue_count > 0 ? 'warning' : 'active'}
                          loading={false}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                // No data state when no crops data is available
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px 24px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#fafafa',
                    minHeight: '200px'
                  }}
                >
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      textAlign: 'center'
                    }}
                  >
                    No data
                  </Typography>
                </Box>
              )}
            </StyledTableContainer>

              {cropsTableData?.pagination && (
                <StyledPaginationContainer>
                  <ContainerPagination
                    pagination={{
                      currentPage: cropsTableData.pagination.page,
                      totalPages: cropsTableData.pagination.totalPages,
                      totalItems: cropsTableData.pagination.total || 0,
                      itemsPerPage: cropsTableData.pagination.limit || 2,
                      onPageChange: changeCropsPage,
                      onItemsPerPageChange: changeCropsItemsPerPage
                    }}
                    containerId={containerId}
                    dataContext="crops"
                    disabled={isLoading.overview}
                  />
                </StyledPaginationContainer>
              )}
            </Collapse>
          </StyledContentSection>

          {/* Container Information & Settings Section */}
          <StyledContentSection>
            <StyledSectionHeader>
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
                width="100%"
                sx={{
                  opacity: sectionsCollapsed.containerInfo ? 0.7 : 1,
                  transition: 'opacity 0.2s ease'
                }}
              >
                <Typography 
                  variant="h6" 
                  component="h3" 
                  fontWeight={600}
                  sx={{
                    color: sectionsCollapsed.containerInfo ? 'text.secondary' : 'text.primary',
                    transition: 'color 0.2s ease'
                  }}
                >
                  Container Information & Settings {sectionsCollapsed.containerInfo ? '(Collapsed)' : ''}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Button
                    startIcon={<EditIcon />}
                    variant="text"
                    size="small"
                    sx={{ textTransform: 'none' }}
                    onClick={handleEditClick}
                  >
                    Edit
                  </Button>
                  <IconButton 
                    size="small" 
                    onClick={() => toggleSection('containerInfo')}
                    sx={{
                      transition: 'transform 0.2s ease',
                      transform: sectionsCollapsed.containerInfo ? 'rotate(-90deg)' : 'rotate(0deg)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                    aria-label={sectionsCollapsed.containerInfo ? 'Expand container info section' : 'Collapse container info section'}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
              </Box>
            </StyledSectionHeader>
            
            <Collapse in={!sectionsCollapsed.containerInfo} timeout={300}>
              <Grid container spacing={4}>
              {/* Container Information Column */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Container Information
                </Typography>
                <ContainerInfoPanel
                  containerInfo={[
                    { label: 'Name', value: containerInfo?.name || 'N/A' },
                    { label: 'Type', value: containerInfo?.type === 'physical' ? 'Physical' : containerInfo?.type === 'virtual' ? 'Virtual' : 'Physical' },
                    { label: 'Tenant', value: containerInfo?.tenant?.name || 'N/A' },
                    { label: 'Purpose', value: containerInfo?.purpose ? containerInfo.purpose.charAt(0).toUpperCase() + containerInfo.purpose.slice(1) : 'N/A' },
                    { label: 'Location', value: containerInfo?.location ? (containerInfo.location.city || containerInfo.location.address || containerInfo.location.name || 'N/A') : 'N/A' },
                    { label: 'Status', value: containerInfo?.status === 'active' ? 'Active' : containerInfo?.status === 'inactive' ? 'Inactive' : containerInfo?.status || 'Active' },
                    { label: 'Created', value: containerInfo?.created_at ? new Date(containerInfo.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') : 'N/A' },
                    { label: 'Last Modified', value: containerInfo?.updated_at ? new Date(containerInfo.updated_at).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') : 'N/A' },
                    { label: 'Creator', value: 'N/A' }, // Not available in API response
                    { label: 'Seed Type', value: containerInfo?.seed_types && containerInfo.seed_types.length > 0 ? containerInfo.seed_types.map(st => st.name).join(', ') : 'N/A' },
                    { label: 'Notes', value: containerInfo?.notes || 'N/A' }
                  ]}
                  canEdit={false}
                  loading={isLoading.settings}
                />
              </Grid>

              {/* System Settings Column */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  System Settings
                </Typography>
                <ContainerInfoPanel
                  containerInfo={[
                    { label: 'Enable Shadow Service', value: containerInfo?.shadow_service_enabled ? 'Yes' : 'No' },
                    { label: 'Connect to external systems', value: containerInfo?.ecosystem_connected ? 'Yes' : 'No' },
                    { label: 'FA Integration', value: containerInfo?.ecosystem_settings?.fa ? containerInfo.ecosystem_settings.fa.charAt(0).toUpperCase() + containerInfo.ecosystem_settings.fa.slice(1) : 'N/A' },
                    { label: 'PYA Integration', value: containerInfo?.ecosystem_settings?.pya ? containerInfo.ecosystem_settings.pya.charAt(0).toUpperCase() + containerInfo.ecosystem_settings.pya.slice(1) : 'N/A' },
                    { label: 'AWS Environment', value: containerInfo?.ecosystem_settings?.aws ? containerInfo.ecosystem_settings.aws.charAt(0).toUpperCase() + containerInfo.ecosystem_settings.aws.slice(1) : 'N/A' },
                    { label: 'MBAI Environment', value: containerInfo?.ecosystem_settings?.mbai ? containerInfo.ecosystem_settings.mbai.charAt(0).toUpperCase() + containerInfo.ecosystem_settings.mbai.slice(1) : 'Disabled' },
                  ]}
                  canEdit={false}
                  loading={isLoading.settings}
                />
              </Grid>

              {/* Activity Log Column */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Activity Log
                </Typography>
                
                <Box>
                  {activityTimeline && activityTimeline.length > 0 ? (
                    activityTimeline.map((activity) => (
                      <ContainerActivityItem
                        key={activity.id}
                        activity={{
                          id: Number(activity.id),
                          timestamp: new Date(activity.timestamp).toLocaleString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }),
                          actionType: activity.action_type,
                          message: activity.description,
                          author: activity.actor_type === 'admin' ? 'Admin User' : 
                                  activity.actor_type === 'technician' ? 'Technician' :
                                  activity.actor_type === 'sensor' ? 'System Sensor' : 'System',
                          category: activity.actor_type || 'system'
                        }}
                        loading={isLoading.activities}
                      />
                    ))
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '32px 16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        backgroundColor: '#fafafa',
                        minHeight: '120px'
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{
                          fontSize: '14px',
                          fontWeight: 500,
                          textAlign: 'center'
                        }}
                      >
                        No data
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
              </Grid>
            </Collapse>
          </StyledContentSection>
        </>
      )}

      {/* Other Tab Content Placeholders */}
      {activeTab === 'environment' && (
        <StyledContentSection>
          <StyledTabPlaceholder>
            <Typography variant="h5" gutterBottom>
              Environment & Recipes
            </Typography>
            <Typography color="text.secondary">
              Environment and recipes content will be implemented in future iterations.
            </Typography>
          </StyledTabPlaceholder>
        </StyledContentSection>
      )}

      {activeTab === 'inventory' && (
        <StyledContentSection>
          <StyledTabPlaceholder>
            <Typography variant="h5" gutterBottom>
              Inventory
            </Typography>
            <Typography color="text.secondary">
              Inventory management content will be implemented in future iterations.
            </Typography>
          </StyledTabPlaceholder>
        </StyledContentSection>
      )}

      {activeTab === 'devices' && (
        <StyledContentSection>
          <StyledTabPlaceholder>
            <Typography variant="h5" gutterBottom>
              Devices
            </Typography>
            <Typography color="text.secondary">
              Device management content will be implemented in future iterations.
            </Typography>
          </StyledTabPlaceholder>
        </StyledContentSection>
      )}

      {/* Edit Container Modal */}
      <EditContainerModal
        open={editModalOpen}
        containerId={containerIdNum}
        onClose={handleEditModalClose}
        onSuccess={handleEditSuccess}
      />
    </StyledPageContainer>
  );
};

export default ContainerDetailPage;