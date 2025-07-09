import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const StyledMetricCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E4E7',
  borderRadius: '8px',
  height: '120px',
  flex: 1,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
}));

export const StyledMetricValue = styled(Typography)(() => ({
  fontFamily: 'Roboto, sans-serif',
  fontSize: '24px',
  fontWeight: 700,
  lineHeight: '32px',
  color: '#09090B',
  textAlign: 'center',
}));

export const StyledMetricLabel = styled(Typography)(() => ({
  fontFamily: 'Roboto, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px',
  color: '#49454F',
  textAlign: 'center',
}));