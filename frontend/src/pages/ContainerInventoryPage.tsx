import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
import Header from '../shared/components/ui/Header';
import { ViewToggleTabs } from '../shared/components/ui/ViewToggleTabs';
import { ProgressMeter } from '../shared/components/ui/ProgressMeter';
import { TrayGridviewCrops, AddTraySlot } from '../shared/components/ui/TrayGridviewCrops';
import { TimelineComponent } from '../shared/components/ui';
import { AddTrayPanel } from '../shared/components/ui/AddTrayPanel';
import { CropDetailModal } from '../shared/components/ui/CropDetailModal';
import inventoryService from '../services/inventoryService';
import containerService from '../services/containerService';
import { 
  NurseryStationData, 
  CultivationAreaData, 
  TraySlot, 
  TrayProvisionRequest,
  TrayProvisionResponse,
  PanelProvisionRequest,
  PanelProvisionResponse 
} from '../shared/types/inventory';
import { ContainerSummary } from '../shared/types/containers';

const ContainerInventoryPage: React.FC = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(2); // Inventory tab
  const [activeSubTab, setActiveSubTab] = useState<'nursery' | 'cultivation'>('nursery');
  const [selectedDay, setSelectedDay] = useState<number>(59); // Start at today (last day of 60-day range)
  
  // Data states
  const [containerData, setContainerData] = useState<ContainerSummary | null>(null);
  const [nurseryData, setNurseryData] = useState<NurseryStationData | null>(null);
  const [cultivationData, setCultivationData] = useState<CultivationAreaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add Tray/Panel modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'tray' | 'panel'>('tray');
  const [modalLocation, setModalLocation] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{ shelf?: string; wall?: string; slot: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Crop detail modal states
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);

  // Load container data with optional day parameter for inventory data
  const loadContainerData = useCallback(async (dayOffset?: number) => {
    if (!containerId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // For container summary, we don't need day-specific data
      const containerPromise = containerService.getContainerSummaryById(containerId);
      
      // Calculate the date for the given day offset (60-day range)
      let dateParam: string | undefined = undefined;
      if (dayOffset !== undefined) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - (59 - dayOffset)); // Convert index to actual date (59 days ago to today)
        dateParam = targetDate.toISOString();
      }
      
      // For inventory data, include calculated date if provided
      const nurseryPromise = inventoryService.getNurseryStationData(containerId, dateParam);
      const cultivationPromise = inventoryService.getCultivationAreaData(containerId, dateParam).catch((err) => {
        console.warn('Cultivation area data failed, using null:', err);
        return null;
      });
      
      const [container, nursery, cultivation] = await Promise.all([
        containerPromise,
        nurseryPromise,
        cultivationPromise
      ]);
      
      setContainerData(container);
      setNurseryData(nursery);
      setCultivationData(cultivation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory data');
      console.error('Error loading inventory data:', err);
    } finally {
      setLoading(false);
    }
  }, [containerId]);

  useEffect(() => {
    loadContainerData(selectedDay);
  }, [loadContainerData, selectedDay]);

  const tabs = [
    { label: 'Overview', value: 0 },
    { label: 'Environment & Recipes', value: 1 },
    { label: 'Inventory', value: 2 },
    { label: 'Devices', value: 3 },
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      navigate(`/containers/${containerId}`);
    } else {
      setActiveTab(newValue);
    }
  };

  const handleSubTabChange = (_: React.SyntheticEvent, newValue: string | number) => {
    setActiveSubTab(newValue as 'nursery' | 'cultivation');
  };

  const handleDaySelect = (dayIndex: number) => {
    setSelectedDay(dayIndex);
  };

  // Generate day labels for the timeline (60 days - 2 months)
  const generateDayLabels = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 59); // Start from 59 days ago
    
    const endDate = new Date(today);
    
    return {
      start: `${startDate.getDate().toString().padStart(2, '0')}\n${startDate.toLocaleDateString('en', { month: 'short' })}`,
      end: `${endDate.getDate().toString().padStart(2, '0')}\n${endDate.toLocaleDateString('en', { month: 'short' })}`
    };
  };

  const handleAddTray = (shelf: 'upper' | 'lower', slotNumber: number) => {
    setModalType('tray');
    setSelectedSlot({ shelf, slot: slotNumber });
    setModalLocation(`Shelf ${shelf.charAt(0).toUpperCase() + shelf.slice(1)}, Slot ${slotNumber}`);
    setShowAddModal(true);
  };

  // Note: handleAddPanel is used in cultivation area (not yet implemented)

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedSlot(null);
    setModalLocation('');
    setSuccessMessage(null);
  };

  const handleCropClick = (cropId: string) => {
    setSelectedCropId(cropId);
    setShowCropModal(true);
  };

  const handleCloseCropModal = () => {
    setShowCropModal(false);
    setSelectedCropId(null);
  };

  const handleProvisionAndPrint = () => {
    // Custom handler for provision and print action
    console.log(`Provisioning and printing ID for crop: ${selectedCropId}`);
    // You could show a success message or handle the action differently here
    handleCloseCropModal();
  };

  const handleSubmitProvision = async (data: TrayProvisionRequest | PanelProvisionRequest) => {
    if (!containerId || !selectedSlot) return;

    try {
      setSubmitting(true);
      
      if (modalType === 'tray' && selectedSlot.shelf) {
        const response: TrayProvisionResponse = await inventoryService.provisionTrayWithLocation(
          containerId,
          selectedSlot.shelf,
          selectedSlot.slot,
          data as TrayProvisionRequest
        );
        setSuccessMessage(response.message);
        // Refresh data to show the new tray
        await loadContainerData();
      } else if (modalType === 'panel' && selectedSlot.wall) {
        const response: PanelProvisionResponse = await inventoryService.provisionPanelWithLocation(
          containerId,
          selectedSlot.wall,
          selectedSlot.slot,
          data as PanelProvisionRequest
        );
        setSuccessMessage(response.message);
        // Refresh data to show the new panel
        await loadContainerData();
      }
      
      // Close modal after short delay to show success message
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (err) {
      console.error('Error provisioning:', err);
      setError(err instanceof Error ? err.message : 'Failed to provision item');
    } finally {
      setSubmitting(false);
    }
  };

  const renderTraySlot = (slot: TraySlot, shelf: 'upper' | 'lower') => {
    if (slot.occupied && slot.tray) {
      // Generate crop IDs for this tray
      const cropIds = Array.from({ length: slot.tray.crop_count }, (_, index) => 
        `${slot.tray!.id}-crop-${index + 1}`
      );
      
      return (
        <TrayGridviewCrops
          key={`${shelf}-slot-${slot.slot_number}`}
          sx={{
            width: '162px',
            height: '301px',
          }}
          title={`SLOT ${slot.slot_number}`}
          itemCode={slot.tray.id}
          value={slot.tray.utilization_percentage}
          rows={20}
          columns={10}
          gridSizeText="20x10 Grid"
          itemCount={slot.tray.crop_count}
          itemLabel="crops"
          onCropClick={handleCropClick}
          cropIds={cropIds}
        />
      );
    } else {
      return (
        <AddTraySlot
          key={`${shelf}-slot-${slot.slot_number}`}
          slotNumber={slot.slot_number}
          onClick={() => handleAddTray(shelf, slot.slot_number)}
        />
      );
    }
  };


  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading inventory data...</Typography>
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

  if (!containerData || !nurseryData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Container or inventory data not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header
        breadcrumb={`Container Management / ${containerData.name}`}
        title={containerData.name}
        metadata={`${containerData.type === 'PHYSICAL' ? 'Physical container' : 'Virtual container'} | ${containerData.tenant_name} | ${containerData.purpose}`}
        status={containerData.status === 'ACTIVE' ? 'active' : 'inactive'}
        tabs={tabs}
        selectedTab={activeTab}
        onTabChange={handleTabChange}
        onBackClick={() => navigate('/dashboard')}
      />

      <Box sx={{ 
        p: 3,
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        {/* Nursery Station Section */}
        <Box sx={{ mb: 4 }}>
          {/* Top Section with Utilization and View Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            {/* Left: Utilization */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Nursery Station
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  UTILIZATION:
                </Typography>
                <ProgressMeter value={nurseryData.utilization_percentage} width={200} />
              </Box>
            </Box>
            
            {/* Right: View Toggle */}
            <ViewToggleTabs
              value={activeSubTab}
              onChange={handleSubTabChange}
              options={[
                { label: 'Nursery Station', value: 'nursery' },
                { label: 'Cultivation Area', value: 'cultivation' }
              ]}
            />
          </Box>

          {/* Daily Timeline - 2 Months (60 days) */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 800 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Daily View - Last 2 Months
              </Typography>
              <TimelineComponent
                selectedTimepoint={selectedDay}
                onTimepointSelect={handleDaySelect}
                timepointCount={60}
                labels={generateDayLabels()}
              />
            </Box>
          </Box>

          {activeSubTab === 'nursery' && (
            <>
              {/* Upper Shelf */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Shelf Upper
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      UTILIZATION:
                    </Typography>
                    <ProgressMeter 
                      value={70} 
                      width={150}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 2,
                  justifyContent: 'flex-start' 
                }}>
                  {nurseryData.upper_shelf.slots.map((slot) => (
                    <Box key={`upper-${slot.slot_number}`} sx={{ width: 162, flexShrink: 0 }}>
                      {renderTraySlot(slot, 'upper')}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Lower Shelf */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Shelf Lower
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      UTILIZATION:
                    </Typography>
                    <ProgressMeter 
                      value={80} 
                      width={150}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 2,
                  justifyContent: 'flex-start' 
                }}>
                  {nurseryData.lower_shelf.slots.map((slot) => (
                    <Box key={`lower-${slot.slot_number}`} sx={{ width: 162, flexShrink: 0 }}>
                      {renderTraySlot(slot, 'lower')}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Currently Off the Shelf */}
              {nurseryData.off_shelf_trays.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Currently Off the Shelf(s)
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 2,
                    justifyContent: 'flex-start' 
                  }}>
                    {nurseryData.off_shelf_trays.map((tray, index) => {
                      // Generate crop IDs for this off-shelf tray
                      const cropIds = Array.from({ length: tray.crop_count }, (_, cropIndex) => 
                        `${tray.id}-crop-${cropIndex + 1}`
                      );
                      
                      return (
                        <Box key={`off-shelf-${index}`} sx={{ width: 162, flexShrink: 0 }}>
                          <TrayGridviewCrops
                            title="OFF SHELF"
                            itemCode={tray.id}
                            value={tray.utilization_percentage}
                            rows={20}
                            columns={10}
                            gridSizeText="20x10 Grid"
                            itemCount={tray.crop_count}
                            itemLabel="crops"
                            onCropClick={handleCropClick}
                            cropIds={cropIds}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </>
          )}

          {activeSubTab === 'cultivation' && cultivationData && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Cultivation Area view coming soon...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This will display the wall-mounted panel layout with utilization metrics.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Add Tray/Panel Modal */}
      <AddTrayPanel
        open={showAddModal}
        type={modalType}
        location={modalLocation}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProvision}
        loading={submitting}
      />

      {/* Crop Detail Modal */}
      {selectedCropId && containerId && (
        <CropDetailModal
          open={showCropModal}
          onClose={handleCloseCropModal}
          containerId={containerId}
          cropId={selectedCropId}
          onProvisionAndPrint={handleProvisionAndPrint}
        />
      )}
    </Box>
  );
};

export default ContainerInventoryPage;