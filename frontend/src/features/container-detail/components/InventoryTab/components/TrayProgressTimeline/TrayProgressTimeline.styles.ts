import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const TimelineContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

export const TimelineBar = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '8px',
  backgroundColor: theme.palette.grey[300],
  borderRadius: '4px',
  overflow: 'visible',
}));

interface TimelineProgressProps {
  width: number;
}

export const TimelineProgress = styled(Box)<TimelineProgressProps>(({ theme, width }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  width: `${width}%`,
  backgroundColor: theme.palette.success.main,
  borderRadius: '4px',
  transition: 'width 0.3s ease',
}));

interface TimelineMarkerProps {
  position: number;
}

export const TimelineMarker = styled(Box)<TimelineMarkerProps>(({ theme, position }) => ({
  position: 'absolute',
  left: `${position}%`,
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: '16px',
  height: '16px',
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  border: `3px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[2],
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translate(-50%, -50%) scale(1.2)',
  },
}));

export const TimelineLabels = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(1),
  position: 'relative',
  minHeight: '20px',
}));