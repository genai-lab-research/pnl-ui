import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { background, border, status, shadow } from '../../../styles/colors';

export const StyledPanelBlock = styled(Box)(() => ({
  backgroundColor: background.primary,
  border: `1px solid ${border.secondary}`,
  borderRadius: '8px',
  padding: '16px',
  width: '100%',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: `0 4px 6px -1px ${shadow.light}, 0 2px 4px -1px ${shadow.card}`,
  },
}));

export const PanelHeader = styled(Box)<{ utilization: number }>(({ utilization }) => ({
  backgroundColor: utilization > 80 ? status.error : utilization > 60 ? status.warningAlt : status.successAlt,
  color: background.primary,
  padding: '8px 12px',
  borderRadius: '4px',
  marginBottom: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const ChannelContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '8px',
});

export const Channel = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px',
  backgroundColor: background.overlay,
  borderRadius: '4px',
});

export const CropCircle = styled(Box)<{ size: 'small' | 'medium' | 'large'; status: 'healthy' | 'overdue' }>(
  ({ size, status: cropStatus }) => ({
    width: size === 'small' ? '12px' : size === 'medium' ? '16px' : '20px',
    height: size === 'small' ? '12px' : size === 'medium' ? '16px' : '20px',
    borderRadius: '50%',
    backgroundColor: cropStatus === 'healthy' ? status.successAlt : status.warningAlt,
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.2)',
    },
  })
);