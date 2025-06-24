import { styled } from '@mui/material/styles';
import { Box, ListItem, Typography } from '@mui/material';

export const StyledActivityPanel = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E4E7',
  borderRadius: '8px',
  padding: theme.spacing(3),
  height: 'fit-content',
}));

export const StyledActivityItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

export const StyledTimestamp = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: '12px',
  fontWeight: 400,
  color: '#71717A',
  marginTop: theme.spacing(0.5),
}));