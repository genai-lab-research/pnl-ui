import React, { useState, useEffect } from 'react';
import {
  Typography,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  StyledDialog,
  StyledDialogContent,
  HeaderContainer,
  CropImageContainer,
  TimelineControls,
  MetricsContainer,
  AccordionSection,
  CloseButtonContainer,
} from './CropDetailModal.styles';
import { CropDetailModalProps } from './CropDetailModal.types';
import { VerticalFarmingGenerationTimelineBlock } from '../VerticalFarmingGenerationTimelineBlock';
import { VerticalFarmingGenerationBlock } from '../../../components/VerticalFarmingGenerationBlock';
import MediaControlButtonSet from '../MediaControlButtonSet';
import { VerticalFarmingGeneralInfoBlock } from '../VerticalFarmingGeneralInfoBlock';
import { inventoryService } from '../../../../api';
import { Crop } from '../../../../types/inventory';


// Removed mock metrics - using API data only

const CropDetailModal: React.FC<CropDetailModalProps> = ({ open, onClose, crop, cropId, containerId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(14); // Default to day 15 (index 14)
  const [cropDetails, setCropDetails] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInfoBlockClick = (panel: string) => {
    setExpandedAccordion(expandedAccordion === panel ? false : panel);
  };

  // Fetch crop details when modal opens and we have the required IDs
  useEffect(() => {
    const fetchCropDetails = async () => {
      if (!containerId || !cropId || !open) return;
      
      setLoading(true);
      try {
        const response = await inventoryService.getCropDetails(containerId, cropId);
        if (response.data && !response.error) {
          setCropDetails(response.data);
        } else {
          console.error('Failed to fetch crop details:', response.error);
        }
      } catch (error) {
        console.error('Error fetching crop details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCropDetails();
  }, [containerId, cropId, open]);


  const displayCropId = cropId || (crop ? `20250401-143548-${crop.id}` : '20250401-143548-A001');

  // Use fetched data if available, fallback to prop data
  const activeCrop = cropDetails || crop;

  console.log('CropDetailModal Debug:', {
    activeCrop,
    cropDetails,
    crop,
    hasRecentMetrics: !!activeCrop?.recent_metrics,
    metricsCount: activeCrop?.metrics?.length,
    containerId,
    cropId
  })

  // Get the most recent metrics from the metrics array if recent_metrics is not available
  const mostRecentMetrics = activeCrop?.recent_metrics || 
    (activeCrop?.metrics && activeCrop.metrics.length > 0 ? activeCrop.metrics[0] : null);

  // Create comprehensive metrics data from crop metrics for display
  const metricsData = mostRecentMetrics ? [
    // Growth Metrics
    {
      name: 'Height',
      unit: 'cm',
      currentValue: mostRecentMetrics.height_cm || 0,
      minValue: 0,
      maxValue: Math.max(activeCrop.statistics?.max_recorded_height || 20, 20),
      data: activeCrop.metrics?.map((metric) => ({
        date: new Date(metric.recorded_at).toLocaleDateString(),
        value: metric.height_cm || 0
      })) || []
    },
    {
      name: 'Health Score',
      unit: '%',
      currentValue: mostRecentMetrics.health_score || 0,
      minValue: 0,
      maxValue: 100,
      data: activeCrop.metrics?.map((metric) => ({
        date: new Date(metric.recorded_at).toLocaleDateString(),
        value: metric.health_score || 0
      })) || []
    },
    {
      name: 'Leaf Count',
      unit: '',
      currentValue: mostRecentMetrics.leaf_count || 0,
      minValue: 0,
      maxValue: Math.max(...(activeCrop.metrics?.map(m => m.leaf_count || 0) || [30]), 30),
      data: activeCrop.metrics?.map((metric) => ({
        date: new Date(metric.recorded_at).toLocaleDateString(),
        value: metric.leaf_count || 0
      })) || []
    },
    {
      name: 'Biomass',
      unit: 'g',
      currentValue: mostRecentMetrics.biomass_g || 0,
      minValue: 0,
      maxValue: Math.max(...(activeCrop.metrics?.map(m => m.biomass_g || 0) || [100]), 100),
      data: activeCrop.metrics?.map((metric) => ({
        date: new Date(metric.recorded_at).toLocaleDateString(),
        value: metric.biomass_g || 0
      })) || []
    },
    // Environmental Metrics
    {
      name: 'Temperature',
      unit: '°C',
      currentValue: mostRecentMetrics.temperature_c || 0,
      minValue: 15,
      maxValue: 30,
      data: activeCrop.metrics?.map((metric) => ({
        date: new Date(metric.recorded_at).toLocaleDateString(),
        value: metric.temperature_c || 0
      })) || []
    },
    {
      name: 'Humidity',
      unit: '%',
      currentValue: mostRecentMetrics.humidity_percent || 0,
      minValue: 40,
      maxValue: 90,
      data: activeCrop.metrics?.map((metric) => ({
        date: new Date(metric.recorded_at).toLocaleDateString(),
        value: metric.humidity_percent || 0
      })) || []
    },
    {
      name: 'Light Intensity',
      unit: 'μmol/m²/s',
      currentValue: mostRecentMetrics.light_intensity_umol || 0,
      minValue: 0,
      maxValue: 400,
      data: activeCrop.metrics?.map((metric) => ({
        date: new Date(metric.recorded_at).toLocaleDateString(),
        value: metric.light_intensity_umol || 0
      })) || []
    },
    {
      name: 'pH Level',
      unit: '',
      currentValue: mostRecentMetrics.ph_level || 0,
      minValue: 5.5,
      maxValue: 7.5,
      data: activeCrop.metrics?.map((metric) => ({
        date: new Date(metric.recorded_at).toLocaleDateString(),
        value: metric.ph_level || 0
      })) || []
    },
    // Stress & Health Metrics
    {
      name: 'Stress Level',
      unit: '%',
      currentValue: mostRecentMetrics.stress_level || 0,
      minValue: 0,
      maxValue: 100,
      data: activeCrop.metrics?.map((metric) => ({
        date: new Date(metric.recorded_at).toLocaleDateString(),
        value: metric.stress_level || 0
      })) || []
    }
  ] : [];

  // When used in a Drawer, we don't need the Dialog wrapper
  const content = (
    <>
      <HeaderContainer>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Crop ID: {displayCropId}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </HeaderContainer>

      <StyledDialogContent>
        <CropImageContainer>
          <img
            src={(crop?.image) || `https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=532&h=320&fit=crop`}
            alt={activeCrop?.seed_type || 'Crop'}
            style={{ objectFit: 'cover' }}
          />
        </CropImageContainer>

        <TimelineControls>
          <MediaControlButtonSet
            onPreviousClick={() => {
              const newIndex = Math.max(0, selectedDayIndex - 1);
              setSelectedDayIndex(newIndex);
            }}
            onPlayClick={() => setIsPlaying(!isPlaying)}
            onRepeatClick={() => {
              // Handle repeat functionality
              console.log('Repeat clicked');
            }}
            onNextClick={() => {
              const newIndex = Math.min(14, selectedDayIndex + 1);
              setSelectedDayIndex(newIndex);
            }}
          />
        </TimelineControls>

        <Box sx={{ 
          padding: '16px 24px', 
          backgroundColor: '#FFFFFF', 
          borderBottom: '1px solid #E0E0E0',
          '& > div': {
            width: '100%'
          }
        }}>
          <VerticalFarmingGenerationTimelineBlock
            data={Array(15).fill(0).map((_, i) => i * 6.67)} // 15 days of data
            startDateLabel="01 Apr"
            endDateLabel="15 Apr"
            tooltipDate={`April ${selectedDayIndex + 1}`}
            selectedBarIndices={[selectedDayIndex]}
          />
        </Box>

        <Box sx={{ padding: 3 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Age: {activeCrop?.age || 0}d
            {mostRecentMetrics && (
              <>
                {' | '}
                Current Height: {mostRecentMetrics.height_cm || 'N/A'}cm
                {' | '}
                Health: {mostRecentMetrics.health_score || 'N/A'}%
              </>
            )}
          </Typography>
          {loading && (
            <Typography variant="body2" color="textSecondary">
              Loading crop details...
            </Typography>
          )}
        </Box>

        <MetricsContainer>
          {metricsData.length > 0 ? (
            metricsData.map((metric) => (
              <Box key={metric.name} sx={{ mb: 2, width: '100%' }}>
                <VerticalFarmingGenerationBlock
                  areaLabel={metric.name}
                  areaUnit={metric.unit}
                  leftValue={metric.minValue.toString()}
                  rightValue={metric.currentValue.toString()}
                  alertValue={metric.currentValue > metric.maxValue * 0.9 ? metric.currentValue.toString() : undefined}
                  graphData={metric.data.map(d => d.value)}
                />
              </Box>
            ))
          ) : (
            <Box sx={{ padding: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                {loading ? 'Loading metrics...' : 'No metrics data available for this crop.'}
              </Typography>
            </Box>
          )}
        </MetricsContainer>

        <AccordionSection>
          <VerticalFarmingGeneralInfoBlock
            title="General info"
            isExpanded={expandedAccordion === 'general'}
            onClick={() => handleInfoBlockClick('general')}
          />
          {expandedAccordion === 'general' && (
            <Box sx={{ padding: '16px 24px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0' }}>
              <Typography variant="body2">
                <strong>Basic Information:</strong>
                <br />
                Seed Type: {activeCrop?.seed_type || 'N/A'}
                <br />
                Status: {activeCrop?.status || 'N/A'}
                <br />
                Age: {activeCrop?.age || 0} days
                <br />
                Seeded: {activeCrop?.seed_date ? new Date(activeCrop.seed_date).toLocaleDateString() : 'N/A'}
                <br />
                Planned Harvest: {activeCrop?.harvesting_date_planned ? new Date(activeCrop.harvesting_date_planned).toLocaleDateString() : 'N/A'}
                
                {activeCrop?.statistics && (
                  <>
                    <br /><br />
                    <strong>Growth Statistics:</strong>
                    <br />
                    Growth Stage: {activeCrop.statistics.growth_stage || 'N/A'}
                    <br />
                    Variety: {activeCrop.statistics.variety || 'N/A'}
                    <br />
                    Daily Growth Rate: {activeCrop.statistics.avg_daily_growth_rate || 'N/A'} cm/day
                    <br />
                    Max Height: {activeCrop.statistics.max_recorded_height || 'N/A'} cm
                    
                    <br /><br />
                    <strong>Predicted Metrics:</strong>
                    <br />
                    Predicted Yield: {activeCrop.statistics.predicted_yield_g || 'N/A'}g
                    <br />
                    Harvest in: {activeCrop.statistics.time_to_harvest_days || 'N/A'} days
                    <br />
                    Quality Score: {activeCrop.statistics.yield_quality_score || 'N/A'}%
                    
                    <br /><br />
                    <strong>Health & Efficiency:</strong>
                    <br />
                    Health Trend: {activeCrop.statistics.overall_health_trend || 'N/A'}
                    <br />
                    Survival Rate: {activeCrop.statistics.survival_rate || 'N/A'}%
                    <br />
                    Resource Efficiency: {activeCrop.statistics.resource_efficiency || 'N/A'}%
                    
                    <br /><br />
                    <strong>Cultivation Details:</strong>
                    <br />
                    Method: {activeCrop.statistics.cultivation_method || 'N/A'}
                    <br />
                    Fertilizer Program: {activeCrop.statistics.fertilizer_program || 'N/A'}
                    <br />
                    Irrigation: {activeCrop.statistics.irrigation_schedule || 'N/A'}
                  </>
                )}
              </Typography>
            </Box>
          )}

          <VerticalFarmingGeneralInfoBlock
            title="Notes"
            isExpanded={expandedAccordion === 'notes'}
            onClick={() => handleInfoBlockClick('notes')}
          />
          {expandedAccordion === 'notes' && (
            <Box sx={{ padding: '16px 24px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0' }}>
              <Typography variant="body2">
                <strong>Cultivation Notes:</strong>
                <br />
                {activeCrop?.statistics?.cultivation_notes || 'No cultivation notes available.'}
                
                {activeCrop?.statistics?.special_observations && (
                  <>
                    <br /><br />
                    <strong>Special Observations:</strong>
                    <br />
                    {activeCrop.statistics.special_observations}
                  </>
                )}
                
                {activeCrop?.statistics?.harvest_notes && (
                  <>
                    <br /><br />
                    <strong>Harvest Notes:</strong>
                    <br />
                    {activeCrop.statistics.harvest_notes}
                  </>
                )}

                {activeCrop?.statistics?.genetic_traits && (
                  <>
                    <br /><br />
                    <strong>Genetic Traits:</strong>
                    <br />
                    Growth Habit: {activeCrop.statistics.genetic_traits.growth_habit || 'N/A'}
                    <br />
                    Cold Tolerance: {activeCrop.statistics.genetic_traits.cold_tolerance || 'N/A'}
                    <br />
                    Disease Resistance Genes: {activeCrop.statistics.genetic_traits.disease_resistance_genes || 'N/A'}
                  </>
                )}

                {activeCrop?.statistics && (
                  <>
                    <br /><br />
                    <strong>Resistances & Tolerances:</strong>
                    <br />
                    Disease Resistance: {activeCrop.statistics.disease_resistance || 'N/A'}%
                    <br />
                    Pest Resistance: {activeCrop.statistics.pest_resistance || 'N/A'}%
                    <br />
                    Temperature Tolerance: {activeCrop.statistics.temperature_tolerance || 'N/A'}%
                    <br />
                    Humidity Tolerance: {activeCrop.statistics.humidity_tolerance || 'N/A'}%
                    <br />
                    Light Efficiency: {activeCrop.statistics.light_efficiency || 'N/A'}%
                  </>
                )}
              </Typography>
            </Box>
          )}

          <VerticalFarmingGeneralInfoBlock
            title="History"
            isExpanded={expandedAccordion === 'history'}
            onClick={() => handleInfoBlockClick('history')}
          />
          {expandedAccordion === 'history' && (
            <Box sx={{ padding: '16px 24px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0' }}>
              <Typography variant="body2">
                {activeCrop?.metrics && activeCrop.metrics.length > 0 ? (
                  <>
                    <strong>Recent Metrics History ({activeCrop.metrics.length} entries):</strong>
                    <br />
                    {activeCrop.metrics.slice(0, 4).map((metric) => (
                      <div key={metric.id} style={{ marginTop: '12px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <strong>{new Date(metric.recorded_at).toLocaleDateString()} {new Date(metric.recorded_at).toLocaleTimeString()}</strong>
                        <br />
                        
                        <strong>Growth:</strong> Height {metric.height_cm || 'N/A'}cm | Leaves {metric.leaf_count || 'N/A'} | Biomass {metric.biomass_g || 'N/A'}g
                        <br />
                        
                        <strong>Health:</strong> Score {metric.health_score || 'N/A'}% | Stress {metric.stress_level || 'N/A'}%
                        {metric.disease_detected && ' | Disease Detected!'}
                        {metric.pest_detected && ' | Pest Detected!'}
                        <br />
                        
                        <strong>Environment:</strong> {metric.temperature_c || 'N/A'}°C | {metric.humidity_percent || 'N/A'}% RH | pH {metric.ph_level || 'N/A'}
                        <br />
                        
                        <strong>Light:</strong> {metric.light_intensity_umol || 'N/A'} μmol/m²/s
                        <br />
                        
                        <strong>Nutrients:</strong> N:{metric.nitrogen_ppm || 'N/A'} | P:{metric.phosphorus_ppm || 'N/A'} | K:{metric.potassium_ppm || 'N/A'} ppm
                      </div>
                    ))}
                    {activeCrop.metrics.length > 4 && (
                      <div style={{ marginTop: '12px', fontStyle: 'italic', textAlign: 'center' }}>
                        ...and {activeCrop.metrics.length - 4} more detailed entries
                      </div>
                    )}
                    
                    {activeCrop.statistics?.nutritional_content && (
                      <>
                        <br /><br />
                        <strong>Nutritional Content Analysis:</strong>
                        <br />
                        Vitamin C: {activeCrop.statistics.nutritional_content.vitamin_c_mg || 'N/A'} mg
                        <br />
                        Iron: {activeCrop.statistics.nutritional_content.iron_mg || 'N/A'} mg
                        <br />
                        Calcium: {activeCrop.statistics.nutritional_content.calcium_mg || 'N/A'} mg
                        <br />
                        Protein: {activeCrop.statistics.nutritional_content.protein_g || 'N/A'} g
                      </>
                    )}

                    {activeCrop.statistics?.taste_profile && (
                      <>
                        <br /><br />
                        <strong>Taste Profile:</strong>
                        <br />
                        Sweetness: {activeCrop.statistics.taste_profile.sweetness || 'N/A'}/5
                        <br />
                        Bitterness: {activeCrop.statistics.taste_profile.bitterness || 'N/A'}/5
                        <br />
                        Texture: {activeCrop.statistics.taste_profile.texture || 'N/A'}
                        <br />
                        Flavor Intensity: {activeCrop.statistics.taste_profile.flavor_intensity || 'N/A'}/5
                      </>
                    )}
                  </>
                ) : (
                  'No metrics history available.'
                )}
              </Typography>
            </Box>
          )}
        </AccordionSection>

        <CloseButtonContainer>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: 'none',
              borderColor: '#2196F3',
              color: '#2196F3',
              width: '100%',
              maxWidth: '480px',
              '&:hover': {
                borderColor: '#1976D2',
                backgroundColor: 'rgba(33, 150, 243, 0.04)',
              },
            }}
          >
            Close
          </Button>
        </CloseButtonContainer>
      </StyledDialogContent>
    </>
  );

  // If open prop is false, return the content directly (for use in Drawer)
  // Otherwise, wrap in Dialog for backward compatibility
  if (!open) {
    return content;
  }

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md">
      {content}
    </StyledDialog>
  );
};

export default CropDetailModal;