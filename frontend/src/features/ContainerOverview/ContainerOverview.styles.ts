import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const StyledHeader = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #E4E4E7',
  padding: theme.spacing(3, 0),
  position: 'sticky',
  top: 0,
  zIndex: 1000,
}));

export const StyledNavigation = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
}));

export const StyledContainerTitle = styled(Typography)(() => ({
  fontFamily: 'Roboto, sans-serif',
  fontSize: '24px',
  fontWeight: 700,
  lineHeight: '32px',
  color: '#09090B',
}));

export const StyledMetricsSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E4E7',
  borderRadius: '8px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

export const StyledCropsSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E4E7',
  borderRadius: '8px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

export const StyledInfoSection = styled(Box)(() => ({
  '& .MuiGrid-item': {
    display: 'flex',
  },
  '& .MuiGrid-item > *': {
    flex: 1,
  },
}));