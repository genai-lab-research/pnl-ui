import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledInfoPanel = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E4E7',
  borderRadius: '8px',
  padding: theme.spacing(3),
  height: 'fit-content',
}));

export const StyledInfoRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '16px',
  '& > :first-of-type': {
    minWidth: '80px',
    flexShrink: 0,
  },
  '& > :last-child': {
    textAlign: 'right',
  },
}));