import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledSearchAndFiltersSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: theme.spacing(2),
  boxShadow: '0 2px 4px rgba(65, 64, 69, 0.1)',
  marginBottom: theme.spacing(3),
}));