import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { colors } from '../../../styles';

export const StyledInfoPanel = styled(Box)(({ theme }) => ({
  backgroundColor: colors.background.primary,
  border: `1px solid ${colors.border.primary}`,
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