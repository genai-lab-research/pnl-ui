import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledContainerListSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: theme.spacing(3),
  boxShadow: '0 2px 4px rgba(65, 64, 69, 0.1)',
}));

export const StyledSectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'stretch',
  },
}));