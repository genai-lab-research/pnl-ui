import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledDashboard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#F7F9FD',
  
  '& .MuiAppBar-root': {
    backgroundColor: '#FFFFFF',
    color: theme.palette.text.primary,
  },
  
  '& .MuiToolbar-root': {
    minHeight: '64px',
    padding: theme.spacing(0, 3),
  },
}));