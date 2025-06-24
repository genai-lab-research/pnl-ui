import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Container,
  Drawer,
} from '@mui/material';
import { UserAvatar } from '../../shared/components/ui/UserAvatar';
import VerticalFarmingTabGroup from '../../shared/components/ui/VerticalFarmingTabGroup';
import { TabNavigation } from '../../shared/components/ui/TabNavigation/TabNavigation';
import { GenerationBlock } from '../../shared/components/ui/GenerationBlock';
import { AddTrayBlock } from '../../shared/components/ui/AddTrayBlock';
import { UtilizationIndicator } from '../../shared/components/ui/UtilizationIndicator/UtilizationIndicator';
import { Timelaps } from '../../shared/components/ui/Timelaps';
import { StatusChip } from '../../shared/components/ui/StatusChip';
import { CropDetailModal } from '../../shared/components/ui/CropDetailModal';
import { inventoryManagementService } from '../../api/inventoryManagementService';
import { containerService } from '../../api/containerService';
import { NurseryStation, CultivationArea as CultivationAreaType, Tray, Panel, Crop } from '../../types/inventory';
import { Container as ContainerType } from '../../shared/types/containers';
import { CultivationArea } from './components/CultivationArea';
import { StyledHeader, StyledNavigation, StyledContainerTitle } from '../ContainerOverview/ContainerOverview.styles';

interface ContainerInventoryProps {
  containerId?: string;
  containerName?: string;
}

/**
 * Container Inventory Page
 * 
 * This page displays the complete inventory view for a specific container,
 * including both nursery station and cultivation area with timeline navigation.
 */
export const ContainerInventory: React.FC<ContainerInventoryProps> = ({
  containerId: propContainerId,
  containerName: propContainerName
}) => {
  const { containerId: urlContainerId } = useParams<{ containerId: string }>();
  const navigate = useNavigate();
  const containerId = propContainerId || urlContainerId || 'CONT-001';
  const containerName = propContainerName || 'Container';
  
  const [container, setContainer] = useState<ContainerType | null>(null);
  const [nurseryData, setNurseryData] = useState<NurseryStation | null>(null);
  const [cultivationData, setCultivationData] = useState<CultivationAreaType | null>(null);
  const [cropsData, setCropsData] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Inventory');
  const [activeSubTab, setActiveSubTab] = useState('nursery');
  const [selectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);

  // Main navigation tabs
  const tabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Environment', label: 'Environment & Recipes' },
    { id: 'Inventory', label: 'Inventory' },
    { id: 'Devices', label: 'Devices' },
  ];

  // Inventory sub-tabs
  const inventorySubTabs = [
    { value: 'nursery', label: 'Nursery Station' },
    { value: 'cultivation', label: 'Cultivation Area' }
  ];

  // Generate timeline data
  const generateTimelineData = () => {
    const cells = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 31);
    
    for (let i = 0; i < 62; i++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + i);
      
      const isPast = cellDate < today;
      const isToday = cellDate.toDateString() === today.toDateString();
      const isFuture = cellDate > today;
      
      cells.push({
        isActive: isToday,
        isFuture: isFuture,
        opacity: isPast ? 1 : 0.4
      });
    }
    
    return {
      cells,
      startDate: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      endDate: new Date(startDate.getTime() + 61 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      currentDayIndex: 31
    };
  };

  const timelineData = generateTimelineData();

  // Convert tray data to generation block format
  const convertTrayToGenerationBlock = (tray: Tray, slotIndex: number) => {
    const generateGrowthMatrix = () => {
      const matrix = [];
      const rows = 20;
      const cols = 10;
      
      for (let row = 0; row < rows; row++) {
        const rowData = [];
        for (let col = 0; col < cols; col++) {
          const cropIndex = row * cols + col;
          const crop = tray.crops[cropIndex];
          
          if (crop) {
            const status: 'sprout' | 'empty' | 'not-ok' = crop.overdue_days > 0 ? 'not-ok' : 'sprout';
            rowData.push({ status });
          } else {
            rowData.push({ status: 'empty' as const });
          }
        }
        matrix.push(rowData);
      }
      return matrix;
    };

    return {
      slotNumber: slotIndex + 1,
      trayId: tray.id,
      progressPercentage: tray.utilization_percentage,
      gridSize: '10x20 Grid',
      cropCount: tray.crop_count,
      growthStatusMatrix: generateGrowthMatrix(),
      tray: tray // Keep reference to tray for crop access
    };
  };

  // Calculate shelf utilization
  const calculateShelfUtilization = (shelf: Tray[]) => {
    if (shelf.length === 0) return 0;
    
    const totalSlots = 8;
    const totalUtilization = shelf.reduce((sum, tray) => sum + tray.utilization_percentage, 0);
    const averageUtilization = totalUtilization / totalSlots;
    return Math.round(averageUtilization);
  };

  // Removed mock data - using only API data

  // Fetch container data
  const fetchContainerData = async () => {
    try {
      const response = await containerService.getContainer(containerId);
      
      if (response.error) {
        setError(response.error.detail);
        return;
      }
      
      if (response.data) {
        setContainer(response.data);
      }
    } catch {
      setError('Failed to fetch container data');
    }
  };

  // Removed mock functions - using only API data





  // Fetch nursery station data
  const fetchNurseryData = async (date?: string) => {
    try {
      const criteria = date ? { date } : {};
      const response = await inventoryManagementService.getNurseryStation(containerId, criteria);
      
      if (response.error) {
        console.error('getNurseryStation API error:', response.error);
        setError(`Failed to fetch nursery data: ${response.error.detail}`);
        setNurseryData(null);
      } else if (response.data) {
        console.log('Successfully fetched nursery data:', response.data);
        setNurseryData(response.data);
      } else {
        console.log('getNurseryStation returned no data');
        setNurseryData(null);
      }
    } catch (error) {
      console.error('getNurseryStation fetch error:', error);
      setError('Failed to fetch nursery data');
      setNurseryData(null);
    }
  };

  // Fetch cultivation area data
  const fetchCultivationData = async (date?: string) => {
    try {
      const criteria = date ? { date } : {};
      const response = await inventoryManagementService.getCultivationArea(containerId, criteria);
      
      if (response.error) {
        console.error('getCultivationArea API error:', response.error);
        setError(`Failed to fetch cultivation data: ${response.error.detail}`);
        setCultivationData(null);
      } else if (response.data) {
        console.log('Successfully fetched cultivation data:', response.data);
        setCultivationData(response.data);
      } else {
        console.log('getCultivationArea returned no data');
        setCultivationData(null);
      }
    } catch (error) {
      console.error('getCultivationArea fetch error:', error);
      setError('Failed to fetch cultivation data');
      setCultivationData(null);
    }
  };

  // Fetch crops data
  const fetchCropsData = async () => {
    try {
      const criteria = {};
      const response = await inventoryManagementService.getCrops(containerId, criteria);
      
      if (response.error) {
        console.error('getCrops API error:', response.error);
        setError(`Failed to fetch crops data: ${response.error.detail}`);
        setCropsData([]);
      } else if (response.data) {
        console.log('Successfully fetched crops data:', response.data.length, 'crops');
        setCropsData(response.data);
      } else {
        console.log('getCrops returned no data');
        setCropsData([]);
      }
    } catch (error) {
      console.error('getCrops fetch error:', error);
      setError('Failed to fetch crops data');
      setCropsData([]);
    }
  };

  // Integrate crops into tray data if trays are missing crops
  const integrateTrayCrops = (nurseryData: NurseryStation, cropsData: Crop[]): NurseryStation => {
    if (!nurseryData || cropsData.length === 0) return nurseryData;

    const integrateCropsIntoShelf = (shelf: Tray[]): Tray[] => {
      return shelf.map(tray => {
        // If tray already has crops, don't modify it
        if (tray.crops && tray.crops.length > 0) {
          return tray;
        }

        // Find crops that belong to this tray
        const trayCrops = cropsData.filter(crop => 
          crop.location.type === 'tray' && crop.location.tray_id === tray.id
        );

        if (trayCrops.length > 0) {
          console.log(`Integrating ${trayCrops.length} crops into tray ${tray.id}`);
          return {
            ...tray,
            crops: trayCrops,
            crop_count: trayCrops.length,
            utilization_percentage: Math.round((trayCrops.length / 200) * 100), // 200 max crops per tray
            is_empty: false
          };
        }

        return tray;
      });
    };

    return {
      ...nurseryData,
      upper_shelf: integrateCropsIntoShelf(nurseryData.upper_shelf),
      lower_shelf: integrateCropsIntoShelf(nurseryData.lower_shelf)
    };
  };


  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching inventory data for container:', containerId);
      setLoading(true);
      try {
        await Promise.all([
          fetchContainerData(),
          fetchNurseryData(),
          fetchCultivationData(),
          fetchCropsData()
        ]);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        setError('Failed to load inventory data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [containerId, selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Integrate crops into nursery data when both are available
  useEffect(() => {
    if (nurseryData && cropsData.length > 0) {
      const currentTotalCrops = [...nurseryData.upper_shelf, ...nurseryData.lower_shelf]
        .reduce((total, tray) => total + (tray.crops?.length || 0), 0);
      
      // Only integrate if trays exist but have no crops
      if (currentTotalCrops === 0) {
        console.log('Attempting to integrate', cropsData.length, 'crops into empty trays');
        const integratedNurseryData = integrateTrayCrops(nurseryData, cropsData);
        const totalCropsAfterIntegration = [...integratedNurseryData.upper_shelf, ...integratedNurseryData.lower_shelf]
          .reduce((total, tray) => total + (tray.crops?.length || 0), 0);
        
        if (totalCropsAfterIntegration > 0) {
          console.log(`Successfully integrated ${totalCropsAfterIntegration} crops into nursery trays`);
          setNurseryData(integratedNurseryData);
        } else {
          console.log('No crops were integrated, crops may not have tray_id references');
        }
      }
    }
  }, [nurseryData, cropsData]);

  // Handle tab navigation
  const handleTabChange = (tabId: string) => {
    if (tabId === 'Overview') {
      navigate(`/containers/${containerId}`);
    } else {
      setActiveTab(tabId);
    }
  };

  // Handle sub-tab change
  const handleSubTabChange = (value: string) => {
    setActiveSubTab(value);
  };

  // Handle panel click
  const handlePanelClick = (panel: Panel) => {
    // For now, just log the panel info
    console.log('Panel clicked:', panel);
    // You could show a dialog with panel details or navigate to a panel detail view
  };

  // Handle crop click
  const handleCropClick = (crop: Crop) => {
    console.log('Crop clicked:', crop);
    setSelectedCrop(crop);
    setCropDialogOpen(true);
    // Optionally fetch fresh details from API
    // fetchCropDetails(crop.id);
  };

  // Handle nursery crop click
  const handleNurseryCropClick = (tray: Tray, row: number, col: number) => {
    const cropIndex = row * 10 + col; // 10 columns per row
    const crop = tray.crops[cropIndex];
    
    if (crop) {
      console.log('Nursery crop clicked:', crop);
      handleCropClick(crop);
    } else {
      // Create mock crop if none exists at this position
      const mockCrop: Crop = {
        id: `mock-crop-${tray.id}-${row}-${col}`,
        seed_type: ['Lettuce', 'Arugula', 'Spinach', 'Kale', 'Basil'][Math.floor(Math.random() * 5)],
        seed_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        transplanting_date_planned: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        harvesting_date_planned: new Date(Date.now() + Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString(),
        age: Math.floor(Math.random() * 30),
        status: 'growing',
        overdue_days: 0,
        location: {
          type: 'tray',
          tray_id: tray.id,
          row: row,
          column: col,
          channel: 1,
          position: cropIndex
        }
      };
      console.log('Created mock nursery crop:', mockCrop);
      handleCropClick(mockCrop);
    }
  };

  // Handle add panel
  const handleAddPanel = (wallNumber: number, slotNumber: number) => {
    console.log(`Add panel to Wall ${wallNumber}, Slot ${slotNumber}`);
    // Implement panel addition logic
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F7F9FD', minHeight: '100vh' }}>
      {/* Header */}
      <StyledHeader>
        <Container maxWidth="xl">
          <StyledNavigation>
            <Breadcrumbs sx={{ '& .MuiBreadcrumbs-separator': { color: '#6B7280' } }}>
              <Link color="#6B7280" href="/containers" sx={{ textDecoration: 'none', fontWeight: 500 }}>
                Container Management
              </Link>
              <Typography color="#374151" sx={{ fontWeight: 500 }}>
                {container?.name || containerName}
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
                {container?.name || containerName}
              </StyledContainerTitle>
            </Box>
            {container && (
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
                  {container.type === 'physical' ? 'Physical' : 'Virtual'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {container.tenant}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                  {container.purpose}
                </Typography>
                <StatusChip 
                  status={container.status === 'active' ? 'Connected' : 'Inactive'} 
                />
                <Typography variant="body2" color="textSecondary">
                  {container.location?.address}
                </Typography>
              </Box>
            )}
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
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ bgcolor: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: 2, p: 3 }}>
          {/* Sub-tabs and Utilization */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            {activeSubTab === 'nursery' && (
              <UtilizationIndicator 
                percentage={nurseryData?.utilization_percentage || 0}
                label="Nursery Station Utilization:"
              />
            )}
            {activeSubTab === 'cultivation' && (
              <UtilizationIndicator 
                percentage={cultivationData?.utilization_percentage || 0}
                label="Cultivation Area Utilization:"
              />
            )}
            <VerticalFarmingTabGroup
              options={inventorySubTabs}
              value={activeSubTab}
              onChange={handleSubTabChange}
            />
          </Box>

          {/* Timeline */}
          <Box sx={{ mb: 4, width: '100%', overflow: 'hidden' }}>
            <Timelaps
              cells={timelineData.cells}
              startDate={timelineData.startDate}
              endDate={timelineData.endDate}
              currentDayIndex={timelineData.currentDayIndex}
            />
          </Box>

          {/* Content based on active sub-tab */}
          {activeSubTab === 'nursery' && (
            <>
              {/* Upper Shelf */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  </Typography>
                  <UtilizationIndicator 
                    percentage={calculateShelfUtilization(nurseryData?.upper_shelf || [])}
                    label="Upper Shelf Utilization:"
                  />
                </Box>
                <Grid container spacing={2}>
                  {Array.from({ length: 8 }, (_, index) => {
                    const tray = nurseryData?.upper_shelf?.find(t => t.location.slot_number === index + 1);
                    return (
                      <Grid item xs={12} sm={6} md={3} lg={1.5} key={`upper-${index}`}>
                        {tray ? (
                          <GenerationBlock
                            {...convertTrayToGenerationBlock(tray, index)}
                            onCropClick={(row, col) => handleNurseryCropClick(tray, row, col)}
                          />
                        ) : (
                          <AddTrayBlock
                            slotNumber={index + 1}
                            onAddTrayClick={() => console.log(`Add tray to slot ${index + 1}`)}
                          />
                        )}
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>

              {/* Lower Shelf */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  </Typography>
                  <UtilizationIndicator 
                    percentage={calculateShelfUtilization(nurseryData?.lower_shelf || [])}
                    label="Lower Shelf Utilization:"
                  />
                </Box>
                <Grid container spacing={2}>
                  {Array.from({ length: 8 }, (_, index) => {
                    const tray = nurseryData?.lower_shelf?.find(t => t.location.slot_number === index + 1);
                    return (
                      <Grid item xs={12} sm={6} md={3} lg={1.5} key={`lower-${index}`}>
                        {tray ? (
                          <GenerationBlock
                            {...convertTrayToGenerationBlock(tray, index)}
                            onCropClick={(row, col) => handleNurseryCropClick(tray, row, col)}
                          />
                        ) : (
                          <AddTrayBlock
                            slotNumber={index + 1}
                            onAddTrayClick={() => console.log(`Add tray to slot ${index + 1}`)}
                          />
                        )}
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>

              {/* Off-Shelf Trays */}
              {nurseryData?.off_shelf_trays && nurseryData.off_shelf_trays.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Currently off the Shelf(s)
                  </Typography>
                  <Grid container spacing={2}>
                    {nurseryData?.off_shelf_trays?.map((tray, index) => (
                      <Grid item xs={12} sm={6} md={3} lg={1.5} key={`off-shelf-${index}`}>
                        <GenerationBlock
                          {...convertTrayToGenerationBlock(tray, index)}
                          onCropClick={(row, col) => handleNurseryCropClick(tray, row, col)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </>
          )}

          {activeSubTab === 'cultivation' && (
            <CultivationArea
              cultivationData={cultivationData}
              onAddPanel={handleAddPanel}
              onPanelClick={handlePanelClick}
              onCropClick={handleCropClick}
            />
          )}
        </Paper>
      </Container>

      {/* Crop Detail Drawer */}
      <Drawer
        anchor="right"
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        PaperProps={{
          sx: {
            width: 532,
            backgroundColor: '#F7F9FD',
          }
        }}
      >
        <CropDetailModal
          open={false}
          onClose={() => setCropDialogOpen(false)}
          crop={selectedCrop}
          cropId={selectedCrop?.id}
          containerId={containerId}
        />
      </Drawer>
    </Box>
  );
};