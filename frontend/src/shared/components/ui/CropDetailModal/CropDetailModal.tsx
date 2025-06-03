import React, { useState, useEffect, useCallback } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TimelineControls from '../TimelineControls';
import TimelineComponent from '../TimelineComponent';
import { EnvironmentDashboard } from '../EnvironmentDashboard';
import FooterContainer from '../FooterContainer';
import { GrowthStageImage } from '../GrowthStageImage';
import { cropDetailService } from '../../../../services/cropDetailService';
import { inventoryService } from '../../../../services/inventoryService';

export interface CropDetailModalProps {
  open: boolean;
  onClose: () => void;
  containerId: string;
  cropId: string;
  cropData?: {
    id: string;
    seedType: string;
    age: number;
    imageSrc?: string;
    environmentData?: {
      areaData?: Array<[number, number]>;
      lightData?: Array<[number, number]>;
      waterData?: Array<[number, number]>;
      airTempData?: Array<[number, number]>;
      humidityData?: Array<[number, number]>;
      co2Data?: Array<[number, number]>;
      waterTempData?: Array<[number, number]>;
      phData?: Array<[number, number]>;
      ecData?: Array<[number, number]>;
    };
    generalInfo?: Record<string, any>;
    notes?: string;
    history?: Array<{
      date: string;
      event: string;
      description: string;
    }>;
  };
  onProvisionAndPrint?: () => void;
}

export const CropDetailModal: React.FC<CropDetailModalProps> = ({
  open,
  onClose,
  containerId,
  cropId,
  cropData,
  onProvisionAndPrint,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [playState, setPlayState] = useState<'playing' | 'paused'>('paused');
  const [selectedInterval, setSelectedInterval] = useState<number>(3);
  const [expandedSections, setExpandedSections] = useState<{
    generalInfo: boolean;
    notes: boolean;
    history: boolean;
  }>({
    generalInfo: false,
    notes: false,
    history: false,
  });
  
  // API state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropHistory, setCropHistory] = useState<unknown>(null);
  const [envData, setEnvData] = useState<unknown>(null);

  // Load crop data when modal opens
  useEffect(() => {
    if (open && cropId && containerId) {
      loadCropData();
    }
  }, [open, cropId, containerId]);

  const loadCropData = useCallback(async () => {
    if (!cropId || !containerId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load crop history
      const history = await inventoryService.getCropHistory(containerId, cropId);
      setCropHistory(history);
      
      // Load environmental data if available
      try {
        const envData = await cropDetailService.getCropEnvironmentData(containerId, cropId);
        setEnvData(envData);
      } catch (envError) {
        console.warn('Environmental data not available:', envError);
        // Environmental data is optional, so don't fail the entire load
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load crop data';
      setError(errorMessage);
      console.error('Error loading crop data:', err);
    } finally {
      setLoading(false);
    }
  }, [cropId, containerId]);

  const handlePlayPause = () => {
    setPlayState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  const handleSectionToggle = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleProvisionAndPrint = async () => {
    if (!cropId || !containerId) return;
    
    try {
      setLoading(true);
      const response = await cropDetailService.provisionAndPrintCropId(containerId, cropId);
      console.log('Provision response:', response);
      
      if (onProvisionAndPrint) {
        onProvisionAndPrint();
      }
      
      // Show success message or handle response
      alert(`Successfully provisioned crop ID ${cropId}. Print job ID: ${response.printJobId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to provision and print crop ID';
      console.error('Error provisioning crop:', err);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Default sample data matching the Figma design
  const defaultEnvironmentData = {
    areaData: [[0, 0], [50, 0.0002], [100, 0.0003], [150, 0.0004], [200, 0.0004], [250, 0.0012]] as Array<[number, number]>,
    lightData: [[0, 0], [50, 40], [100, 80], [150, 120], [200, 160], [250, 220], [270, 270]] as Array<[number, number]>,
    waterData: [[0, 0], [50, 5], [100, 10], [150, 15], [200, 20], [250, 25], [270, 29]] as Array<[number, number]>,
    airTempData: [[0, 21.0], [50, 20.9], [100, 21.1], [150, 21.0], [200, 21.2], [250, 21.1], [270, 21.2]] as Array<[number, number]>,
    humidityData: [[0, 65], [50, 64], [100, 66], [150, 65], [200, 67], [250, 69], [270, 70]] as Array<[number, number]>,
    co2Data: [[0, 900], [50, 910], [100, 905], [150, 900], [200, 895], [250, 890], [270, 897]] as Array<[number, number]>,
    waterTempData: [[0, 21.0], [50, 20.6], [100, 20.8], [150, 21.0], [200, 20.9], [250, 21.1], [270, 21.1]] as Array<[number, number]>,
    phData: [[0, 6.5], [50, 6.1], [100, 6.3], [150, 6.2], [200, 6.4], [250, 6.3], [270, 6.3]] as Array<[number, number]>,
    ecData: [[0, 1.8], [50, 1.7], [100, 1.9], [150, 1.8], [200, 1.9], [250, 1.8], [270, 1.9]] as Array<[number, number]>,
  };

  const environmentData = (envData as typeof defaultEnvironmentData) || cropData?.environmentData || defaultEnvironmentData;
  const age = cropData?.age || 4;
  const imageSrc = cropData?.imageSrc || '/images/default-crop.jpg'; // Placeholder image
  
  // Convert crop history format for display
  const historyForDisplay = (cropHistory as { history?: Array<{ date: string; event: string; notes?: string }> })?.history?.map((event) => ({
    date: event.date,
    event: event.event,
    description: event.notes || `${event.event} event`,
  })) || cropData?.history || [];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : isTablet ? '90%' : '480px',
          maxWidth: isMobile ? '100%' : '480px',
          height: '100%',
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing(2, 3),
            borderBottom: '1px solid #E4E4E7',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 600,
              fontSize: isMobile ? '18px' : '22px',
              color: '#000000',
              letterSpacing: '-0.75px',
              lineHeight: isMobile ? '24px' : '36px',
            }}
          >
            Crop ID: {cropId}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: '#323232',
              padding: theme.spacing(0.5),
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Loading and Error States */}
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: theme.spacing(4),
            }}
          >
            <CircularProgress />
          </Box>
        )}
        
        {error && (
          <Box sx={{ padding: theme.spacing(2) }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Scrollable Content */}
        {!loading && !error && (
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              padding: theme.spacing(0, 3, 2, 3),
              backgroundColor: '#FFFFFF',
            }}
          >
          {/* Crop Image Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(2),
              marginBottom: theme.spacing(3),
              marginTop: theme.spacing(2),
            }}
          >
            {/* Crop Image - Full width */}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing(1),
              }}
            >
              {/* Crop Image Container - Rectangular aspect ratio */}
              <Box
                sx={{
                  width: '100%',
                  aspectRatio: '4/3', // Maintains rectangular shape
                  minHeight: isMobile ? '200px' : '240px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E7EBF2',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              >
                <GrowthStageImage
                  imageSrc={imageSrc}
                  age=""
                  width="100%"
                  height="100%"
                  borderRadius={4}
                />
              </Box>
              
              {/* Age Display - Centered below image */}
              <Typography
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: '#09090B',
                  letterSpacing: '0px',
                  lineHeight: '16px',
                  textAlign: 'center',
                }}
              >
                Age: {age}d
              </Typography>
            </Box>

            {/* Timeline Controls Section - Below image */}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing(2),
              }}
            >
              {/* Play Controls */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <TimelineControls
                  playState={playState}
                  onPlayPauseClick={handlePlayPause}
                  onPreviousClick={() => setSelectedInterval(Math.max(0, selectedInterval - 1))}
                  onNextClick={() => setSelectedInterval(Math.min(13, selectedInterval + 1))}
                  onRepeatClick={() => setSelectedInterval(0)}
                />
              </Box>

              {/* Timeline Component - Full width, 2 weeks span */}
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'stretch',
                }}
              >
                <TimelineComponent
                  selectedTimepoint={selectedInterval}
                  onTimepointSelect={setSelectedInterval}
                  labels={{ start: '01\nApr', end: '14\nApr' }}
                  timepointCount={14}
                  fullWidth={true}
                />
              </Box>
            </Box>
          </Box>


          {/* Environmental Dashboard */}
          <Box sx={{ marginBottom: theme.spacing(3) }}>
            <EnvironmentDashboard
              width="100%"
              areaData={environmentData.areaData}
              lightData={environmentData.lightData}
              waterData={environmentData.waterData}
              airTempData={environmentData.airTempData}
              humidityData={environmentData.humidityData}
              co2Data={environmentData.co2Data}
              waterTempData={environmentData.waterTempData}
              phData={environmentData.phData}
              ecData={environmentData.ecData}
            />
          </Box>

          {/* Collapsible Sections */}
          <Box sx={{ marginBottom: theme.spacing(2) }}>
            {/* General Info */}
            <Accordion
              expanded={expandedSections.generalInfo}
              onChange={() => handleSectionToggle('generalInfo')}
              sx={{
                boxShadow: 'none',
                border: '1px solid #E4E4E7',
                borderRadius: '4px !important',
                marginBottom: theme.spacing(1),
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#49454F' }} />}
                sx={{
                  backgroundColor: '#FFFFFF',
                  minHeight: '48px',
                  '& .MuiAccordionSummary-content': {
                    margin: '12px 0',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: '#09090B',
                    letterSpacing: '0px',
                    lineHeight: '16px',
                    textAlign: 'center',
                  }}
                >
                  General info
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: theme.spacing(2) }}>
                <Typography sx={{ color: '#666' }}>
                  {cropData?.generalInfo ? 
                    Object.entries(cropData.generalInfo).map(([key, value]) => (
                      <Box key={key} sx={{ marginBottom: 1 }}>
                        <strong>{key}:</strong> {String(value)}
                      </Box>
                    ))
                    : 'No general information available.'}
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* Notes */}
            <Accordion
              expanded={expandedSections.notes}
              onChange={() => handleSectionToggle('notes')}
              sx={{
                boxShadow: 'none',
                border: '1px solid #E4E4E7',
                borderRadius: '4px !important',
                marginBottom: theme.spacing(1),
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#49454F' }} />}
                sx={{
                  backgroundColor: '#FFFFFF',
                  minHeight: '48px',
                  '& .MuiAccordionSummary-content': {
                    margin: '12px 0',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: '#09090B',
                    letterSpacing: '0px',
                    lineHeight: '16px',
                    textAlign: 'center',
                  }}
                >
                  Notes
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: theme.spacing(2) }}>
                <Typography sx={{ color: '#666' }}>
                  {cropData?.notes || 'No notes available.'}
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* History */}
            <Accordion
              expanded={expandedSections.history}
              onChange={() => handleSectionToggle('history')}
              sx={{
                boxShadow: 'none',
                border: '1px solid #E4E4E7',
                borderRadius: '4px !important',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#49454F' }} />}
                sx={{
                  backgroundColor: '#FFFFFF',
                  minHeight: '48px',
                  '& .MuiAccordionSummary-content': {
                    margin: '12px 0',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: '#09090B',
                    letterSpacing: '0px',
                    lineHeight: '16px',
                    textAlign: 'center',
                  }}
                >
                  History
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: theme.spacing(2) }}>
                {historyForDisplay && historyForDisplay.length > 0 ? (
                  <Box>
                    {historyForDisplay.map((entry, index) => (
                      <Box key={index} sx={{ marginBottom: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {entry.date} - {entry.event}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {entry.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ color: '#666' }}>
                    No history available.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>

        )}

        {/* Footer */}
        <FooterContainer
          primaryActionLabel="Provision & Print ID"
          secondaryActionLabel="Close"
          onPrimaryAction={handleProvisionAndPrint}
          onSecondaryAction={onClose}
          primaryActionDisabled={loading}
          sx={{
            borderTop: '1px solid #E4E4E7',
            marginTop: 'auto',
          }}
        />
      </Box>
    </Drawer>
  );
};

export default CropDetailModal;