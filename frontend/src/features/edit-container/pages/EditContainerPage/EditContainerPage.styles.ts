import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledPageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  position: 'relative'
}));