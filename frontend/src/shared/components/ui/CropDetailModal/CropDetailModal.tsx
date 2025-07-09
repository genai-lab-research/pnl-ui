import React, { useState } from 'react';
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
import { CropDetailModalProps, MetricData } from './CropDetailModal.types';
import { VerticalFarmingGenerationTimelineBlock } from '../VerticalFarmingGenerationTimelineBlock';
import { VerticalFarmingGenerationBlock } from '../../../components/VerticalFarmingGenerationBlock';
import MediaControlButtonSet from '../MediaControlButtonSet';
import { VerticalFarmingGeneralInfoBlock } from '../VerticalFarmingGeneralInfoBlock';


const mockMetrics: MetricData[] = [
  {
    name: 'Area',
    unit: 'm²',
    currentValue: 0.0012,
    minValue: 0.0,
    maxValue: 0.0012,
    data: [
      { date: '01 Apr', value: 0.0004 },
      { date: '04 Apr', value: 0.0008 },
      { date: '08 Apr', value: 0.001 },
      { date: '12 Apr', value: 0.0011 },
      { date: '15 Apr', value: 0.0012 },
    ],
  },
  {
    name: 'Light',
    unit: 'h, accum',
    currentValue: 270,
    minValue: 0.0,
    maxValue: 270,
    data: [
      { date: '01 Apr', value: 0 },
      { date: '04 Apr', value: 72 },
      { date: '08 Apr', value: 144 },
      { date: '12 Apr', value: 216 },
      { date: '15 Apr', value: 270 },
    ],
  },
  {
    name: 'Water',
    unit: 'h, accum',
    currentValue: 29,
    minValue: 0.0,
    maxValue: 29,
    data: [
      { date: '01 Apr', value: 0 },
      { date: '04 Apr', value: 8 },
      { date: '08 Apr', value: 16 },
      { date: '12 Apr', value: 24 },
      { date: '15 Apr', value: 29 },
    ],
  },
  {
    name: 'Air, t',
    unit: '°C',
    currentValue: 21.2,
    minValue: 20.9,
    maxValue: 21.2,
    data: [
      { date: '01 Apr', value: 21.0 },
      { date: '04 Apr', value: 20.9 },
      { date: '08 Apr', value: 21.1 },
      { date: '12 Apr', value: 21.0 },
      { date: '15 Apr', value: 21.2 },
    ],
  },
  {
    name: 'Humidity',
    unit: '% RH',
    currentValue: 70.1,
    minValue: 65,
    maxValue: 70.1,
    data: [
      { date: '01 Apr', value: 65 },
      { date: '04 Apr', value: 64 },
      { date: '08 Apr', value: 66 },
      { date: '12 Apr', value: 68 },
      { date: '15 Apr', value: 70.1 },
    ],
  },
  {
    name: 'CO₂',
    unit: 'ppm',
    currentValue: 897,
    minValue: 897,
    maxValue: 900,
    data: [
      { date: '01 Apr', value: 900 },
      { date: '04 Apr', value: 900 },
      { date: '08 Apr', value: 898 },
      { date: '12 Apr', value: 899 },
      { date: '15 Apr', value: 897 },
    ],
  },
  {
    name: 'Water, t',
    unit: '°C',
    currentValue: 21.1,
    minValue: 20.6,
    maxValue: 21.1,
    data: [
      { date: '01 Apr', value: 21.0 },
      { date: '04 Apr', value: 20.6 },
      { date: '08 Apr', value: 20.8 },
      { date: '12 Apr', value: 21.0 },
      { date: '15 Apr', value: 21.1 },
    ],
  },
  {
    name: 'pH',
    unit: '',
    currentValue: 6.3,
    minValue: 6.1,
    maxValue: 6.5,
    data: [
      { date: '01 Apr', value: 6.5 },
      { date: '04 Apr', value: 6.1 },
      { date: '08 Apr', value: 6.2 },
      { date: '12 Apr', value: 6.3 },
      { date: '15 Apr', value: 6.3 },
    ],
  },
  {
    name: 'EC',
    unit: 'mS/cm',
    currentValue: 1.9,
    minValue: 1.7,
    maxValue: 1.9,
    data: [
      { date: '01 Apr', value: 1.8 },
      { date: '04 Apr', value: 1.7 },
      { date: '08 Apr', value: 1.8 },
      { date: '12 Apr', value: 1.85 },
      { date: '15 Apr', value: 1.9 },
    ],
  },
];

const CropDetailModal: React.FC<CropDetailModalProps> = ({ open, onClose, crop, cropId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(14); // Default to day 15 (index 14)

  const handleInfoBlockClick = (panel: string) => {
    setExpandedAccordion(expandedAccordion === panel ? false : panel);
  };


  const displayCropId = cropId || (crop ? `20250401-143548-${crop.id}` : '20250401-143548-A001');

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
            src={crop?.image || `https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=532&h=320&fit=crop`}
            alt={crop?.seed_type || 'Crop'}
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
            Age: {crop?.age || 4}d
          </Typography>
        </Box>

        <MetricsContainer>
          {mockMetrics.map((metric) => (
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
          ))}
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
                Seed Type: {crop?.seed_type || 'Kale'}
                <br />
                Status: {crop?.status || 'Growing'}
                <br />
                Seeded Date: {crop?.seed_date ? new Date(crop.seed_date).toLocaleDateString() : '6/17/2025'}
                <br />
                Planned Harvest: {crop?.harvesting_date_planned ? new Date(crop.harvesting_date_planned).toLocaleDateString() : '6/24/2025'}
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
              <Typography variant="body2">No notes available.</Typography>
            </Box>
          )}

          <VerticalFarmingGeneralInfoBlock
            title="History"
            isExpanded={expandedAccordion === 'history'}
            onClick={() => handleInfoBlockClick('history')}
          />
          {expandedAccordion === 'history' && (
            <Box sx={{ padding: '16px 24px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0' }}>
              <Typography variant="body2">No history available.</Typography>
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