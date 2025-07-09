import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const StyledSettingsPanel = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E4E7',
  borderRadius: '8px',
  padding: theme.spacing(3),
  height: 'fit-content',
}));

export const StyledSettingRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 0),
  '& .MuiFormControlLabel-root': {
    margin: 0,
    '& .MuiFormControlLabel-label': {
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontWeight: 400,
      color: '#09090B',
    },
  },
}));

export const StyledSectionTitle = styled(Typography)(() => ({
  fontFamily: 'Roboto, sans-serif',
  fontSize: '16px',
  fontWeight: 700,
  lineHeight: '24px',
  color: '#000000',
}));