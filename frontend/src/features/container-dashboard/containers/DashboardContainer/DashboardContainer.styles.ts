import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledDashboardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
  maxWidth: '1440px',
  margin: '0 auto',
}));